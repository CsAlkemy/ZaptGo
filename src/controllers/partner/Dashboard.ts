import {Controller, Get, PathParams, Post, Req, Res, Session, UseBefore} from "@tsed/common";
import BaseController from "../../Core/BaseController";
import {Mongo} from "../../services/Mongo";
import {ifNotLoggedIn, ifNotPartner,} from "../../middlewares/SessionCheck";
import {Data} from "../../config/SessionData";
import {Plugins} from "../../config/Utility";
import {Notification, NotificationType} from "../../config/Notification";
import {MultipartFile} from "@tsed/multipartfiles";
import {MakeFileProperty} from "../../config/Config";

const bcrypt = require("bcryptjs");


@Controller("/dashboard")
@UseBefore(ifNotLoggedIn)
@UseBefore(ifNotPartner)
export class Dashboard extends BaseController {
	constructor(private  mongo: Mongo) {
		super(mongo);
		this.config.view = "partner/dashboard";
	}


	@Get("/")
	async dashboard(@Res() res: Res, @Req() req: Req, @Session('user') user: Data) {
		this.config.data["revenue"] = await this.mongo.BookingService.aggregate()
			.match({
				companyID: {
					$eq: user.user._id
				},
				_id: {
					$ne: null
				}
			})
			.project({
				date: {
					$dateToString: {
						format: "%Y-%m-%d",
						date: '$updatedAt'
					}
				},
				subtotal: 1
			})

			.group({
				_id: "$date",
				amount: {
					$sum: "$subtotal"
				}
			}).limit(30);
		this.config.pageScript.push(Plugins.chartJs);
		this.config.render = ("index");
		await this.render(req, res)
	}

	@Get("/profile/:partnerID")
	async profile(@Res() res: Res, @Req() req: Req, @Session('user') user: Data, @PathParams('partnerID') partnerID: string) {
		this.config.data['profile'] = await this.mongo.UserService.findById(partnerID);
		this.config.render = "profile";
		await this.render(req, res)
	}

	@Get("/changePassword/:partnerID")
	@Post("/changePassword/:partnerID")
	async changePassword(@Res() res: Res, @Req() req: Req, @Session('user') user: Data, @PathParams('partnerID') partnerID: string) {
		if(req.method==="POST"){
			let{password, newPass}=req.body;
			let partnerObject = await this.mongo.UserService.findById(partnerID);
			if(bcrypt.compareSync(password, partnerObject.password)){
				partnerObject.password= bcrypt.hashSync(newPass, 12);
				await partnerObject.save();
				let notification: Notification = {
					message: "Password changed successfully",
					type: NotificationType.SUCCESS,
					title: "Change success!"
				};
				req.session.notification.push(notification);
				return res.redirect('/partner/dashboard');
			}else {
				let notification: Notification = {
					message: "Previous Password not Matched!",
					type: NotificationType.WARNING,
					title: "Change failed!"
				};
				req.session.notification.push(notification);
			}
		}
		let partnerObject = await this.mongo.UserService.findById(partnerID);
		this.config.data['partner']=await this.mongo.UserService.findById(partnerID);
		this.config.render = "changePassword";
		await this.render(req, res)
	}

	@Get("/editProfile/:partnerID")
	@Post("/editProfile/:partnerID")
	async editProfile(@Res() res: Res, @Req() req: Req, @Session('user') user: Data, @PathParams('partnerID') partnerID: string,
	                  @MultipartFile('image') image: Express.Multer.File) {
		if (req.method === "POST"){
			let {name, company, email, phone, address} = req.body;
			let partnerObject = await this.mongo.UserService.findById(partnerID);
			partnerObject.name = name;
			partnerObject.email = email;
			partnerObject.company = company;
			partnerObject.phone = phone;
			partnerObject.address = address;
			if (image) {
				partnerObject.image = MakeFileProperty(image);
			}
			await partnerObject.save();

			let notification: Notification = {
				message: "Company Edited successfully !",
				type: NotificationType.SUCCESS,
				title: "Edit success"
			};
			req.session.notification.push(notification);
			return res.redirect('/partner/dashboard/profile/' + partnerID);
		}
		this.config.data['partner'] = await this.mongo.UserService.findById(partnerID);
		this.config.render = "editProfile";
		await this.render(req, res)
	}

	@Get("/test")
	async test(@Res() res: Res, @Req() req: Req, @Session('user') user: any) {
		this.config.render = "test";
		await this.render(req, res)
	}

}