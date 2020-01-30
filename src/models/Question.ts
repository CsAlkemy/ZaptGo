import {Model, ObjectID} from "@tsed/mongoose";
import {Types} from "mongoose";
import {Default, Property, PropertyType} from "@tsed/common";

@Model({
	collection: "Question",
	schemaOptions: {
		timestamps: {
			createdAt: false,
			updatedAt: true
		}
	}
})

export class Question {
	@ObjectID("id")
	_id: Types.ObjectId;

	@Property()
	name: string;

	@Property()
	email: string;

	@Property()
	question: string;

	@Property()
	answer: string;

	@Default(false)
	@PropertyType(Boolean)
	deleted: boolean;

	@PropertyType(Date)
	updatedAt: Date;

}