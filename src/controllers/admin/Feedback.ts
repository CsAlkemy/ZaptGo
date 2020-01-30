import {Controller, Get, PathParams, Post, Req, Res, Session, UseBefore} from "@tsed/common";
import BaseController from "../../Core/BaseController";
import {Mongo} from "../../services/Mongo";
import {ifNotAdmin, ifNotLoggedIn} from "../../middlewares/SessionCheck";
import {METHOD} from "../../config/Config";
import {Action, TableAction} from "../../config/TableAction";
import {Datatable} from "../../libraries/Datatable";
import {Plugins, Url} from "../../config/Utility";
import Button = TableAction.Button;
import ButtonType = TableAction.ButtonType;
import makeUrl = Url.makeUrl;
import {Data} from "../../config/SessionData";
import {Notification, NotificationType} from "../../config/Notification";
import {Email} from "../../services/Email";

const bcrypt = require("bcryptjs");
var Cryptr = require('cryptr');
var moment = require('moment');
const cryptr = new Cryptr(process.env.secret);


@Controller("/feedback")
@UseBefore(ifNotLoggedIn)
@UseBefore(ifNotAdmin)
export class feedback extends BaseController {
	constructor(private email: Email, private mongo: Mongo) {
		super(mongo);
		this.config.view = "admin/feedback";
	}
	@Get('/questions')
	@Post("/questions")
	async areas(@Res() res: Res, @Req() req: Req, @Session("user")session: any) {
		if (req.method == METHOD.POST) {
			let action = new Action([
				new Button(ButtonType.SELF_LINK, makeUrl('/feedback/sendFeedback/{$1}', session), '<i class="fas fa-rss-square btn-lg"></i>'),
				new Button(ButtonType.DELETE, makeUrl('/feedback/ignoreFeedback/{$1}', session), '<i class="fas fa-times-circle btn-lg" style="color: red"></i>')]);
			let dt = new Datatable(this.mongo.QuestionService, JSON.parse(req.body.request), {
				$and: [{
					deleted: false,
				}]
			});
			let data = await dt.generate(action);
			res.send(data);
		} else {
			this.config.render = "feedbacklist";
			this.config.pageScript.push(Plugins.dataTables, Plugins.selectize);
			await this.render(req, res);
		}
	}

	@Get('/sendFeedback/:feedbackID')
	@Post("/sendFeedback/:feedbackID")
	async feedback(@Res() res: Res, @Req() req: Req, @Session("user")session: Data, @PathParams('feedbackID') feedbackID: string){
		let path = 'template/email';
		if (req.method == METHOD.POST) {
			let{answer, email, name}=req.body;
			let feedbackObject = await this.mongo.QuestionService.findById(feedbackID);
			feedbackObject.email=email;
			feedbackObject.answer=answer;
			feedbackObject.name=name;
			feedbackObject.deleted=true;
			await feedbackObject.save();
			res.render(path, {link: ""}, async (err, html) => {
				let status = await this.email.transporter.sendMail({
					from: 'alkemy48@gmail.com',
					to:feedbackObject.email,
					subject: 'Tourgo Customer Feedback Message',
					html: '<h3>TOURGO CUSTOMER FEEDBACK.</h3>'+'<p>Thank You for your Question. We, Tourgo are here to help you with all the difficulties.</p>'+feedbackObject.answer,

				});
				console.log(status);
			});

			let notification: Notification = {
				message: "Email Sent successfully !",
				type: NotificationType.SUCCESS,
				title: "Email Sent"
			};
			req.session.notification.push(notification);
			return res.redirect('/admin/feedback/questions');

		} else {
			this.config.data['feedback']=await this.mongo.QuestionService.findById(feedbackID);
			this.config.render = "feedback";
			await this.render(req, res);
		}
	}
	@Get('/ignoreFeedback/:feedbackID')
	async deleteOffer(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('feedbackID') feedbackID: string) {
		let feedbackObject = await this.mongo.QuestionService.findById(feedbackID);
		feedbackObject.deleted = true;
		await feedbackObject.save();
		let notification: Notification = {
			message: "Feedback Deleted successfully !",
			type: NotificationType.SUCCESS,
			title: "Delete success"
		};
		req.session.notification.push(notification);
		return res.redirect('back');
	}


}