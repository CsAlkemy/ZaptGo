import {Model, ObjectID} from "@tsed/mongoose";
import {Types} from "mongoose";
import {Default, PropertyType} from "@tsed/common";

@Model({
	collection: "Payment",
	schemaOptions: {
		timestamps: {
			createdAt: false,
			updatedAt: true
		}
	}
})

export class Payment {
	@ObjectID("id")
	_id: Types.ObjectId;

	@Default(false)
	@PropertyType(Boolean)
	deleted: boolean;

	@PropertyType(Date)
	updatedAt: Date;

}