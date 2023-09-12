import {Model, ObjectID} from "@tsed/mongoose";
import {Types} from "mongoose";
import {Default, Property, PropertyName, PropertyType} from "@tsed/common";
import {FileProperty} from "../schema/FileProperty";

@Model({
	collection: "Package",
	schemaOptions: {
		timestamps: {
			createdAt: false,
			updatedAt: true
		}
	}
})

export class Package {
	@ObjectID("id")
	_id: Types.ObjectId;

	@Property()
	companyID:string;

	@Property()
	name: string;

	@PropertyType(Number)
	noOfPerson: number;

	@PropertyType(Number)
	day: number;

	@PropertyType(Number)
	night: number;

	@PropertyType(Date)
	bookStart: Date;

	@PropertyType(Date)
	bookEnd: Date;

	@PropertyType(Date)
	departure: Date;

	@PropertyType(Date)
	return: Date;

	@Property()
	startPoint: string;

	@Property()
	overview: string;

	@PropertyType(String)
	include: Array<string>;

	@Property()
	cancelPolicy: string;

	@Property()
	places: string;

	@PropertyType(Number)
	price: number;

	@PropertyType(Number)
	extraPrice: number;

	@Property()
	pTravel: string;

	@Property()
	foodMenu: string;

	@Property()
	possibleDescription: string;

	@Property()
	packageDescription: string;

	@Default(true)
	@PropertyType(Boolean)
	status: boolean;

	@PropertyType(FileProperty)
	image: FileProperty;

	@Default(false)
	@PropertyType(Boolean)
	deleted: boolean;

}