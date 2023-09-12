import {Controller, Get, PathParams, Post, Req, Res, Session, UseBefore} from "@tsed/common";
import BaseController from "../../Core/BaseController";
import {Mongo} from "../../services/Mongo";
import {ifNotAdmin, ifNotLoggedIn} from "../../middlewares/SessionCheck";
import {User} from "../../models/User";
import {Notification, NotificationType} from "../../config/Notification";
import {Email} from "../../services/Email";
import {METHOD, UserType} from "../../config/Config";
import {Action, TableAction} from "../../config/TableAction";
import {Datatable} from "../../libraries/Datatable";
import {Plugins, Url} from "../../config/Utility";
import Button = TableAction.Button;
import ButtonType = TableAction.ButtonType;
import makeUrl = Url.makeUrl;
import {Data} from "../../config/SessionData";

const bcrypt = require("bcryptjs");
var Cryptr = require('cryptr');
var moment = require('moment');
const cryptr = new Cryptr(process.env.secret);


@Controller("/partner")
@UseBefore(ifNotLoggedIn)
@UseBefore(ifNotAdmin)
export class Dashboard extends BaseController {
	constructor(private email: Email, private mongo: Mongo) {
		super(mongo);
		this.config.view = "admin/partner";
	}

	//************************** add partner section******************************************

	@Get("/addPartner")
	@Post("/addPartner")
	async test(@Res() res: Res, @Req() req: Req, @Session('user') user: any) {
		let path = 'template/email';
		if (req.method === 'POST') {

			let {name, company, email, phone, password} = req.body;
			let userPartner = new User();
			userPartner.name = name;
			userPartner.company = company;
			userPartner.email = email;
			userPartner.phone = phone;
			userPartner.password = bcrypt.hashSync(password, 12);
			userPartner.userType = UserType.PARTNER;
			let userService = new this.mongo.UserService(userPartner);
			await userService.save();

			let link = req.protocol + '://' + req.get('host') + '/confirm';
			link += '?v=' + cryptr.encrypt(userService._id.toString());
			link += '&t=' + cryptr.encrypt(moment().unix());
			res.render(path, {link: link}, async (err, html) => {
				let status = await this.email.transporter.sendMail({
					from: 'alkemy48@gmail.com',
					to: email,
					subject: 'Partner Confirmation message',
					html: '<h1>Welcome To TOURGO.</h1><h3>Your Account has been created !</h3><h4>Your Email: </h4>' + email + '<h4>Your Password: </h4>' + password,

				});
				console.log(status);
			});

			let notification: Notification = {
				message: "Partner registered successfully !",
				type: NotificationType.SUCCESS,
				title: "Added success"
			};
			req.session.notification.push(notification);
			return res.redirect('/admin/partner/partner');

		} else {

			this.config.render = ("addPartner");
			await this.render(req, res)

		}

	}

	//***********************get partner******************************

	@Post("/getPartner")
	async getPartner(@Res() res: Res, @Req() req: Req, @Session('user') session: Data) {
		let PartnerObject = await this.mongo.UserService.find({
			name: {$regex: new RegExp(req.body.term, 'i')},
			deleted: false
		});

		let partner = [];
		for (const pac of PartnerObject) {
			partner.push({id: pac._id, name: pac.name});
		}
		res.send(partner);
	}

	//***********************approved partner list**************************

	@Get('/partner')
	@Post("/partner")
	async partner(@Res() res: Res, @Req() req: Req, @Session("user")session: any) {
		if (req.method == METHOD.POST) {
			let action = new Action([
				new Button(ButtonType.SELF_LINK, makeUrl('/partner/partnerDetails/{$1}', session), '<i class="fas fa-eye"></i>'),
				new Button(ButtonType.DELETE, makeUrl('/partner/blockPartner/{$1}', session), '<i style="color: red" class="fas fa-ban"></i>')]);

			let dt = new Datatable(this.mongo.UserService, JSON.parse(req.body.request), {
				$and: [{
					userType: UserType.PARTNER,
					deleted: false,
				}]
			});
			let data = await dt.generate(action);
			res.send(data);
		} else {
			this.config.render = "partner";
			this.config.pageScript.push(Plugins.dataTables, Plugins.selectize);
			await this.render(req, res);
		}
	}

	//*******************partner request*************

