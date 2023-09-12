import {Controller, Get, PathParams, Post, Req, Res, Session, UseBefore} from "@tsed/common";
import BaseController from "../../Core/BaseController";
import {Mongo} from "../../services/Mongo";
import {ifNotLoggedIn, ifNotUser} from "../../middlewares/SessionCheck";
import {Data} from "../../config/SessionData";
import {Plugins} from "../../config/Utility";
import {Booking} from "../../models/Booking";
import * as PDFDocument from "pdfkit";
import {FONT} from "../../config/Constents";
import * as moment from "moment";


@Controller("/package")
@UseBefore(ifNotLoggedIn)
@UseBefore(ifNotUser)
export class Package extends BaseController {
	constructor(private  mongo: Mongo) {
		super(mongo);
		this.config.view = "userUi/packages";

	}

	@Get("/packages")
	async viewPackage(@Res() res: Res, @Req() req: Req, @Session('user') session: Data) {
		let packages = await this.mongo.PackageService.find({
			deleted:false,
			status:true
		});
		this.config.data['packages'] = packages;

		this.config.render ='packages';
		this.config.pageScript.push(Plugins.selectize);
		await this.render(req, res);
	}


	@Get('/packagePreview/:packageID')
	@Post('/packagePreview/:packageID')
	async deleteOffer(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('packageID') packageID: string) {
		let packageObject = await this.mongo.PackageService.findById(packageID);
		this.config.data['package']=packageObject;
		this.config.render='packagePreview';
		this.config.pageScript.push(Plugins.selectize);
		await this.render(req, res);
	}


	@Get('/checkOut/:packageID')
	@Post('/checkOut/:packageID')
	async checkOut(@Res() res: Res, @Req() req: Req, @Session('user') session: Data,  @PathParams('packageID')packageID:object){

		let packageObject = await this.mongo.PackageService.findById(packageID);
		this.config.data['package'] =packageObject;
		this.config.render='checkOut';
		this.config.pageScript.push(Plugins.selectize);
		await this.render(req, res);
	}



	@Get('/packageCheckOut/:packageID/:companyID')
	@Post('/packageCheckOut/:packageID/:companyID')
	async packageCheckOut(@Res() res: Res, @Req() req: Req, @Session('user') session: Data,  @PathParams('packageID') packageID:string , @PathParams('companyID') companyID:string  ){

		if(req.method==="POST"){
			let{ name, guest, phone, email, address, totalPrice, paymentOption, subtotal, service}=req.body;
			let packageObject= new Booking();
			let packageName= await this.mongo.PackageService.findById(packageID);
			packageObject.userName=name;
			packageObject.guestName=guest;
			packageObject.phone=phone;
			packageObject.email=email;
			packageObject.address=address;
			packageObject.totalPrice=totalPrice;
			packageObject.packageFlag=true;
			packageObject.user=session.user._id;
			packageObject.paymentOption=paymentOption;
			packageObject.subtotal=subtotal;
			packageObject.serviceInclude=service;
			packageObject.packageID=packageID;
			packageObject.packageName=packageName.name;
			packageObject.companyID=packageName.companyID;
			let bookingService= new this.mongo.BookingService(packageObject);
			await bookingService.save();
			if(packageObject.paymentOption==='offline'){
				return  res.redirect('/user/package/offlinePackage' + '/' + bookingService._id+'/'+packageID+'/'+companyID)

			}else {
				return  res.redirect('/user/package/onlinePackage' + '/' + bookingService._id+'/'+packageID+'/'+companyID)
			}
			return res.redirect('back');
		}else{
			this.config.render='checkOut';
			this.config.pageScript.push(Plugins.selectize, Plugins.dateRangePicker);
			await this.render(req, res);
		}

	}

	@Get('/offlinePackage/:bookingID/:packageID/:companyID')
	@Post('/offlinePackage/:bookingID/:packageID/:companyID')
	async offline(@Res() res: Res, @Req() req: Req, @Session('user') session: Data,  @PathParams('bookingID')bookingID:object,@PathParams('packageID')packageID:object,  @PathParams('companyID')companyID:object){

		let packageObject = await this.mongo.PackageService.findById(packageID);
		let companyObject= await this.mongo.UserService.findById(companyID);
		let bookingObject= await this.mongo.BookingService.findById(bookingID);

		this.config.data['package']=packageObject;
		this.config.data['booking']=bookingObject;
		this.config.data['company']=companyObject;
		this.config.render='offLine';
		this.config.pageScript.push(Plugins.selectize);
		await this.render(req, res);
	}


