import { IExpenseItem } from "@/interface/main.interface";

export const calculateDateDifference = (date2: number, date1: number) => Math.round((date2.valueOf() - date1.valueOf()) / 86400000) + 1;

export const calculateDailyPrice = (date2: number, date1: number, price: number) => parseFloat(String(price / calculateDateDifference(date2, date1))).toFixed(2);

export const isExpenseTillToday = (expenseObject: IExpenseItem) => {
	const todayTimestamp = new Date().getTime();
	// if (expenseObject.expenseName == "test out")
	// 	console.log(
	// 		new Date(todayTimestamp).toLocaleString(),
	// 		" || ",
	// 		new Date(expenseObject.startDate - 86400 * 229.16).toLocaleString(),
	// 		" || ",
	// 		new Date(expenseObject.tillDate + 86400 * 770.83).toLocaleString(),
	// 	);
	return todayTimestamp >= expenseObject.startDate - 86400 * 229.16 && todayTimestamp <= expenseObject.tillDate + 86400 * 770.83;
};
