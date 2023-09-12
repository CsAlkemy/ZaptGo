import {Model, ObjectID} from "@tsed/mongoose";
import {Types} from "mongoose";
import {Default, Property, PropertyType} from "@tsed/common";
import {FileProperty} from "../schema/FileProperty";

@Model({
	collection: "Area",
	schemaOptions: {
		timestamps: {
			createdAt: false,
			updatedAt: true
		}
	}
})

export class Area {
	@ObjectID("id")
	_id: Types.ObjectId;

	@Property()
	name: string;

	@PropertyType(FileProperty)
	image: FileProperty;

	@Default(false)
	@PropertyType(Boolean)
	deleted: boolean;

	@PropertyType(Date)
	updatedAt: Date;

}