import {GlobalAcceptMimesMiddleware, ServerLoader, ServerSettings} from "@tsed/common";
import {$log} from "ts-log-debug";
import {Env} from "@tsed/core";
import * as dt from 'dotenv';
import {ViewLocals} from "./middlewares/ViewLocals";
import {MDBConnection} from "@tsed/mongoose";
import './middlewares/ErrorHandler'

const session = require("express-session");
const MongoDBStore = require('connect-mongodb-session')(session);
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const compress = require('compression');
const methodOverride = require('method-override');


const rootDir = __dirname;
dt.config();

@ServerSettings({
	rootDir,
	acceptMimes: ["application/json"],
	statics: {
		"/": `${rootDir}/../public/`
	},
	componentsScan: [
		`${rootDir}/middlewares/*`,
		`${rootDir}/services/*`
	],
	mongoose: {
		url: process.env.MONGODB_URI||"mongodb://127.0.0.1:27017/tms",
		connectionOptions: {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true
		},
	},
	mount: {
		"/": `${rootDir}/controllers/*`,
		'/admin': `${rootDir}/controllers/admin/**`,
		'/partner': `${rootDir}/controllers/partner/**`,
		'/user': `${rootDir}/controllers/user/**`,
	},
	httpPort: process.env.PORT,
	viewsDir: `${rootDir}/views`,
	env: Env.DEV,
})
export class Server extends ServerLoader {
	public db;

	public async $beforeInit() {
		$log.stop();
		this.set("views", this.settings.get('viewsDir'))
			.set("view engine", "pug");
	}

	public async $beforeRoutesInit(): Promise<void | Promise<any>> {
		this
			.use(GlobalAcceptMimesMiddleware)
			.use(cookieParser(process.env.secret))
			.use(compress({}))
			.use(bodyParser.json())
			.use(bodyParser.urlencoded({
				extended: true
			}))
			.use(ViewLocals)
			.use(methodOverride());
		let store = await new MongoDBStore({
			uri: this.settings.get<MDBConnection>("mongoose").url,
			collection: 'sessions',
			expires: 5 * 60
		}, function (error) {
			if (error) {
				console.log(error);
			}
		});
		store.on('connected', function (e) {
			store.client;
		});
		this.set("trust proxy", 1)
			.use(session({
				secret: process.env.secret,
				unset: 'destroy',
				cookie: {
					path: '/',
					maxAge: 1000 * 60 * 60 * 6,
					httpOnly: false,
					secure: false
				},
				store: store,
				resave: false,
				saveUninitialized: false,
			}));
	}

	$onServerInitError(error: any): any {
		console.log(error);
	}
}