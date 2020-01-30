export enum Status {
	ACTIVE,
	INACTIVE,
	SUSPENDED,
	INVITED,
	APPLIED,
	REGISTERED,
	TERMINATED
}

export enum TimeStationType {
	WorkingDay,
	VacationDay,
	SickDay
}

export namespace Payroll {
	export enum PayFrequency {
		EveryWeek,
		EveryMonth,
		EveryOtherWeek,
		ThriceAMonth
	}

	export enum PaymentType {
		Salary,
		Hourly
	}

	export enum Frequency {
		PerWeek,
		PerMonth,
		PerYear,
		Hourly
	}

	export enum MaritalStatus {
		Single,
		Married,
		MarriedButWithhold,
		NotWithhold
	}
}

export enum PaymentStatus {
	REFUNDED = -2,
	VOIDED = -1,
	PAID,
	PARTIAL,
	DUE,
	PENDING
}

export enum SaleStatus {
	COMPLETED,
	VOIDED,
	ORDERED,
	SUSPENDED,
	RETURNED
}

export enum PaymentType {
	CASH,
	CHECK,
	CREDIT_CARD,
	CREDIT_DEBIT,
	OTHER
}

export enum PaymentTypeString {
	'Cash',
	'Check',
	'Credit Card',
	'Credit/Debit',
	'Other'
}

export enum CardLogo {
	MASTERCARD,
	VISA,
	AMERICANEXPRESS,
	DISCOVER
}

export enum POPUP {
	ONE = '#remoteModal1',
	TWO = '#remoteModal2'
}

export enum PaymentTermType {
	DAY,
	WEEK,
	MONTH
}

export enum FONT {
	Courier = 'Courier',
	CourierBold = 'Courier-Bold',
	CourierOblique = 'Courier-Oblique',
	CourierBoldOblique = 'Courier-BoldOblique',
	Helvetica = 'Helvetica',
	HelveticaBold = 'Helvetica-Bold',
	HelveticaOblique = 'Helvetica-Oblique',
	HelveticaBoldOblique = 'Helvetica-BoldOblique',
	Symbol = 'Symbol',
	TimesRoman = 'Times-Roman',
	TimesBold = 'Times-Bold',
	TimesItalic = 'Times-Italic',
	TimesBoldItalic = 'Times-BoldItalic',
	ZapfDingbats = 'ZapfDingbats',
}