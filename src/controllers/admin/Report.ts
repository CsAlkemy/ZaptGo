import {Controller, Get, QueryParams, Req, Res, Session, UseBefore} from "@tsed/common";
import BaseController from "../../Core/BaseController";
import {Mongo} from "../../services/Mongo";
import {ifNotAdmin, ifNotLoggedIn} from "../../middlewares/SessionCheck";
import {Data} from "../../config/SessionData";
import {Types} from "mongoose";
import {Plugins} from "../../config/Utility";


@Controller("/report")
@UseBefore(ifNotLoggedIn)
@UseBefore(ifNotAdmin)
export class report extends BaseController {
	constructor(private mongo: Mongo) {
		super(mongo);
		this.config.view = "admin/report";

	}

	@Get('/hotelBooking')
	async hotelBooking(@Res() res: Res, @Req() req: Req, @Session() session: Data,
	                   @QueryParams('companyID') companyID: string) {
		let $match = {
			deleted: false,
			hotelFlag: true
		};
		if (companyID) {
			$match['hotelID'] = Types.ObjectId(companyID)
		}
		this.config.data['hotelBookings'] = await this.mongo.BookingService.aggregate()
			.match($match)
			.lookup({
				from: this.mongo.HotelService.collection.name,
				localField: 'hotelID',
				foreignField: '_id',
				as: 'hotel'
			})
			.group({
				_id: '$_id',
				totalAmount: {
					$sum: '$totalPrice'
				},
				totalQuantity: {
					$sum: '$quantity'
				},
				name: {$first: '$hotel.name'},
				phone: {$first: '$hotel.phone'},
				address: {$first: '$hotel.address'},
				star: {$first: '$hotel.star'},
			});
		console.log();
		this.config.data['hotels']=await this.mongo.HotelService.find({
			deleted:false,
		});

		this.config.data['selectedHotel']=companyID;

		this.config.pageScript.push(Plugins.dataTables, Plugins.selectize);
		this.config.render = "hotelReport";
		await this.render(req, res);
	}

	@Get('/packageBooking')
	async packageBooking(@Res() res: Res, @Req() req: Req, @Session() session: Data,
	                     @QueryParams('companyID') companyID: string) {
		let $match = {
			deleted: false,
			packageFlag: true
		};
		if (companyID) {
			$match['packageID'] = Types.ObjectId(companyID)
		}
		this.config.data['packageBookings'] = await this.mongo.BookingService.aggregate()
			.match($match)
			.lookup({
				from: this.mongo.PackageService.collection.name,
				localField: 'packageID',
				foreignField: '_id',
				as: 'package'
			})
			.lookup({
				from: this.mongo.UserService.collection.name,
				localField: 'companyID',
				foreignField: '_id',
				as: 'company'
			})
			.group({
				_id: '$_id',
				totalAmount: {
					$sum: '$totalPrice'
				},
				name: {$first: '$package.name'},
				departure: {$first: '$package.departure'},
				return: {$first: '$package.return'},
				company: {$first: '$company.company'},
			});

		this.config.data['packages']=await this.mongo.PackageService.find({
			deleted:false,
		});
		this.config.data['selectedPackage']=companyID;
		this.config.render = "packageReport";

		this.config.pageScript.push(Plugins.dataTables);
		await this.render(req, res);
	}

}