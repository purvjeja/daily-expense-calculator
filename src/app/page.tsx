"use client";

import { useState } from "react";

interface IExpenseItem {
	name: string;
	price: number;
	date: number;
	id: number;
}

export default function Home() {
	const [item, setItem] = useState<{ name: string; price: number; date: number }>({ name: "", price: 0, date: 0 });
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

	return (
		<div className="flex justify-center gap-10 flex-col m-5 min-w-fit">
			<div className="flex gap-2 w-full overflow-auto ">
				<label>What is your expense today?</label>
				<input type="text" onChange={(e) => setItem({ name: e.target.value, price: item.price, date: item.date })}></input>,<label>at what price?</label>
				<input type="number" onChange={(e) => setItem({ name: item.name, price: parseInt(e.target.value), date: item.date })}></input>
				<label>on?</label>
				<input type="date" onChange={(e) => setItem({ name: item.name, price: item.price, date: new Date(e.target.value).getTime() })}></input>
				<button
					onClick={() => {
						const customItem = { ...item, id: data.length + 1 };
						setData([...data, customItem]);
						postDataforExpense([...data, customItem]);
					}}>
					Add
				</button>
			</div>
			<div className="flex gap-20px w-full overflow-auto">
				<div className="flex flex-col font-extrabold text-[30px] gap-10 min-w-fit m-5">
					<div>Name</div>
					<div>Price</div>
					<div>Days</div>
					<div>Current Daily Price</div>
				</div>
				<div className="flex gap-10">
					{data?.map((d) => (
						<div key={d.id} className="flex flex-col min-w-fit gap-10 text-[30px] m-5 text-black">
							<div>{d.name}</div>
							<div>{d.price}</div>
							<div>{Math.round((new Date().getTime().valueOf() - d.date.valueOf()) / 86400000)}</div>
							<div>{d.price / Math.round((new Date().getTime().valueOf() - d.date.valueOf()) / 86400000)}</div>
						</div>
					))}
				</div>
			</div>
			<div>
				{`Today's Daily Expense Rate: `}
				<span>{data.reduce((accumulator, d) => accumulator + d.price / Math.round((new Date().getTime().valueOf() - d.date.valueOf()) / 86400000), 0)}</span>
			</div>
		</div>
	);
}
