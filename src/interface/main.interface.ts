export interface IExpenseItem {
	expenseName: string;
	price: number;
	startDate: number;
	id?: number;
	isGoingToBePermanent: Boolean;
	tillDate: number;
}

export interface IUser {
	expenses: IExpenseItem[];
}

export interface IAPIStructure {
	[key: string]: IUser;
}
