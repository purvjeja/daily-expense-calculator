"use client";

import { it } from "node:test";
import { useState } from "react";

interface IExpenseItem {
	expenseName: string;
	price: number;
	startDate: number;
	id?: number;
	isGoingToBePermanent: Boolean;
	tillDate: number;
}

// [
// 	{
// 		expenseName: "Mobile Phone - Realme 12 pro max",
// 		price: 30750,
// 		date: 1710028800000,
// 		id: 1,
// 		tillDate: 0,
// 		isGoingToBePermanent: false,
// 	},
// 	{
// 		expenseName: "WakeFit Queen Size Bed",
// 		price: 6579,
// 		date: 1707177600000,
// 		id: 2,
// 		tillDate: 0,
// 		isGoingToBePermanent: false,
// 	},
// ];

export default function Home() {
	const [item, setItem] = useState<IExpenseItem>({ expenseName: "", price: 0, startDate: 0, tillDate: 0, isGoingToBePermanent: false });
	const [data, setData] = useState<IExpenseItem[]>([]);

	const getAndSetData = async () => {
		const dataItem = await fetch("https://api.jsonbin.io/v3/b/65f0ba97dc74654018b1fe10", {
			headers: { "X-Master-Key": "$2b$10$36wvnzpKZqVs9l1ZsHS2jON.JWV9pBcgmU98Oce5jnCYheagDHuyq" },
		}).then((res) => res.json());
		console.log(dataItem);
		setData(dataItem.record.expenses);
	};

	const postDataforExpense = async (dataToPost: IExpenseItem[]) => {
		const responseData = await fetch("https://api.jsonbin.io/v3/b/65f0ba97dc74654018b1fe10", {
			method: "PUT",
			headers: { "X-Master-Key": "$2b$10$36wvnzpKZqVs9l1ZsHS2jON.JWV9pBcgmU98Oce5jnCYheagDHuyq", "Content-Type": "application/json" },
			body: JSON.stringify({ expenses: dataToPost }),
		}).then((res) => res.json());
	};

	useState(() => {
		getAndSetData();
	});

	const updateItem = (itemName: keyof IExpenseItem, value: string | number | boolean) => {
		const currentInputObject = item;
		setItem({ ...currentInputObject, [itemName]: value });
	};

	const calculateDateDifference = (date2: number, date1: number) => Math.round((date2.valueOf() - date1.valueOf()) / 86400000);

	const calculateDailyPrice = (date2: number, date1: number, price: number) => parseFloat(String(price / calculateDateDifference(date2, date1))).toFixed(2);
	return (
		<div className="flex justify-center  gap-10 flex-col m-5 min-w-fit">
			<div className="flex flex-col gap-5 w-full overflow-auto max-w-fit">
				<div className="flex gap-2 flex-col">
					<label>What is your expense today?</label>
					<input type="text" onChange={(e) => updateItem("expenseName", e.target.value)}></input>
				</div>

				<div className="flex gap-2 flex-col">
					<label>at what price?</label>
					<input type="number" onChange={(e) => updateItem("price", e.target.value)}></input>
				</div>

				<div className="flex gap-2 flex-col">
					<label>on?</label>
					<input type="date" onChange={(e) => updateItem("startDate", new Date(e.target.value).getTime())}></input>
				</div>

				<div className="flex gap-2">
					<input type="checkbox" onChange={(e) => updateItem("isGoingToBePermanent", e.target.checked)}></input>
					<label>Is this expense till particular date?</label>
				</div>
				{item.isGoingToBePermanent && (
					<div className="flex gap-2 flex-col">
						<label>till ?</label>
						<input type="date" onChange={(e) => updateItem("tillDate", new Date(e.target.value).getTime())}></input>
					</div>
				)}

				<button
					className="m-2 border-black border-2 rounded"
					onClick={() => {
						setItem({ expenseName: "", price: 0, startDate: 0, tillDate: 0, isGoingToBePermanent: false });
						const customItem = { ...item, id: data.length + 1 };
						setData([...data, customItem]);
						postDataforExpense([...data, customItem]);
					}}>
					Add
				</button>
			</div>
			<div>
				{`Today's Daily Expense Rate: `}
				<span className="bg-black text-white font-bold text-[18px] p-2 rounded">
					₹{" "}
					{parseFloat(
						String(
							data.reduce(
								(accumulator, d) => accumulator + Number(calculateDailyPrice(d.isGoingToBePermanent ? d.tillDate : new Date().getTime(), d.startDate, d.price)),
								0,
							),
						),
					).toFixed(2)}{" "}
					/-
				</span>
			</div>
			<table>
				<tr>
					<th>Sr No. </th>
					<th>Expense Name</th>
					<th>Price</th>
					<th>Since Days of Expense</th>
					<th>Current Daily Price</th>
				</tr>
				{data?.map((d) => (
					<tr key={d.id}>
						<td>{d.id}</td>
						<td>{d.expenseName}</td>
						<td>{d.price}</td>
						<td>
							{calculateDateDifference(new Date().getTime(), d.startDate)}{" "}
							{d.isGoingToBePermanent ? <span className="bg-black p-1 text-white text-[10px] rounded-3xl ">Fixed</span> : null}{" "}
						</td>
						<td>{calculateDailyPrice(d.isGoingToBePermanent ? d.tillDate : new Date().getTime(), d.startDate, d.price)}</td>
					</tr>
				))}
			</table>
		</div>
	);
}
