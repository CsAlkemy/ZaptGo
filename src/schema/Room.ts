import {ObjectID, Schema} from "@tsed/mongoose";
import {Types} from "mongoose";
import {Default, Property, PropertyType} from "@tsed/common";
import {FileProperty} from "./FileProperty";

@Schema({
	schemaOptions: {
		timestamps: {
			createdAt: false,
			updatedAt: true
		}
	}
})
export class Room {
	@ObjectID("id")
	_id: Types.ObjectId;

	@Property()
	name: string;

	@Property()
	hotel: string;

	@Property()
	capacityAdult: string;

	@Property()
	CapacityOther: string;

	@Property()
	noOfRoom: string;

	@Property()
	size: string;

	@Property()
	price: string;

	@Property()
	smokingPolicy: string;

	@PropertyType(String)
	amenities: Array<string>;

	@PropertyType(FileProperty)
	image: FileProperty;

	@Default(false)
	@PropertyType(Boolean)
	deleted: boolean;
}