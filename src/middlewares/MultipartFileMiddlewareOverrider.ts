import {
	EndpointInfo,
	EndpointMetadata,
	IMiddleware,
	OverrideProvider,
	Req,
	Res,
	ServerSettingsService
} from "@tsed/common";
import {MultipartFileMiddleware} from "@tsed/multipartfiles";
import * as Express from "express";
import * as multer from "multer";
import {BadRequest} from "ts-httpexceptions";
import {promisify} from "util";

var path = require('path');

@OverrideProvider(MultipartFileMiddleware)
export class MultipartFileMiddlewareOverrider implements IMiddleware {

	private multer: any = multer;

	constructor(private serverSettingsService: ServerSettingsService) {
	}

	async use(@EndpointInfo() endpoint: EndpointMetadata, @Req() req: Express.Request, @Res() res: Express.Response) {
		this.serverSettingsService.uploadDir = "public/uploads/";
		try {
			const endpointConfiguration = endpoint.store.get(MultipartFileMiddleware);
			return await promisify(this.invoke(endpointConfiguration))(req, res);
		} catch (er) {
			throw er.code ? new BadRequest(`${er.message} ${er.field || ""}`.trim()) : er;
		}
	}

	invoke(conf: any) {
		let dest = this.serverSettingsService.uploadDir;
		const options = Object.assign({dest}, this.serverSettingsService.get("multer") || {}, conf.options || {});
		if (!conf.any) {
			const fields = conf.fields.map(({name, maxCount}: any) => ({name, maxCount}));
			return this.multer(options).fields(fields);
		}
		return this.multer(options).any();
	}
}