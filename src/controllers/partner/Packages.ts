import {Controller, Get, PathParams, Post, Req, Res, Session, UseBefore} from "@tsed/common";
import BaseController from "../../Core/BaseController";
import {Mongo} from "../../services/Mongo";
import {ifNotLoggedIn, ifNotPartner,} from "../../middlewares/SessionCheck";
import {Plugins} from "../../config/Utility";
import {Package} from "../../models/Package";
import {Notification, NotificationType} from "../../config/Notification";
import {MultipartFile} from "@tsed/multipartfiles";
import {MakeFileProperty} from "../../config/Config";
import {Data} from "../../config/SessionData";


@Controller("/package")
@UseBefore(ifNotLoggedIn)
@UseBefore(ifNotPartner)
export class Dashboard extends BaseController {
	constructor(private  mongo: Mongo) {
		super(mongo);
		this.config.view = "partner/Package";
	}


	@Get("/addPackage")
	@Post("/addPackage")
	async addPackage(@Res() res: Res, @Req() req: Req, @Session('user') user: any ,@MultipartFile('image') image: Express.Multer.File) {
		if (req.method === 'POST') {
			let {packageName, bookStart, bookEnd, departure, returnDate, person, day, night, start, overview, include, cancelPolicy, places, price, priceKids, possibleDescription, food, packageDescription} = req.body;
			let packageObject = new Package();
			packageObject.companyID=user.user._id;
			packageObject.name=packageName;
			packageObject.bookStart=bookStart;
			packageObject.bookEnd=bookEnd;
			packageObject.departure=departure;
			packageObject.return=returnDate;
			packageObject.noOfPerson=person;
			packageObject.day=day;
			packageObject.night=night;
			packageObject.startPoint=start;
			packageObject.overview=overview;
			packageObject.include=include;
			packageObject.cancelPolicy=cancelPolicy;
			packageObject.places=places;
			packageObject.price=price;
			packageObject.extraPrice=priceKids;
			packageObject.possibleDescription=possibleDescription;
			packageObject.foodMenu=food;
			packageObject.packageDescription=packageDescription;
			if (image) {
				packageObject.image = MakeFileProperty(image);
			}


			let packageService =new this.mongo.PackageService(packageObject);
			await packageService.save();
			let notification: Notification = {
				message: "Package Added successfully !",
				type: NotificationType.SUCCESS,
				title: "Added success"
			};
			req.session.notification.push(notification);
			return res.redirect('back');

		} else {
			this.config.render = ("addPackage");
			this.config.pageScript.push(Plugins.dateRangePicker);
			await this.render(req, res)

		}
	}
	@Get("/viewPackage")
	async viewPackage(@Res() res: Res, @Req() req: Req, @Session('user') session: Data) {
		let packages = await this.mongo.PackageService.find({
			companyID: session.user._id,
			deleted:false,
			status:true
		})
		this.config.data['packages'] = packages;

		this.config.render ='viewPackage';
		this.config.pageScript.push(Plugins.selectize);
		await this.render(req, res);
	}

	@Get("/deletePackage/:packageID/")
	async deleteHotel(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('packageID')packageID: string,) {

		let packageObject = await this.mongo.PackageService.findById(packageID);
		packageObject.deleted = true;
		await packageObject.save();
		let notification: Notification = {
			message: "Package Deleted successfully !",
			type: NotificationType.SUCCESS,
			title: "Delete success"
		};
		req.session.notification.push(notification);
		return res.redirect('back');
	}
}