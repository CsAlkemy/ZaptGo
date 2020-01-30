import {IMiddleware, Middleware, Request, Res} from "@tsed/common";
import {Url} from "../config/Utility";
import {lcFirst, ucFirst} from "../libraries/Utility";
import * as moment from 'moment';
import {Types} from "mongoose";


@Middleware()
export class ViewLocals implements IMiddleware {

	constructor() {
	}

	async use(@Request() req: Request, @Res() res: Res) {
		let locals = res.locals;
		if (process.env.NODE_ENV === 'development') {
			locals.pretty = true;
		} else {
			locals.pretty = false;
		}
		locals.ucFirst = function (value: string, restIsLower: boolean = false) {
			return ucFirst(value, restIsLower);
		};
		locals.lcFirst = function (value: string, restIsLower: boolean = false) {
			return lcFirst(value, restIsLower);
		};
		locals.formatNumber = function (value) {
			return parseFloat(value).toFixed(2);
		};
		locals.getCreationTime = function (value) {
			return Types.ObjectId(value).getTimestamp();
		};
		locals.currencyFormat = function (value) {
			value = parseFloat(value).toFixed(2);
				return "$" + value;

		};
		locals.dateFormat = function (date: any, format: string = "DD MMM, Y hh:mm A") {
				return moment(date).format(format);
		};
		locals.moment = function (date?: any, format?: string) {
			if (date) {
				if (format) {
					return moment(date, format);
				} else {
					return moment(date);
				}
			} else {
				return moment();
			}
		};
		locals.MOMENT = function () {
			return moment;
		};
		locals.replacer = function (match, pIndent, pKey, pVal, pEnd) {
			let key = '<span class=json-key>';
			let val = '<span class=json-value>';
			let str = '<span class=json-string>';
			let r = pIndent || '';
			if (pKey)
				r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
			if (pVal)
				r = r + (pVal[0] == '"' ? str : val) + pVal + '</span>';
			return r + (pEnd || '');
		};
		locals.prettyPrint = function (obj) {
			let jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/mg;
			return JSON.stringify(obj, null, 3)
				.replace(/&/g, '&amp;').replace(/\\"/g, '&quot;')
				.replace(/</g, '&lt;').replace(/>/g, '&gt;')
				.replace(jsonLine, locals.replacer);
		};

		locals.makeUrl = function (url: string): string {
			return Url.makeUrl(url, req.session.user);
		};

	}
}