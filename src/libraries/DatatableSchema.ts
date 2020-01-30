export interface LookupOption {
	from: string,
	localField: string,
	foreignField: string,
	as: string
}

export namespace DataTable {

	export interface DatatableSchema {
		draw: number;
		recordsTotal: number;
		recordsFiltered: number;
		data: object;
		post?: PostData;
		start: number;
		end: number;
		duration: number;
	}

	export interface AggregateDatatableSchema {
		draw: number;
		recordsTotal: number;
		recordsFiltered: number;
		data: object;
		post?: AggregatePostData;
		start: number;
		end: number;
		duration: number;
	}

	export class PostData {
		columns: [Column];
		draw: number;
		length: number;
		order: [Order];
		search: Search;
		start: number;
	}

	export interface Column {
		data: string;
		name: string;
		orderable: boolean;
		search: Search;
		searchable: boolean
	}

	export class AggregatePostData {
		columns: [AggregateColumn];
		draw: number;
		length: number;
		order: [Order];
		search: Search;
		start: number;
	}

	export interface AggregateColumn {
		name?: DatatableColumnData;
		data: string;
		orderable?: boolean;
		search?: Search;
		searchable?: boolean
	}

	export interface DatatableColumnData {
		name: string,
		regex: boolean
	}

	export interface Order {
		column: number;
		dir: string;
	}

	export interface Search {
		regex: boolean;
		value: string;
	}

}