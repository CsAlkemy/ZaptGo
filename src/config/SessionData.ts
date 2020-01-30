import {User} from "../models/User";
import {UserType} from "./Config";

export class Data {
	public user: User;
	public userType: UserType;
}

export class $SESSION {
	public user: User;
	public data: Data;
}