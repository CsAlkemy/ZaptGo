import {Controller, Get, PathParams, Post, Req, Res, Session, UseBefore} from "@tsed/common";
import BaseController from "../../Core/BaseController";
import {Mongo} from "../../services/Mongo";
import {ifNotAdmin, ifNotLoggedIn} from "../../middlewares/SessionCheck";
import {Plugins} from "../../config/Utility";
import {Data} from "../../config/SessionData";
import {MultipartFile} from "@tsed/multipartfiles";
import {MakeFileProperty} from "../../config/Config";
import {Notification, NotificationType} from "../../config/Notification";

const bcrypt = require("bcryptjs");


@Controller("/")
@UseBefore(ifNotLoggedIn)
@UseBefore(ifNotAdmin)
export class Dashboard extends BaseController {
	constructor( private  mongo: Mongo){
	super (mongo);
	this.config.view="admin/dashboard";
	}


	@Get("/dashboard")
	async test(@Res() res: Res, @Req() req: Req, @Session('user') user: any) {

		let countHotel= await this.mongo.HotelService.countDocuments({
			deleted:false
		});

		this.config.data['hotels']=countHotel;

		let countPackage= await this.mongo.PackageService.countDocuments({
			deleted:false
		});
		this.config.data['packages']=countPackage;

		let countTraveler= await this.mongo.UserService.countDocuments({
			deleted:false,
			userType:2
		});
		this.config.data['traveler']=countTraveler;

		let booking= await this.mongo.BookingService.countDocuments({
			deleted:false,
		});
		this.config.data['booking']=booking;

		this.config.data["bookingDate"] = await this.mongo.BookingService.aggregate()
			.project({
				date:{
					$dateToString:{
						format:"%Y-%m",
						date:'$updatedAt'
					}
				}
			})
			.group({
				_id: "$date",
				count: {
					$sum: 1
				},
			})
			.match({
				_id: {
					$ne: null
				}
			});
		this.config.data["revenue"] = await this.mongo.BookingService.aggregate()
			.project({
				date:{
					$dateToString: {
						format: "%Y-%m-%d",
						date: '$updatedAt'
					}
				},
				totalPrice:1

			})
			.group({
				_id:"$date",
				amount:{
					$sum: "$totalPrice"
				}
			})
			.match({
				_id:{
					$ne:null
				}
			}).limit(30);

		this.config.data["doughnut"] = await this.mongo.BookingService.aggregate()
			.project({
				serviceInclude:1,
				subtotal:1

			})
			.group({
				_id:null,
				tourgo:{
					$sum: "$serviceInclude"
				},
				partner:{
					$sum: "$subtotal"
				}
			})
			.match({
			});




		this.config.pageScript.push(Plugins.chartJs);
		this.config.render=("index");
		await this.render(req,res)
	}

	@Get("/profile/:adminID")
	@Post("/profile/:adminID")
	async profile(@Res() res: Res, @Req() req: Req, @Session('user') user: any, @PathParams('adminID') adminID:string) {
		this.config.data['profile']= await this.mongo.UserService.findById(adminID);
		this.config.render=("profile");
		await this.render(req,res)
	}

	@Get("/editProfile/:adminID")
	@Post("/editProfile/:adminID")
	async editProfile(@Res() res: Res, @Req() req: Req, @Session('user') user: Data, @PathParams('adminID') adminID: string, @MultipartFile('image') image: Express.Multer.File) {
		if (req.method === "POST") {
			let {name, email, phone} = req.body;
			let adminObject = await this.mongo.UserService.findById(adminID);
			adminObject.name = name;
			adminObject.email = email;
			adminObject.phone = phone;
			if (image) {
				adminObject.image = MakeFileProperty(image);
			}
			await adminObject.save();

			let notification: Notification = {
				message: "Admin Details Edited successfully !",
				type: NotificationType.SUCCESS,
				title: "Edit success"
			};
			req.session.notification.push(notification);
			return res.redirect('/admin/profile/' + adminID);
		}
		this.config.data['adminData'] = await this.mongo.UserService.findById(adminID);
		this.config.render = "editProfile";
		await this.render(req, res)
	}

	@Get("/changePassword/:adminID")
	@Post("/changePassword/:adminID")
	async changePassword(@Res() res: Res, @Req() req: Req, @Session('user') user: Data, @PathParams('adminID') adminID: string) {
		if(req.method==="POST"){
			let{password, newPass}=req.body;
			let partnerObject = await this.mongo.UserService.findById(adminID);
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
		let partnerObject = await this.mongo.UserService.findById(adminID);
		this.config.data['admin']=await this.mongo.UserService.findById(adminID);
		this.config.render = "changePassword";
		await this.render(req, res)
	}

}
