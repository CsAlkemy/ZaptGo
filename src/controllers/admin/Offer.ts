import {Controller, Get, PathParams, Post, Req, Res, Session, UseBefore} from "@tsed/common";
import {ifNotAdmin, ifNotLoggedIn} from "../../middlewares/SessionCheck";
import BaseController from "../../Core/BaseController";
import {Mongo} from "../../services/Mongo";
import {Notification, NotificationType} from "../../config/Notification";
import {Offers} from "../../models/Offer";
import {Data} from "../../config/SessionData";
import {METHOD} from "../../config/Config";
import {Action, TableAction} from "../../config/TableAction";
import {Datatable} from "../../libraries/Datatable";
import {Plugins, Url} from "../../config/Utility";
import Button = TableAction.Button;
import ButtonType = TableAction.ButtonType;
import makeUrl = Url.makeUrl;

@Controller("/offer")
@UseBefore(ifNotLoggedIn)
@UseBefore(ifNotAdmin)
export class Offer extends BaseController {
	constructor(private  mongo: Mongo) {
		super(mongo);
		this.config.view = "admin/offer";
	}

	@Get("/addOffer")
	@Post("/addOffer")
	async addOffer(@Res() res: Res, @Req() req: Req, @Session('user') user: any){

		if(req.method==='POST'){
			let {offerName, percentage, code, description}=req.body;
			let addOffer = new Offers();
			addOffer.offerName=offerName;
			addOffer.percentage=percentage;
			addOffer.code=code;
			addOffer.description=description;
			let offerObject= new this.mongo.OfferService(addOffer);
			await offerObject.save();

			let notification: Notification = {
				message: "New Offer Added successfully !",
				type: NotificationType.SUCCESS,
				title: "Added success"
			};
			req.session.notification.push(notification);
			return res.redirect('/admin/offer/offers');
		}else{
			this.config.render=('addOffer');
			await this.render(req, res);
		}

	}

	@Post("/getOffer")
	async getOffer(@Res() res: Res, @Req() req: Req, @Session('user') session: Data) {
		let offerObject = await this.mongo.OfferService.find({
			name: {$regex: new RegExp(req.body.term, 'i')},
			deleted: false
		});

		let offers = [];
		for (const pac of offerObject) {
			offers.push({id: pac._id, name: pac.offerName});
		}
		res.send(offers);
	}

	@Get('/offers')
	@Post("/offers")
	async offer(@Res() res: Res, @Req() req: Req, @Session("user")session: any) {
		if (req.method == METHOD.POST) {
			let action = new Action([
				new Button(ButtonType.SELF_LINK, makeUrl('/offer/editOffer/{$1}', session), '<i class="fa fa-edit"></i>'),
				new Button(ButtonType.DELETE, makeUrl('/offer/deleteOffer/{$1}', session), '<i class="fa fa-trash"></i>')]);

			let dt = new Datatable(this.mongo.OfferService, JSON.parse(req.body.request), {
				$and: [{
					deleted: false,
				}]
			});
			let data = await dt.generate(action);
			res.send(data);
		} else {
			this.config.render = "offers";
			this.config.pageScript.push(Plugins.dataTables, Plugins.selectize);
			await this.render(req, res);
		}
	}

	@Get('/editOffer/:offerID')
	@Post('/editOffer/:offerID')
	async editOffer(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('offerID') offerID: string) {

		if (req.method === METHOD.POST) {
			let {offerName, percentage, code, description}=req.body;
			let offerObject = await this.mongo.OfferService.findById(offerID);
			offerObject.offerName = offerName;
			offerObject.percentage=percentage;
			offerObject.code=code;
			offerObject.description=description;
			await offerObject.save();
			let notification: Notification = {
				message: "New Offer Added successfully !",
				type: NotificationType.SUCCESS,
				title: "Added success"
			};
			req.session.notification.push(notification);
			return res.redirect('/admin/offer/offers/');
		} else {
			this.config.data['offer'] = await this.mongo.OfferService.findById(offerID);
			this.config.render = "editOffer";
			await this.render(req,res);
		}
	}

	@Get('/deleteOffer/:offerID')
	async deleteOffer(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('offerID') offerID: string) {
		let offerObject = await this.mongo.OfferService.findById(offerID);
		offerObject.deleted = true;
		await offerObject.save();
		let notification: Notification = {
			message: "Offer Deleted successfully !",
			type: NotificationType.SUCCESS,
			title: "Delete success"
		};
		req.session.notification.push(notification);
		return res.redirect('back');
	}

}