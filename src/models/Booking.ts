import {Indexed, Model, ObjectID, Ref} from "@tsed/mongoose";
import {Types} from "mongoose";
import {Default, Email, Property, PropertyType} from "@tsed/common";
import {Room} from "../schema/Room";
import {Payment} from "./Payment";
import {Package} from "./Package";
import {User} from "./User";
import {hotel} from "./Hotel";

@Model({
	collection: "Booking",
	schemaOptions: {
		timestamps: {
			createdAt: false,
			updatedAt: true
		}
	}
})

export class Booking {
	@ObjectID("id")
	_id: Types.ObjectId;


	@Property()
	userName: string;

	@Property()
	guestName: string;

	@Property()
	transactionID: string;

	@Property()
	user:object;

	@Property()
	phone:string;

	@Indexed(true)
	@Email()
	email: string;

	@Property()
	address:string;

	@PropertyType(Date)
	checkIn:Date;

	@PropertyType(Date)
	checkOut:Date;

	@PropertyType(Number)
	totalPrice:number;

	@PropertyType(Number)
	inDollar:number;

	@Property()
	bookon:string;

	@PropertyType(Number)
	rawPrice:number;

	@PropertyType(Number)
	serviceInclude:number;

	@PropertyType(Number)
	discount:number;

	@PropertyType(Number)
	subtotal:number;

	@PropertyType(Number)
	quantity:number;

	@Property()
	paymentOption:string;

	@Property()
	rooms:object;

	@Property()
	packages:object;

	@Property()
	packageName:string;

	@Indexed(true)
	@Ref(Room)
	@PropertyType(Types.ObjectId)
	room: Ref<Room>;

	@Indexed()
	@Ref(hotel)
	@PropertyType(Types.ObjectId)
	hotelID: Ref<hotel>;

	@Indexed()
	@Ref(User)
	@PropertyType(Types.ObjectId)
	companyID: Ref<User>;

	@Indexed(true)
	@Ref(Package)
	@PropertyType(Types.ObjectId)
	packageID: Ref<Package>;


	@Indexed(true)
	@Ref(Payment)
	@PropertyType(Types.ObjectId)
	payment: Ref<Payment>;

	@Default(false)
	@PropertyType(Boolean)
	packageFlag: boolean;

	@Default(false)
	@PropertyType(Boolean)
	hotelFlag: boolean;

	@Default(false)
	@PropertyType(Boolean)
	deleted: boolean;

	@PropertyType(Date)
	updatedAt: Date;

}