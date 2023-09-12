import {Controller, Get, PathParams, Post, Req, Res, Session, UseBefore} from "@tsed/common";
import BaseController from "../../Core/BaseController";
import {Mongo} from "../../services/Mongo";
import {ifNotLoggedIn, ifNotUser} from "../../middlewares/SessionCheck";
import {Data} from "../../config/SessionData";
import {Plugins} from "../../config/Utility";
import {hotel} from "../../models/Hotel";
import {Booking} from "../../models/Booking";
import {FONT} from "../../config/Constents";
import * as PDFDocument from 'pdfkit';
import * as moment from "moment";


@Controller("/hotel")
@UseBefore(ifNotLoggedIn)
@UseBefore(ifNotUser)
export class Hotel extends BaseController {
	constructor(private  mongo: Mongo) {
		super(mongo);
		this.config.view = "userUi/hotel";

	}

	@Get("/hotels")
	async hotels(@Res() res: Res, @Req() req: Req, @Session('user') session: Data) {
		let hotels = await this.mongo.HotelService.find({
			deleted: false
		});
		this.config.data['hotels'] = hotels;

		this.config.render = 'hotels';
		this.config.pageScript.push(Plugins.selectize);
		await this.render(req, res);
	}

	@Post("/search")
	async search(@Res() res: Res, @Req() req: Req, @Session('user') session: Data) {
		let {destination, checkIn, checkOut, rooms, adult, child} = req.body;
		let hotelObject = await this.mongo.HotelService.find({
			deleted: false,
			area: destination
		});
		this.config.data['hotels'] = hotelObject;
		this.config.render = 'hotels';
		await this.render(req, res);
	}

	// area wise search
	@Get("/hotels/:areaID")
	@Post("/hotels/:areaID")
	async hotelsByArea(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('areaID') areaID: string) {
		let hotelsByArea = await this.mongo.HotelService.find({
			deleted: false,
			area: areaID
		});
		let hotelCount = await this.mongo.HotelService.countDocuments({
			deleted: false,
			area: areaID
		});

		this.config.data['count'] = hotelCount;
		this.config.data['hotels'] = hotelsByArea;

		this.config.render = 'hotels';
		this.config.pageScript.push(Plugins.selectize);
		await this.render(req, res);
	}

	@Get('/hotelPreview/:hotelID')
	async hotelPreview(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('hotelID') hotelID: string) {
		let hotelObject = await this.mongo.HotelService.findById(hotelID);
		let available = await this.mongo.BookingService.aggregate()
			.match({
				deleted: false,
				checkIn: {
					$gte: moment().startOf('days').toDate(),
					//$lt:
				},
				checkOut: {
					$gte: moment().endOf('days').toDate(),
					//$lt:
				}
			}).group({
				_id: '$rooms',
				count: {
					$sum: '$quantity'
				}
			});
		this.config.data['availables'] = available;
		this.config.data['hotel'] = hotelObject;
		this.config.render = 'hotelPreview';
		this.config.pageScript.push(Plugins.selectize);
		await this.render(req, res);
	}


	@Get('/checkOut')
	async checkOut(@Res() res: Res, @Req() req: Req, @Session('user') session: Data) {
		let {roomQuantity, hotelId, roomId} = req.query;
		let hotelObject = await this.mongo.HotelService.findById(hotelId);
		let roomValue = hotelObject.rooms.find(value => value._id.toHexString() === roomId);
		this.config.data['room'] = roomValue;
		this.config.data['qty'] = Number(roomQuantity);
		this.config.data['hotel'] = hotelObject;
		this.config.render = 'checkOut';
		this.config.pageScript.push(Plugins.selectize, Plugins.dateRangePicker);
		await this.render(req, res);

	}

