import {Controller, Get, Post, Req, Res, Session, UseBefore} from "@tsed/common";
import BaseController from "../../Core/BaseController";
import {Mongo} from "../../services/Mongo";
import {ifNotLoggedIn, ifNotPartner} from "../../middlewares/SessionCheck";
import {Data} from "../../config/SessionData";
import {METHOD} from "../../config/Config";
import {Action, TableAction} from "../../config/TableAction";
import {Datatable} from "../../libraries/Datatable";
import {Plugins, Url} from "../../config/Utility";
import Button = TableAction.Button;
import ButtonType = TableAction.ButtonType;
import makeUrl = Url.makeUrl;


@Controller("/booking")
@UseBefore(ifNotLoggedIn)
@UseBefore(ifNotPartner)
export class Bookings extends BaseController {
	constructor(private mongo: Mongo) {
		super(mongo);
		this.config.view = "partner/booking";

	}

	@Post("/hotelBookings")
	@Get("/hotelBookings")
	async hotelBookings(@Res() res: Res, @Req() req: Req, @Session('user') session: Data) {
		if (req.method == METHOD.POST) {
			let action = new Action([
				new Button(ButtonType.SELF_LINK, makeUrl('/booking/{$1}', session), '<i class="fas fa-inbox" data-toggle="tooltip"  style="color: red" ></i>'),
				new Button(ButtonType.SELF_LINK, makeUrl('/booking/{$1}', session), '<i class="far fa-check-circle" style="color: green"></i>')]);

			let dt = new Datatable(this.mongo.BookingService, JSON.parse(req.body.request), {
				$and: [{
					deleted: false,
					hotelFlag:true,
					companyID:session.user._id

				}]
			});
			let data = await dt.generate(action);
			res.send(data);
		} else {
			this.config.render = "hotelBookings";
			this.config.pageScript.push(Plugins.dataTables, Plugins.selectize);
			await this.render(req, res);
		}
	}
	@Post("/packageBookings")
	@Get("/packageBookings")
	async bookings(@Res() res: Res, @Req() req: Req, @Session('user') session: Data) {
		if (req.method == METHOD.POST) {
			let action = new Action([
				new Button(ButtonType.SELF_LINK, makeUrl('/booking/{$1}', session), '<i class="fas fa-inbox" data-toggle="tooltip"  style="color: red" ></i>'),
				new Button(ButtonType.SELF_LINK, makeUrl('/booking/{$1}', session), '<i class="far fa-check-circle" style="color: green"></i>')]);


			let dt = new Datatable(this.mongo.BookingService, JSON.parse(req.body.request), {
				$and: [{
					deleted: false,
					packageFlag:true,
					companyID:session.user._id

				}]
			});
			let data = await dt.generate(action);
			res.send(data);
		} else {
			this.config.render = "packageBookings";
			this.config.pageScript.push(Plugins.dataTables, Plugins.selectize);
			await this.render(req, res);
		}
	}
}