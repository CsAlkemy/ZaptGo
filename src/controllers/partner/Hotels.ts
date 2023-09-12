import {Controller, Get, PathParams, Post, Req, Res, Session, UseBefore} from "@tsed/common";
import BaseController from "../../Core/BaseController";
import {Mongo} from "../../services/Mongo";
import {ifNotLoggedIn, ifNotPartner,} from "../../middlewares/SessionCheck";
import {Plugins} from "../../config/Utility";
import {MultipartFile} from "@tsed/multipartfiles";
import {hotel} from "../../models/Hotel";
import {Notification, NotificationType} from "../../config/Notification";
import {MakeFileProperty} from "../../config/Config";
import {Room} from "../../schema/Room";
import {Data} from "../../config/SessionData";


@Controller("/hotel")
@UseBefore(ifNotLoggedIn)
@UseBefore(ifNotPartner)
export class Dashboard extends BaseController {
	constructor(private  mongo: Mongo) {
		super(mongo);
		this.config.view = "partner/hotel";

	}

	@Get("/addHotel")
	@Post('/addHotel')
	async addHotel(@Res() res: Res, @Req() req: Req, @Session('user') user: any,
	               @MultipartFile('image') image: Express.Multer.File) {
		if (req.method === 'POST') {
			let {area, name, star, fax, email, phone, alternativePhone, address, addressTwo, city, postCode, country, noOfRoom, about, feature, checkIn, checkOut} = req.body;

			let hotelObject = new hotel();
			hotelObject.companyID = user.user._id;
			hotelObject.area = area;
			hotelObject.name = name;
			hotelObject.star = star;
			hotelObject.fax = fax;
			hotelObject.email = email;
			hotelObject.phone = phone;
			hotelObject.alternativePhone = alternativePhone;
			hotelObject.address = address;
			hotelObject.addressTwo = addressTwo;
			hotelObject.checkIn = checkIn;
			hotelObject.checkOut = checkOut;
			hotelObject.city = city;
			hotelObject.postCode = postCode;
			hotelObject.country = country;
			hotelObject.noOfRoom = noOfRoom;
			hotelObject.about = about;
			hotelObject.feature = feature;

			if (image) {
				hotelObject.image = MakeFileProperty(image);
			}

			let packageService = new this.mongo.HotelService(hotelObject);
			await packageService.save();

			let notification: Notification = {
				message: "Hotel Added successfully !",
				type: NotificationType.SUCCESS,
				title: "Added success"
			};
			req.session.notification.push(notification);
			return res.redirect('back');

		} else {
			this.config.render = ('addHotel');
			this.config.pageScript.push(Plugins.dateRangePicker, Plugins.jqueryTimepicker, Plugins.selectize);
			await this.render(req, res);


		}
	}

	@Get("/addRoom")
	@Post('/addRoom')
	async addRoom(@Res() res: Res, @Req() req: Req, @Session('user') user: any,
	              @MultipartFile('image') image: Express.Multer.File) {
		if (req.method === 'POST') {
			let {hotel, name, capacityAdult, capacityChild, noOfRoom, size, price, smokingPolicy, amenities} = req.body;

			let roomObject = new Room();
			roomObject.hotel = hotel;
			roomObject.name = name;
			roomObject.capacityAdult = capacityAdult;
			roomObject.CapacityOther = capacityChild;
			roomObject.noOfRoom = noOfRoom;
			roomObject.size = size;
			roomObject.price = price;
			roomObject.smokingPolicy = smokingPolicy;
			roomObject.amenities = amenities;
			if (image) {
				roomObject.image = MakeFileProperty(image);
			}

			let hotelService = await this.mongo.HotelService.findById(hotel);
			hotelService.rooms.push(roomObject);
			await hotelService.save();
			let notification: Notification = {
				message: "Room Added successfully !",
				type: NotificationType.SUCCESS,
				title: "Added success"
			};
			req.session.notification.push(notification);
			return res.redirect('back');

		} else {
			this.config.render = ('addRoom');
			this.config.pageScript.push(Plugins.selectize);
			await this.render(req, res);

		}
	}

	@Post("/getArea")
	async getArea(@Res() res: Res, @Req() req: Req, @Session('user') session: Data) {
		let areaObject = await this.mongo.AreaService.find({
			name: {$regex: new RegExp(req.body.term, 'i')},
			deleted: false,
		});
		let areas = [];
		for (const area of areaObject) {
			areas.push({id: area._id, name: area.name});
		}
		res.send(areas);
	}

	@Post("/getHotel")
	async getHotel(@Res() res: Res, @Req() req: Req, @Session('user') session: Data) {
		let HotelObject = await this.mongo.HotelService.find({
			name: {$regex: new RegExp(req.body.term, 'i')},
			deleted: false,
			companyID: session.user._id
		});
		let hotel = [];
		for (const hot of HotelObject) {
			hotel.push({id: hot._id, name: hot.name});
		}
		res.send(hotel);
	}

	@Get("/rooms")
	async Rooms(@Res() res: Res, @Req() req: Req, @Session('user') session: Data) {
		let hotels = await this.mongo.HotelService.find({
			companyID: session.user._id,
			deleted: false
		});
		this.config.data['hotels'] = hotels;

		this.config.render = 'rooms';
		this.config.pageScript.push(Plugins.selectize);
		await this.render(req, res);
	}

	@Get("/deleteHotel/:hotelID/")
	async deleteHotel(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('hotelID')hotelID: string,) {

		let hotelObject = await this.mongo.HotelService.findById(hotelID);
		hotelObject.deleted = true;
		await hotelObject.save();
		let notification: Notification = {
			message: "Hotel Deleted successfully !",
			type: NotificationType.SUCCESS,
			title: "Delete success"
		};
		req.session.notification.push(notification);
		return res.redirect('back');
	}

	@Get("/deleteRoom/:hotelID/:roomID")
	async delete(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('hotelID')hotelID: object, @PathParams('roomID')roomID: string) {
		let hotelObject = await this.mongo.HotelService.updateOne({_id:hotelID},{
			$pull:{
				rooms:{
					_id:roomID
				}
			}
		});
		let notification: Notification = {
			message: "Room Deleted successfully !",
			type: NotificationType.SUCCESS,
			title: "Delete success"
		};
		req.session.notification.push(notification);
		return res.redirect('back');
	}

}