	@Get('/booking/:roomID/:hotelID')
	@Post('/booking/:roomID/:hotelID')
	async booking(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('roomID') roomID: object, @PathParams('hotelID') hotelID: string) {

		if (req.method === "POST") {
			let {name, guest, phone, email, address, quantity, totalPrice, checkIn, checkOut, paymentOption, serviceInclude, subtotal} = req.body;
			let bookingObject = new Booking();
			let hotelObject = await this.mongo.HotelService.findById(hotelID);
			let roomValue = hotelObject.rooms.filter(value => value._id == roomID);
			let room = roomValue[0];
			bookingObject.userName = name;
			bookingObject.user = session.user._id;
			bookingObject.guestName = guest;
			bookingObject.phone = phone;
			bookingObject.email = email;
			bookingObject.address = address;
			bookingObject.totalPrice = totalPrice;
			bookingObject.quantity = quantity;
			bookingObject.checkIn = checkIn;
			bookingObject.checkOut = checkOut;
			bookingObject.hotelFlag = true;
			bookingObject.paymentOption = paymentOption;
			bookingObject.serviceInclude = serviceInclude;
			bookingObject.subtotal = subtotal;
			bookingObject.rooms = roomID;
			bookingObject.hotelID = hotelID;
			bookingObject.bookon = room.name;
			bookingObject.companyID = hotelObject.companyID;
			bookingObject.inDollar = totalPrice / 83;
			let bookingService = new this.mongo.BookingService(bookingObject);
			await bookingService.save();
			if (bookingObject.paymentOption === 'offline') {
				return res.redirect('/user/hotel/offline' + '/' + bookingService._id + '/' + hotelID + '/' + roomID);
			} else if (bookingObject.paymentOption === 'online') {
				return res.redirect('/user/hotel/online' + '/' + bookingService._id + '/' + hotelID + '/' + roomID);
			}

		} else {
			this.config.render = 'checkOut';
			this.config.pageScript.push(Plugins.selectize, Plugins.dateRangePicker);
			await this.render(req, res);
		}

	}

	@Get('/offline/:bookID/:hotelID/:roomID')
	@Post('/offline/:bookID/:hotelID/:roomID')
	async offlinePayment(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('bookID')bookID: object, @PathParams('hotelID')hotelID: object, @PathParams('roomID')roomID: object) {
		let hotel = await this.mongo.HotelService.findById(hotelID);
		let bookings = await this.mongo.BookingService.findById(bookID);
		let roomValue = hotel.rooms.filter(value => value._id == roomID);
		let room = roomValue[0];
		this.config.data['room'] = roomValue[0];
		this.config.data['hotel'] = hotel;
		this.config.data['bookings'] = bookings;
		this.config.render = 'offLine';
		await this.render(req, res);

	}

	@Get('/online/:bookID/:hotelID/:roomID')
	@Post('/online/:bookID/:hotelID/:roomID')
	async onlinePayment(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('bookID')bookID: object, @PathParams('hotelID')hotelID: object, @PathParams('roomID')roomID: object) {
		let hotel = await this.mongo.HotelService.findById(hotelID);
		let booking = await this.mongo.BookingService.findById(bookID);
		let roomValue = hotel.rooms.filter(value => value._id == roomID);
		let room = roomValue[0];
		this.config.data['room'] = roomValue[0];
		this.config.data['hotel'] = hotel;
		this.config.data['booking'] = booking;
		this.config.render = 'online';
		this.config.pageScript.push(Plugins.Bkash);
		await this.render(req, res);

	}

	@Post('/payPalPay')
	async payPalPay(@Res() res: Res, @Req() req: Req, @Session('user') session: Data) {
		let {transactionId, bookID} = req.body;

		let bookingObject = await this.mongo.BookingService.findById(bookID);
		bookingObject.transactionID = transactionId;
		await bookingObject.save();
		res.json({
			status: true
		})
	}

	@Get('/online')
	async online(@Res() res: Res, @Req() req: Req, @Session('user') session: Data) {
		this.config.render = 'online';
		await this.render(req, res);

	}

