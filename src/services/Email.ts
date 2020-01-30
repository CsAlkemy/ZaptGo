import {Service} from "@tsed/common";
import {createTransport, Transporter} from "nodemailer";


@Service()
export class Email {
	public transporter: Transporter;

	constructor() {
		this.transporter = createTransport({
			host: "champteks.us",
			port: 465,
			secure: true,
			auth: {
				user: "test@ah.champteks.us",
				pass: "2021@2021."
			}
		});
	}
}