import {Model, ObjectID} from "@tsed/mongoose";
import {Types} from "mongoose";
import {Default, Property, PropertyType} from "@tsed/common";

@Model({
	collection: "Offers",
	schemaOptions: {
		timestamps: {
			createdAt: false,
			updatedAt: true
		}
	}
})

export class Offers {
	@ObjectID("id")
	_id: Types.ObjectId;

	@Property()
	offerName: string;

	@PropertyType(Number)
	percentage: number;

	@Property()
	code: string;

	@Property()
	description: string;

	@Default(false)
	@PropertyType(Boolean)
	deleted: boolean;

	@PropertyType(Date)
	updatedAt: Date;

}