	@Get("/onlinePdf/:bookId")
	async onlinePdf(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('bookId') bookId: string) {

		let bookObject = await this.mongo.BookingService.findById(bookId);
		let hotel = await this.mongo.HotelService.findById(bookObject.hotelID);
		let roomValue = hotel.rooms.filter(value => value._id == bookObject.rooms);
		let room = roomValue[0];
		let invNumber = moment(+new Date());
		let doc = new PDFDocument({
			autoFirstPage: true,
			margins: {
				top: 14,
				left: 9,
				right: 9,
				bottom: 15
			}
		});

		doc.font(FONT.HelveticaBold).fontSize(30).fillColor('#3498db')
			.text('TOURGO.',
				72, 70, {
					width: 180, align: "left"

				});
		doc.font(FONT.HelveticaBold).fontSize(15).fillColor('#26C6DA')
			.text(hotel.name,
				340, 70, {
					width: 180, align: "right"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor('#455A64')
			.text(hotel.AddressFull,
				340, 110, {
					width: 180, align: "right"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor('#455A64')
			.text('Contact: ' + hotel.phone,
				340, 140, {
					width: 180, align: "right"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor('#455A64')
			.text('Email:' + hotel.email,
				340, 150, {
					width: 180, align: "right"

				});
		/*
		doc.image(process.env.PWD +'images/laborlogo.png', 95, 75,{
			width:300, height:100,
		});*/


		doc.lineWidth(25).lineCap('butt').moveTo(72, 170).lineTo(155, 170).stroke('#607D8B');
		doc.font(FONT.HelveticaBold).fontSize(12).fillColor('white')
			.text('Invoice To',
				76, 164, {
					width: 180, align: "left"

				});
		doc.font(FONT.HelveticaBold).fontSize(11).fillColor("#263238")
			.text('Guest: ' + bookObject.guestName,
				72, 190, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(10).fillColor("#455A64")
			.text('Phone: ' + bookObject.phone,
				72, 205, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(10).fillColor("#455A64")
			.text('Email: ' + bookObject.email,
				72, 220, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor("#455A64")
			.text('Check in: ' + moment(bookObject.checkIn).format('DD MMM, Y'),
				72, 235, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor("#455A64")
			.text('Check out: ' + moment(bookObject.checkOut).format('DD MMM, Y'),
				72, 247, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor("#455A64")
			.text('INVOICE NO- ' + invNumber,
				72, 260, {
					width: 380, align: "left"

				});
		doc.lineWidth(25).lineCap('butt').moveTo(140, 170).lineTo(155, 170).stroke('#26C6DA');
		doc.lineWidth(26).lineCap('butt').moveTo(72, 320).lineTo(520, 320).stroke('#607D8B');
		doc.font(FONT.Helvetica).fontSize(12).fillColor('white')
			.text('Description',
				76, 316, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(12).fillColor('white')
			.text('No. of Rooms',
				290, 316, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(12).fillColor('white')
			.text('Amount',
				450, 316, {
					width: 180, align: "left"

				});
		doc.lineWidth(1).lineCap('butt').moveTo(72, 360).lineTo(520, 360).stroke('#607D8B');
		doc.font(FONT.Helvetica).fontSize(11).fillColor('#2c3e50')
			.text(bookObject.quantity + ' × ' + room.price,
				300, 345, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor('#2c3e50')
			.text((bookObject.subtotal + ''),
				460, 345, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor('#2c3e50')
			.text('Hotel charge ' + '(' + room.name + ')',
				75, 345, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor('#2c3e50')
			.text('Service charge (10%)',
				75, 370, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor('#2c3e50')
			.text('' + bookObject.serviceInclude,
				460, 370, {
					width: 180, align: "left"

				});
		doc.lineWidth(1).lineCap('butt').moveTo(72, 385).lineTo(520, 385).stroke('#607D8B');
		doc.lineWidth(1).lineCap('butt').moveTo(72, 410).lineTo(520, 410).stroke('#607D8B');
		//doc.lineWidth(1).lineCap('butt').moveTo(72, 435).lineTo(520, 435).stroke('#607D8B');

		doc.lineWidth(40).lineCap('butt').moveTo(325, 470).lineTo(520, 470).stroke('#26C6DA');
		doc.font(FONT.Helvetica).fontSize(12).fillColor("black")
			.text('SubTotal: ' + bookObject.subtotal,
				340, 460, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(12).fillColor('black')
			.text('Tax: ' + bookObject.serviceInclude,
				340, 475, {
					width: 180, align: "left"

				});
		doc.lineWidth(40).lineCap('butt').moveTo(325, 520).lineTo(520, 520).stroke('#673AB7');

		doc.font(FONT.Helvetica).fontSize(12).fillColor('white')
			.text('Total: ' + bookObject.totalPrice,
				340, 510, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(12).fillColor('white')
			.text('Due : ' + bookObject.totalPrice,
				340, 525, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor('#455A64')
			.text('TNX ID- ' + '(' + bookObject.transactionID + ')',
				400, 620, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor('#455A64')
			.text('User copy ' + '(' + bookObject.userName + ')',
				400, 640, {
					width: 180, align: "left"

				});

		doc.font(FONT.HelveticaBoldOblique).fontSize(36).fillColor('#F4511E')
			.text('PAID',
				210, 480, {
					width: 180, align: "left"

				});
		doc.lineWidth(15).lineCap('butt').moveTo(130, 745).lineTo(135, 745).stroke('#26C6DA');
		doc.lineWidth(15).lineCap('butt').moveTo(440, 745).lineTo(445, 745).stroke('#26C6DA');
		doc.font(FONT.Helvetica).fontSize(12).fillColor('black')
			.text('Thank You for booking hotel With Tourgo!',
				150, 740, {
					width: 280, align: "center"

				});


		doc.end();

		res.writeHead(200, {
			'Content-Type': 'application/pdf',
			'Access-Control-Allow-Origin': '*',
			'Content-Disposition': 'attachment; filename=output.pdf'
		});
		await doc.pipe(res);
	}


	@Get("/pdf/:bookID/:hotelID/:roomID")
	@Post("/pdf/:bookID/:hotelID/:roomID")
	async pdf(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('bookID')bookID: object, @PathParams('hotelID')hotelID: object, @PathParams('roomID')roomID: object) {

		let bookObject = await this.mongo.BookingService.findById(bookID);
		let hotel = await this.mongo.HotelService.findById(hotelID);
		let roomValue = hotel.rooms.filter(value => value._id == roomID);
		let room = roomValue[0];

		let invNumber = moment(+new Date());
		let doc = new PDFDocument({
			autoFirstPage: true,
			margins: {
				top: 14,
				left: 9,
				right: 9,
				bottom: 15
			}
		});


		doc.font(FONT.HelveticaBold).fontSize(30).fillColor('#3498db')
			.text('TOURGO.',
				72, 70, {
					width: 180, align: "left"

				});
		doc.font(FONT.HelveticaBold).fontSize(15).fillColor('#26C6DA')
			.text(hotel.name,
				340, 70, {
					width: 180, align: "right"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor('#455A64')
			.text(hotel.AddressFull,
				340, 110, {
					width: 180, align: "right"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor('#455A64')
			.text('Contact: ' + hotel.phone,
				340, 140, {
					width: 180, align: "right"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor('#455A64')
			.text('Email:' + hotel.email,
				340, 150, {
					width: 180, align: "right"

				});

		doc.lineWidth(25).lineCap('butt').moveTo(72, 170).lineTo(155, 170).stroke('#607D8B');
		doc.font(FONT.HelveticaBold).fontSize(12).fillColor('white')
			.text('Invoice To',
				76, 164, {
					width: 180, align: "left"

				});
		doc.font(FONT.HelveticaBold).fontSize(11).fillColor("#263238")
			.text('Guest: ' + bookObject.guestName,
				72, 190, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(10).fillColor("#455A64")
			.text('Phone: ' + bookObject.phone,
				72, 205, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(10).fillColor("#455A64")
			.text('Email: ' + bookObject.email,
				72, 220, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor("#455A64")
			.text('Check in: ' + moment(bookObject.checkIn).format('DD MMM, Y'),
				72, 235, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor("#455A64")
			.text('Check out: ' + moment(bookObject.checkOut).format('DD MMM, Y'),
				72, 247, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor("#455A64")
			.text('INV- ' + invNumber,
				72, 260, {
					width: 380, align: "left"

				});
		doc.lineWidth(25).lineCap('butt').moveTo(140, 170).lineTo(155, 170).stroke('#26C6DA');
		doc.lineWidth(26).lineCap('butt').moveTo(72, 320).lineTo(520, 320).stroke('#607D8B');
		doc.font(FONT.Helvetica).fontSize(12).fillColor('white')
			.text('Description',
				76, 316, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(12).fillColor('white')
			.text('No. of Rooms',
				290, 316, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(12).fillColor('white')
			.text('Amount',
				450, 316, {
					width: 180, align: "left"

				});
		doc.lineWidth(1).lineCap('butt').moveTo(72, 360).lineTo(520, 360).stroke('#607D8B');
		doc.font(FONT.Helvetica).fontSize(11).fillColor('#2c3e50')
			.text(bookObject.quantity + ' × ' + room.price,
				300, 345, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor('#2c3e50')
			.text((bookObject.subtotal + ''),
				460, 345, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor('#2c3e50')
			.text('Hotel charge ' + '(' + room.name + ')',
				75, 345, {
					width: 280, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor('#2c3e50')
			.text('Service charge (10%)',
				75, 370, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor('#2c3e50')
			.text('' + bookObject.serviceInclude,
				460, 370, {
					width: 180, align: "left"

				});
		doc.lineWidth(1).lineCap('butt').moveTo(72, 385).lineTo(520, 385).stroke('#607D8B');
		doc.lineWidth(1).lineCap('butt').moveTo(72, 410).lineTo(520, 410).stroke('#607D8B');
		//doc.lineWidth(1).lineCap('butt').moveTo(72, 435).lineTo(520, 435).stroke('#607D8B');

		doc.lineWidth(40).lineCap('butt').moveTo(325, 470).lineTo(520, 470).stroke('#26C6DA');
		doc.font(FONT.Helvetica).fontSize(12).fillColor("black")
			.text('SubTotal: ' + bookObject.subtotal,
				340, 460, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(12).fillColor('black')
			.text('Tax: ' + bookObject.serviceInclude,
				340, 475, {
					width: 180, align: "left"

				});
		doc.lineWidth(40).lineCap('butt').moveTo(325, 520).lineTo(520, 520).stroke('#673AB7');

		doc.font(FONT.Helvetica).fontSize(12).fillColor('white')
			.text('Total: ' + bookObject.totalPrice,
				340, 510, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(12).fillColor('white')
			.text('Due : ' + bookObject.totalPrice,
				340, 525, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor('#455A64')
			.text('User copy ' + '(' + bookObject.userName + ')',
				400, 640, {
					width: 180, align: "left"

				});
		doc.lineWidth(15).lineCap('butt').moveTo(130, 745).lineTo(135, 745).stroke('#26C6DA');
		doc.lineWidth(15).lineCap('butt').moveTo(440, 745).lineTo(445, 745).stroke('#26C6DA');
		doc.font(FONT.Helvetica).fontSize(12).fillColor('black')
			.text('Thank You for booking hotel With Tourgo!',
				150, 740, {
					width: 280, align: "center"

				});


		doc.end();

		res.writeHead(200, {
			'Content-Type': 'application/pdf',
			'Access-Control-Allow-Origin': '*',
			'Content-Disposition': 'attachment; filename=output.pdf'
		});
		await doc.pipe(res);
	}


}