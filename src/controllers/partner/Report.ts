import {Controller, Get, QueryParams, Req, Res, Session, UseBefore} from "@tsed/common";
import BaseController from "../../Core/BaseController";
import {Mongo} from "../../services/Mongo";
import {ifNotLoggedIn, ifNotPartner} from "../../middlewares/SessionCheck";
import {Data} from "../../config/SessionData";
import {Types} from "mongoose";
import {Plugins} from "../../config/Utility";


@Controller("/report")
@UseBefore(ifNotLoggedIn)
@UseBefore(ifNotPartner)
export class report extends BaseController {
	constructor(private mongo: Mongo) {
		super(mongo);
		this.config.view = "partner/report";

	}

	@Get('/hotelBooking')
	async hotelBooking(@Res() res: Res, @Req() req: Req, @Session() session: Data) {
		this.config.pageScript.push(Plugins.dataTables, Plugins.fullCalendar);
		this.config.render = "hotelReport";
		await this.render(req, res);
	}
	@Get('/packageBooking')
	async packageBooking(@Res() res: Res, @Req() req: Req, @Session() session: Data) {
		this.config.pageScript.push(Plugins.dataTables, Plugins.fullCalendar);
		this.config.render = "packageReport";
		await this.render(req, res);
	}

}