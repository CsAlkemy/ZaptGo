import {MongooseModel} from "@tsed/mongoose";
import {DataTable} from "./DatatableSchema";
import {Action} from "../config/TableAction";
import Column = DataTable.Column;
import PostData = DataTable.PostData;
import DatatableSchema = DataTable.DatatableSchema;

export class Datatable {
	private filtered: number = 1;
	private columns: Array<string> = ['_id'];
	private start: number = Date.now();
	private end;
	private query;
	private filter;

	constructor(private model: MongooseModel<any>, private post: PostData, private whereOption: object = {}, private populateOptions: string[] = []) {
		this.query = this.model.find();
		this.filter = this.model.find();
		post.columns.forEach((column: Column) => {
			this.columns.push(column.name ? column.name : column.data);
		});
	}

	private async output(): Promise<object> {
		let search = [];

		this.post.columns.forEach(column => {
			let columnName = column.name ? column.name : column.data;
			if (this.post.search.value) {
				let temp = {};
				if (this.post.search.regex) {
					temp[columnName] = {$regex: new RegExp(this.post.search.value, 'i')};
				} else {
					temp[columnName] = this.post.search.value;
				}
				search.push(temp);
			}
			if (column.searchable) {
				if (column.search.value) {
					let temp = {};
					if (column.search.value.includes("-yadcf_delim-")) {
						let dates = column.search.value.split("-yadcf_delim-");
						let time = {};
						if (dates[0]) {
							time['$gte'] = new Date(dates[0]);
						}
						if (dates[1]) {
							time['$lte'] = new Date(dates[1]);
						}
						if (time) {
							temp[columnName] = time;
						}
					} else {
						temp[columnName] = {$regex: new RegExp(column.search.value, 'i')};

					}
					this.query.where(temp);
					this.filter.where(temp);
				}
			}
		});


		if (search.length > 0) {
			this.query.where({
				$or: search
			});
			this.filter.where({
				$or: search
			});
		}
		if (this.whereOption) {
			this.query.where(this.whereOption);
			this.filter.where(this.whereOption);
		}
		if (this.post.order.length > 0) {
			this.post.order.forEach(value => {
				let order = {};
				order[this.columns[value.column + 1]] = value.dir;
				this.query.sort(order);
			});
		}
		let result = this.query
			.select(this.columns)
			.skip(this.post.start)
			.limit(this.post.length);
		this.populateOptions.forEach(populate => {
			result.populate(populate);
		});
		this.filtered = await this.filter.countDocuments().exec();
		return result;
	}

	private async total(): Promise<number> {
		return await this.model.countDocuments().where(this.whereOption).exec();
	}

	public async generate(button?: Action): Promise<DatatableSchema> {
		let out: object = await this.makeOutput(button);
		let total = await this.total();
		this.end = Date.now();
		return {
			data: out,
			draw: this.post.draw,
			start: this.start,
			recordsFiltered: this.filtered,
			recordsTotal: total,
			post: this.post,
			end: this.end,
			duration: (this.end - this.start) / 1000
		};
	}

	private async makeOutput(button?: Action): Promise<object> {
		let out: object = await this.output();
		let finalOutput = [];

		Object.values(out).forEach((value) => {
			let temp: object = value.toObject();
			if (button) {
				temp["actions"] = button.html.replace(/\{\$1\}/gi, value._id);
			}
			finalOutput.push(temp);
		});

		return finalOutput;
	}

}

