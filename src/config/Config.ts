import {FileProperty} from "../schema/FileProperty";

export enum METHOD {
	POST = 'POST',
	GET = 'GET'
}

export class Config {
	public pageScript?: { js: string[], css: string[] }[] = new Array<{ js: string[], css: string[] }>();
	public render?: string;
	public title?: string;
	public view?: string;
	public data?: object = {};
	public breadCrumb?: BreadCrumb.Menu;
	public showTopBar?: boolean = true;
	//public notification?: Array<Notification> = new Array<Notification>();
}

export function MakeFileProperty(file: Express.Multer.File): FileProperty {
	if (file) {
		let fileProperty = new FileProperty();
		fileProperty.mimeType = file.mimetype;
		fileProperty.name = file.filename;
		fileProperty.originalName = file.originalname;
		fileProperty.size = file.size;
		fileProperty.path = "/uploads/" + file.filename;
		return fileProperty;
	} else {
		return undefined;
	}
}




export enum UserType {
	ADMIN,
	PARTNER,
	USER
}
export namespace BreadCrumb {

	export class Menu {
		title: string;
		items: Item[];
	}

	export class Item {
		text: string;
		link: string | false;
	}
}