import {Controller, Get, PathParams, Post, Req, Res, Session, UseBefore} from "@tsed/common";
import BaseController from "../../Core/BaseController";
import {Mongo} from "../../services/Mongo";
import {ifNotAdmin, ifNotLoggedIn} from "../../middlewares/SessionCheck";
import {Data} from "../../config/SessionData";
import {METHOD} from "../../config/Config";
import {Action, TableAction} from "../../config/TableAction";
import {Plugins, Url} from "../../config/Utility";
import {Datatable} from "../../libraries/Datatable";
import {Package} from "../../models/Package";
import ButtonType = TableAction.ButtonType;
import Button = TableAction.Button;
import makeUrl = Url.makeUrl;
import {Notification, NotificationType} from "../../config/Notification";


@Controller("/property")
@UseBefore(ifNotLoggedIn)
@UseBefore(ifNotAdmin)
export class Property extends BaseController {
	constructor(private mongo: Mongo) {
		super(mongo);
		this.config.view = "admin/property";

	}
	// Packages ********************************************************************************************************

	@Post("/getPackages")
	async getPackages(@Res() res: Res, @Req() req: Req, @Session('user') session: Data) {
		let packageObject = await this.mongo.PackageService.find({
			name: {$regex: new RegExp(req.body.term, 'i')},
			deleted: false,
			status:true
		});

		let test = new Package();
		let a=test.companyID;

		let packages = [];
		for (const pac of packageObject) {
			packages.push({id: pac._id, name: pac.name});
		}
		res.send(packages);
	}

	@Get('/packages')
	@Post("/packages")
	async packages(@Res() res: Res, @Req() req: Req, @Session("user")session: any) {
		if (req.method == METHOD.POST) {
			let action = new Action([
				new Button(ButtonType.DELETE, makeUrl('/property/archivePackage/{$1}', session), '<i class="fas fa-inbox" data-toggle="tooltip"  style="color: red" title="Archive Packages" ></i>'),
				 /*new Button(ButtonType.SELF_LINK, makeUrl('/property/activePackage/{$1}', session), '<i class="far fa-check-circle" style="color: green"></i>')*/]);

			let dt = new Datatable(this.mongo.PackageService, JSON.parse(req.body.request), {
				$and: [{
					deleted: false,
				}]
			});
			let data = await dt.generate(action);
			res.send(data);
		} else {
			this.config.render = "packages";
			this.config.pageScript.push(Plugins.dataTables, Plugins.selectize);
			await this.render(req, res);
		}
	}

	@Get('/archivePackage/:packageID')
	async archivePackage(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('packageID') packageID: string) {
		let packageObject = await this.mongo.PackageService.findById(packageID);
		packageObject.deleted=true;
		await packageObject.save();
		let notification: Notification = {
			message: "Package Archived successfully !",
			type: NotificationType.SUCCESS,
			title: "Archive success"
		};
		req.session.notification.push(notification);
		return res.redirect('back');
	}
	@Get('/archiveHotel/:hotelID')
	async archiveHotel(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('hotelID') hotelID: string) {
		let hotelObject = await this.mongo.HotelService.findById(hotelID);
		hotelObject.deleted=true;
		await hotelObject.save();
		let notification: Notification = {
			message: "Hotel Archived successfully !",
			type: NotificationType.SUCCESS,
			title: "Archive success"
		};
		req.session.notification.push(notification);
		return res.redirect('back');
	}

	@Get('/activePackage/:packageID')
	async activePackage(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('packageID') packageID: string) {
		let packageObject = await this.mongo.PackageService.findById(packageID);
		packageObject.status=true;
		await packageObject.save();
		let notification: Notification = {
			message: "Package Resume successfully !",
			type: NotificationType.SUCCESS,
			title: "Resume success"
		};
		req.session.notification.push(notification);
		return res.redirect('back');
	}
	// Package Section end here

	// Start of Hotel Section

	@Post("/getHotel")
	async getHotel(@Res() res: Res, @Req() req: Req, @Session('user') session: Data) {
		let hotelObject = await this.mongo.HotelService.find({
			name: {$regex: new RegExp(req.body.term, 'i')},
			deleted: false,
			status:true
		});

		let hotels = [];
		for (const hot of hotelObject) {
			hotels.push({id: hot._id, name: hot.name});
		}
		res.send(hotels);
	}

	@Get('/hotel')
	@Post("/hotel")
	async hotel(@Res() res: Res, @Req() req: Req, @Session("user")session: any) {
		if (req.method == METHOD.POST) {
			let action = new Action([
				new Button(ButtonType.DELETE, makeUrl('/property/archiveHotel/{$1}', session), '<i class="fas fa-trash-alt" style="color: red"></i>'),
				/*new Button(ButtonType.DELETE, makeUrl('/deleteHotel/{$1}', session), '<i  style="color: red" class="fas fa-inbox"></i>')*/]);

			let dt = new Datatable(this.mongo.HotelService, JSON.parse(req.body.request), {
				$and: [{
					deleted: false,
					status:true
				}]
			});
			let data = await dt.generate(action);
			res.send(data);
		} else {
			this.config.render = "hotels";
			this.config.pageScript.push(Plugins.dataTables, Plugins.selectize);
			await this.render(req, res);
		}
	}
	/*@Get('/deleteHotel/:hotelID')
	async deleteHotel(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('hotelID') hotelID: string) {
		let hotelObject = await this.mongo.HotelService.findById(hotelID);
		hotelObject.deleted = true;
		await hotelObject.save();
		let notification: Notification = {
			message: "Partner removed successfully !",
			type: NotificationType.SUCCESS,
			title: "Blocked success"
		};
		req.session.notification.push(notification);
		return res.redirect('back');
	}*/


}