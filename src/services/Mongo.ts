import {Inject, Service} from "@tsed/common";
import {MongooseModel, MongooseService} from "@tsed/mongoose";
import {User} from "../models/User";
import {Package} from "../models/Package";
import {hotel} from "../models/Hotel";
import {Offers} from "../models/Offer";
import {Question} from "../models/Question";
import {Area} from "../models/Area";
import {Booking} from "../models/Booking";
import {Payment} from "../models/Payment";


@Service()
export class Mongo {
	@Inject(User)
	public UserService: MongooseModel<User>;
	@Inject(Package)
	public  PackageService:MongooseModel<Package>;
	@Inject(hotel)
	public HotelService:MongooseModel<hotel>;
	@Inject(Offers)
	public OfferService:MongooseModel<Offers>;
	@Inject(Question)
	public  QuestionService:MongooseModel<Question>;
	@Inject(Area)
	public  AreaService:MongooseModel<Area>;
	@Inject(Booking)
	public  BookingService:MongooseModel<Booking>;
	@Inject(Payment)
	public PaymentService:MongooseModel<Payment>;

	constructor(mongooseService: MongooseService) {
		mongooseService.get();
	}
}