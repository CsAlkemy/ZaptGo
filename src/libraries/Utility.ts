
export function ucFirst(value: string, restIsLower: boolean = false): string {
	return value.charAt(0).toUpperCase() + (restIsLower ? value.slice(1).toLowerCase() : value.slice(1));
};

export function lcFirst(value: string, restIsLower: boolean = false): string {
	return value.charAt(0).toLowerCase() + (restIsLower ? value.slice(1).toLowerCase() : value.slice(1));
};


export function pad(str, max: number): number {
	str = str.toString();
	return str.length < max ? pad("0" + str, max) : str;
}