	@Get('/onlinePackage/:bookingID/:packageID/:companyID')
	@Get('/onlinePackage/:bookingID/:packageID/:companyID')
	async online(@Res() res: Res, @Req() req: Req, @Session('user') session: Data,  @PathParams('bookingID')bookingID:object,@PathParams('packageID')packageID:object,  @PathParams('companyID')companyID:object){

		let packageObject = await this.mongo.PackageService.findById(packageID);
		let companyObject= await this.mongo.UserService.findById(companyID);
		let bookingObject= await this.mongo.BookingService.findById(bookingID);

		this.config.data['package']=packageObject;
		this.config.data['booking']=bookingObject;
		this.config.data['company']=companyObject;
		this.config.render='online';
		this.config.pageScript.push(Plugins.selectize);
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

	@Get("/pdfPackage/:bookingID/:packageID/:companyID")
	@Post("/pdfPackage/:bookingID/:packageID/:companyID")
	async pdf(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('bookingID')bookingID: object, @PathParams('packageID')packageID: object, @PathParams('companyID')companyID: object) {

		let booking = await this.mongo.BookingService.findById(bookingID);
		let packageObject = await this.mongo.PackageService.findById(packageID);
		let company = await this.mongo.UserService.findById(companyID);
		let invNumber= moment(+new Date());
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
			.text(company.company,
				340, 70, {
					width: 180, align: "right"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor('#455A64')
			.text(company.address,
				340, 85, {
					width: 180, align: "right"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor('#455A64')
			.text('Contact: ' +company.phone,
				340, 120, {
					width: 180, align: "right"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor('#455A64')
			.text('Email:'+company.email,
				340, 130, {
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
			.text('Guest: ' + booking.guestName,
				72, 190, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(10).fillColor("#455A64")
			.text('Phone: ' + booking.phone,
				72, 205, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(10).fillColor("#455A64")
			.text('Email: ' + booking.email,
				72, 220, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor("#455A64")
			.text('INVOICE NO- ' + invNumber,
				72, 235, {
					width: 280, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor("#455A64")
			.text('Payment : '+ booking.paymentOption,
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
			.text('Qty',
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
			.text('1',
				300, 345, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor('#2c3e50')
			.text(booking.subtotal+'',
				460, 345, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor('#2c3e50')
			.text('Package charge '+'('+packageObject.name+')',
				75, 345, {
					width: 280, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor('#2c3e50')
			.text('Service charge (10%)',
				75, 370, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor('#2c3e50')
			.text(""+booking.serviceInclude,
				460, 370, {
					width: 180, align: "left"

				});
		doc.lineWidth(1).lineCap('butt').moveTo(72, 385).lineTo(520, 385).stroke('#607D8B');
		doc.lineWidth(1).lineCap('butt').moveTo(72, 410).lineTo(520, 410).stroke('#607D8B');
		//doc.lineWidth(1).lineCap('butt').moveTo(72, 435).lineTo(520, 435).stroke('#607D8B');

		doc.lineWidth(40).lineCap('butt').moveTo(325, 470).lineTo(520, 470).stroke('#26C6DA');
		doc.font(FONT.Helvetica).fontSize(12).fillColor("black")
			.text('SubTotal: '+booking.subtotal,
				340, 460, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(12).fillColor('black')
			.text('Tax: '+ booking.serviceInclude,
				340, 475, {
					width: 180, align: "left"

				});
		doc.lineWidth(40).lineCap('butt').moveTo(325, 520).lineTo(520, 520).stroke('#673AB7');

		doc.font(FONT.Helvetica).fontSize(12).fillColor('white')
			.text('Total: ' +booking.totalPrice,
				340, 510, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(12).fillColor('white')
			.text('Due : ' +booking.totalPrice,
				340, 525, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor('#455A64')
			.text('User copy ' +'('+ booking.userName+')',
				400, 640, {
					width: 180, align: "left"

				});
		doc.lineWidth(15).lineCap('butt').moveTo(130, 745).lineTo(135, 745).stroke('#26C6DA');
		doc.lineWidth(15).lineCap('butt').moveTo(440, 745).lineTo(445, 745).stroke('#26C6DA');
		doc.font(FONT.Helvetica).fontSize(12).fillColor('black')
			.text('Thank You for booking Package With Tourgo!',
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
	@Get("/onlinePdf/:bookingID")
	@Post("/onlinePdf/:bookingID")
	async onlinePdf(@Res() res: Res, @Req() req: Req, @Session('user') session: Data, @PathParams('bookingID')bookingID: object) {

		let booking = await this.mongo.BookingService.findById(bookingID);
		let packageObject = await this.mongo.PackageService.findById(booking.packageID);
		let company = await this.mongo.UserService.findById(booking.companyID);
		let invNumber= moment(+new Date());
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
			.text(company.company,
				340, 70, {
					width: 180, align: "right"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor('#455A64')
			.text(company.address,
				340, 85, {
					width: 180, align: "right"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor('#455A64')
			.text('Contact: ' +company.phone,
				340, 120, {
					width: 180, align: "right"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor('#455A64')
			.text('Email:'+company.email,
				340, 130, {
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
			.text('Guest: ' + booking.guestName,
				72, 190, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(10).fillColor("#455A64")
			.text('Phone: ' + booking.phone,
				72, 205, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(10).fillColor("#455A64")
			.text('Email: ' + booking.email,
				72, 220, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor("#455A64")
			.text('INVOICE NO- ' + invNumber,
				72, 235, {
					width: 280, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor('#455A64')
			.text('TNX ID- ' + '(' + booking.transactionID + ')',
				400, 620, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor("#455A64")
			.text('Payment : '+ booking.paymentOption,
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
			.text('Qty',
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
			.text('1',
				300, 345, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor('#2c3e50')
			.text(booking.subtotal+'',
				460, 345, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor('#2c3e50')
			.text('Package charge '+'('+packageObject.name+')',
				75, 345, {
					width: 280, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor('#2c3e50')
			.text('Service charge (10%)',
				75, 370, {
					width: 180, align: "left"

				});
		doc.font(FONT.HelveticaBoldOblique).fontSize(36).fillColor('#0090f4')
			.text('PAID',
				210, 480, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(11).fillColor('#2c3e50')
			.text(""+booking.serviceInclude,
				460, 370, {
					width: 180, align: "left"

				});
		doc.lineWidth(1).lineCap('butt').moveTo(72, 385).lineTo(520, 385).stroke('#607D8B');
		doc.lineWidth(1).lineCap('butt').moveTo(72, 410).lineTo(520, 410).stroke('#607D8B');
		//doc.lineWidth(1).lineCap('butt').moveTo(72, 435).lineTo(520, 435).stroke('#607D8B');

		doc.lineWidth(40).lineCap('butt').moveTo(325, 470).lineTo(520, 470).stroke('#26C6DA');
		doc.font(FONT.Helvetica).fontSize(12).fillColor("black")
			.text('SubTotal: '+booking.subtotal,
				340, 460, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(12).fillColor('black')
			.text('Tax: '+ booking.serviceInclude,
				340, 475, {
					width: 180, align: "left"

				});
		doc.lineWidth(40).lineCap('butt').moveTo(325, 520).lineTo(520, 520).stroke('#673AB7');

		doc.font(FONT.Helvetica).fontSize(12).fillColor('white')
			.text('Total: ' +booking.totalPrice,
				340, 510, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(12).fillColor('white')
			.text('Due : ' +booking.totalPrice,
				340, 525, {
					width: 180, align: "left"

				});
		doc.font(FONT.Helvetica).fontSize(9).fillColor('#455A64')
			.text('User copy ' +'('+ booking.userName+')',
				400, 640, {
					width: 180, align: "left"

				});
		doc.lineWidth(15).lineCap('butt').moveTo(130, 745).lineTo(135, 745).stroke('#26C6DA');
		doc.lineWidth(15).lineCap('butt').moveTo(440, 745).lineTo(445, 745).stroke('#26C6DA');
		doc.font(FONT.Helvetica).fontSize(12).fillColor('black')
			.text('Thank You for booking Package With Tourgo!',
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