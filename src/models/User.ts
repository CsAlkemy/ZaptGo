import {Default, Email, Enum, IgnoreProperty, Property, PropertyType} from "@tsed/common";
import {Indexed, Model, ObjectID, Ref} from "@tsed/mongoose";
import {Types} from "mongoose";
import {UserType} from "../config/Config";
import {FileProperty} from "../schema/FileProperty";


@Model({
	collection: "user",
	schemaOptions: {
		timestamps: {
			createdAt: false,
			updatedAt: true
		}
	}
})
export class User {
	@ObjectID("id")
	_id: Types.ObjectId;

	@Property()
	company: string;

	@Property()
	firstName: string;

	@Property()
	lastName: string;

	@Property()
	name: string;

	@Property()
	address: string;

	@Property()
	city: string;

	@Property()
	country: string;

	@Property()
	phone: string;

	@Property()
	emergencyContact: string;

	@Property()
	password: string;

	@Indexed(true)
	@Email()
	email: string;

	@PropertyType(FileProperty)
	image: FileProperty;

	@Property()
	gender: string;

	get fullName(){
	return this.firstName+" " +this.lastName	;
	}

	@Property()
	phoneTwo: string;

	@Property()
	rating: string;

	@Property()
	addressTwo: string;

	@Property()
	postCode: string;


	@Property()
	Area: string;

	@Property()
	property: string;

	@Property()
	description: string;

	@Default(false)
	@PropertyType(Boolean)
	partnerRequest: boolean;

	@PropertyType(FileProperty)
	logo: FileProperty;

	@Enum(UserType)
	userType : UserType;

	@PropertyType(Boolean)
	isAdmin: boolean;

	@Indexed(true)
	@Ref(User)
	@PropertyType(Types.ObjectId)
	addedBy: Ref<User>;


	@Default(false)
	@PropertyType(Boolean)
	deleted: boolean;

	@PropertyType(Date)
	updatedAt: Date;


}