"use client";

import { IAPIStructure, IExpenseItem } from "@/interface/main.interface";
import { setUserDetailsToLocalStorage, updateUser } from "@/util/callPostData";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useEffect, useState } from "react";
import { RenderTable } from "./renderTable";

export const ExpenseCalculator = ({ APIdata }: { APIdata: IAPIStructure }) => {
	const [item, setItem] = useState<IExpenseItem>({ expenseName: "", price: 0, startDate: 0, tillDate: 0, isGoingToBePermanent: false });
	const [data, setData] = useState<IExpenseItem[]>([]);
	const [currentActiveTab, setCurrentActiveTab] = useState<"add" | "show">("add");

	const updateItem = (itemName: keyof IExpenseItem, value: string | number | boolean) => {
		const currentInputObject = item;
		setItem({ ...currentInputObject, [itemName]: value });
	};

	const addNewUser = async () => {
		const inputedName = prompt("Hey, you seems to be new here! Add your name and let's get started");
		if (!inputedName) addNewUser();
		else {
			if (Object.keys(APIdata).includes(inputedName)) {
				setUserDetailsToLocalStorage(inputedName);
				setData(APIdata[inputedName]["expenses"]);
			} else await updateUser(inputedName, { expenses: [] });
		}
	};

	useEffect(() => {
		const userName = localStorage.getItem("userName");
		if (!userName) {
			addNewUser();
		} else {
			console.log(APIdata[userName]);
			setUserDetailsToLocalStorage(userName);
			setData(APIdata[userName]["expenses"] || []);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex gap-10 items-center flex-col m-3">
			<div className="w-[98%]">
				<Tabs
					value={currentActiveTab}
					variant="fullWidth"
					allowScrollButtonsMobile
					scrollButtons
					onChange={(event: React.SyntheticEvent, newValue: "add" | "show") => setCurrentActiveTab(newValue)}>
					<Tab style={{ color: "black" }} className="text-xs" value="add" label="Add Expense" />
					<Tab value="show" className="text-xs" label="Show Expense" />
					<Tab value="graph" className="text-xs" label="Graph" disabled />
				</Tabs>
			</div>
			{currentActiveTab == "add" ? (
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
							updateUser(localStorage.getItem("userName")!, { expenses: [...data, customItem] });
						}}>
						Add
					</button>
				</div>
			) : (
				<RenderTable data={data} />
			)}
		</div>
	);
};