	@Get('/partnerRequest')
	@Post("/partnerRequest")
	async partnerRequest(@Res() res: Res, @Req() req: Req, @Session("user")session: any) {
		if (req.method == METHOD.POST) {
			let action = new Action([
				new Button(ButtonType.SELF_LINK, makeUrl('/partner/partnerApprove/{$1}', session), '<i class="fas  fa-check"></i>'),
				new Button(ButtonType.DELETE, makeUrl('/partner/deletePartner/{$1}', session), '<i class="fas fa-times" style="color: red"></i>',"Want to delete this request?")]);
			let dt = new Datatable(this.mongo.UserService, JSON.parse(req.body.request), {
				$and: [{
					partnerRequest: true,
					deleted: false,
				}]
			});
			let data = await dt.generate(action);
			res.send(data);
		} else {
			this.config.render = "partnerRequest";
			this.config.pageScript.push(Plugins.dataTables, Plugins.selectize);
			await this.render(req, res);
		}
	}

	@Get('/deletePartner/:partnerID')
	async deleteOffer(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('partnerID') partnerID: string) {
		let partnerObject = await this.mongo.UserService.findById(partnerID);
		partnerObject.deleted = true;
		await partnerObject.save();
		let notification: Notification = {
			message: "Request Deleted successfully !",
			type: NotificationType.SUCCESS,
			title: "Delete success"
		};
		req.session.notification.push(notification);
		return res.redirect('back');
	}

	//*******************************partner approve*****************


	@Get("/partnerApprove/:partnerID")
	@Post("/partnerApprove/:partnerID")
	async partnerApprove(@Res() res: Res, @Req() req: Req, @Session('user') user: any, @PathParams('partnerID')partnerID: string) {
		let path = 'template/email';
		if (req.method === 'POST') {
			let {password} = req.body;
			console.log(req.body);
			let partnerObject = await this.mongo.UserService.findById(partnerID);
			partnerObject.password = bcrypt.hashSync(password, 12);
			partnerObject.userType = UserType.PARTNER;
			partnerObject.partnerRequest = false;
			await partnerObject.save();
			console.log(partnerObject.email);

			console.log(partnerObject);

			let link = req.protocol + '://' + req.get('host') + '/confirm';
			link += '?v=' + cryptr.encrypt(partnerObject._id.toString());
			link += '&t=' + cryptr.encrypt(moment().unix());
			res.render(path, {link: link}, async (err, html) => {
				let status = await this.email.transporter.sendMail({
					from: 'alkemy48@gmail.com',
					to: partnerObject.email,
					subject: 'Partner Confirmation message',
					html: '<h1>Welcome To TOURGO.</h1><h3>Your Account has been created !</h3><h4>Your Email: </h4>' + partnerObject.email + '<h4>Your Password: </h4>' + password,

				});
				console.log(status);
			});

			let notification: Notification = {
				message: "Partner registered successfully !",
				type: NotificationType.SUCCESS,
				title: "Added success"
			};
			req.session.notification.push(notification);
			return res.redirect('/admin/partner/partner');

		} else {
			this.config.data['partner'] = await this.mongo.UserService.findById(partnerID);
			console.log(this.config.data['partner']);
			this.config.render = ("approvePartner");
			await this.render(req, res)

		}

	}

	//******************************block partner****************

	@Get('/blockPartner/:partnerID')
	async blockPartner(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('partnerID') partnerID: string) {
		let blockObject = await this.mongo.UserService.findById(partnerID);
		blockObject.deleted = true;
		blockObject.userType = null;
		await blockObject.save();
		let notification: Notification = {
			message: "Partner blocked successfully !",
			type: NotificationType.SUCCESS,
			title: "Blocked success"
		};
		req.session.notification.push(notification);
		return res.redirect('back');
	}


	//End of partner sections


	//Start of Traveller sections

	@Post("/getTraveller")
	async getTraveller(@Res() res: Res, @Req() req: Req, @Session('user') session: Data) {
		let travelerObject = await this.mongo.UserService.find({
			name: {$regex: new RegExp(req.body.term, 'i')},
			deleted: false
		});

		let traveler = [];
		for (const pac of travelerObject) {
			traveler.push({id: pac._id, name: pac.name});
		}
		res.send(traveler);
	}

	@Get('/traveler')
	@Post("/traveler")
	async traveler(@Res() res: Res, @Req() req: Req, @Session("user")session: any) {
		if (req.method == METHOD.POST) {
			let action = new Action([
				new Button(ButtonType.POPUP, makeUrl('/admin/partner/editTraveler/{$1}', session), '<i class="fa fa-edit"></i>', "#remoteModal1"),
				new Button(ButtonType.DELETE, makeUrl('/admin/partner/deleteTraveler/{$1}', session), '<i class="fa fa-trash"></i>')]);

			let dt = new Datatable(this.mongo.UserService, JSON.parse(req.body.request), {
				$and: [{
					userType: UserType.USER,
					deleted: false,
				}]
			});
			let data = await dt.generate(action);
			res.send(data);
		} else {
			this.config.render = "traveler";
			this.config.pageScript.push(Plugins.dataTables, Plugins.selectize);
			await this.render(req, res);
		}
	}

	//End of Traveller sections

}
