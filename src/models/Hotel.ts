import {Indexed, Model, ObjectID, Ref} from "@tsed/mongoose";
import {Types} from "mongoose";
import {Default, Email, IgnoreProperty, Property, PropertyType} from "@tsed/common";
import {FileProperty} from "../schema/FileProperty";
import {Room} from "../schema/Room";
import {Area} from "./Area";
import {User} from "./User";

@Model({
	collection: "hotel",
	schemaOptions: {
		timestamps: {
			createdAt: false,
			updatedAt: true
		}
	}
})

export class hotel {
	@ObjectID("id")
	_id: Types.ObjectId;

	@Indexed()
	@Ref(User)
	@PropertyType(Types.ObjectId)
	companyID: Ref<User>;

	@Property()
	name: string;

	@Indexed()
	@Ref(Area)
	@PropertyType(Types.ObjectId)
	area: Ref<Area>;

	@Property()
	star: string;

	@Property()
	contactName: string;


	@Property()
	checkIn: string;

	@Property()
	checkOut: string;

	@Indexed(true)
	@Email()
	email: string;

	@Property()
	phone: string;

	@Property()
	fax: string;

	@Property()
	alternativePhone: string;

	@Property()
	address: string;

	@Default(true)
	@PropertyType(Boolean)
	status: boolean;

	@Property()
	addressTwo: string;

	@Property()
	city: string;

	@Property()
	postCode: string;

	@Property()
	country: string;

	get AddressFull() {
		return this.address + ",  " + this.city + " - " + this.postCode + ", " + this.country;
	}

	@PropertyType(String)
	feature: Array<string>;


	@PropertyType(Number)
	noOfRoom: number;

	@Property()
	about: string;

	@PropertyType(FileProperty)
	image: FileProperty;

	@PropertyType(Room)
	rooms: Array<Room>;

	@Default(false)
	@PropertyType(Boolean)
	deleted: boolean;

}