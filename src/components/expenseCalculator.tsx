"use client";

import { IAPIStructure, IExpenseItem } from "@/interface/main.interface";
import { setUserDetailsToLocalStorage, updateUser } from "@/util/callPostData";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useEffect, useState } from "react";
import { RenderTable } from "./renderTable";
import { Avatar, Button, Paper, Switch, TextField } from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { deepOrange } from "@mui/material/colors";
import { setTheme, toggleUserPreferedTheme } from "@/util/user";

export const ExpenseCalculator = ({ APIdata }: { APIdata: IAPIStructure }) => {
	const [item, setItem] = useState<IExpenseItem>({ expenseName: "", price: 0, startDate: 0, tillDate: 0, isGoingToBePermanent: false });
	const [data, setData] = useState<IExpenseItem[]>([]);
	const [currentActiveTab, setCurrentActiveTab] = useState<"add" | "show">("add");
	const [isDark, setIsDark] = useState<Boolean>();

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

	useEffect(() => {
		setIsDark(setTheme() === "dark");
	}, []);

	return (
		<div className="flex gap-10 items-center flex-col m-3">
			<div className="w-[98%] flex justify-between items-center min-h-fit p-3 pr-7 dark:bg-black rounded-xl">
				<div className="flex items-center gap-2">
					<Avatar sx={{ bgcolor: deepOrange[500] }}>{localStorage.getItem("userName")?.charAt(0).toUpperCase() || ""}</Avatar>
					<div>Hi {localStorage.getItem("userName")?.toUpperCase() || ""}</div>
				</div>
				<button
					onClick={() => {
						toggleUserPreferedTheme();
						setIsDark(localStorage.getItem("theme") == "dark");
					}}
					className="scale-[1.7]">
					{isDark ? "☀️" : "🌑"}{" "}
				</button>
			</div>
			<div className="w-[98%]">
				<Tabs
					value={currentActiveTab}
					variant="fullWidth"
					allowScrollButtonsMobile
					scrollButtons
					onChange={(event: React.SyntheticEvent, newValue: "add" | "show") => setCurrentActiveTab(newValue)}>
					<Tab className="text-xs" value="add" label="Add Expense" />
					<Tab value="show" className="text-xs" label="Show Expense" />
					<Tab value="graph" className="text-xs" label="Graph" disabled />
				</Tabs>
			</div>
			{currentActiveTab == "add" ? (
				<div className="flex flex-col gap-5 w-full overflow-auto max-w-fit">
					<TextField value={item.expenseName} onChange={(e) => updateItem("expenseName", e.target.value)} label="What is your expense today?" variant="standard" />

					<TextField value={item.price == 0 ? "" : item.price} onChange={(e) => updateItem("price", e.target.value)} label="at what price?" variant="standard" />

					<div className="flex gap-2 flex-col">
						<label>on?</label>
						<input type="date" onChange={(e) => updateItem("startDate", new Date(e.target.value).getTime())}></input>
						{/* <DateTimePicker /> */}
					</div>

					<div className="flex gap-2">
						<Switch value={item.isGoingToBePermanent} onChange={(e) => updateItem("isGoingToBePermanent", e.target.checked)}></Switch>
						{/* <input type="checkbox" onChange={}></input> */}
						<label>Is this expense till particular date?</label>
					</div>
					{item.isGoingToBePermanent && (
						<div className="flex gap-2 flex-col">
							<label>till ?</label>
							<input type="date" onChange={(e) => updateItem("tillDate", new Date(e.target.value).getTime())}></input>
							{/* <DateTimePicker /> */}
						</div>
					)}

					<Button
						onClick={() => {
							setItem({ expenseName: "", price: 0, startDate: 0, tillDate: 0, isGoingToBePermanent: false });
							const customItem = { ...item, id: data.length + 1 };
							setData([...data, customItem]);
							updateUser(localStorage.getItem("userName")!, { expenses: [...data, customItem] });
							setCurrentActiveTab("show");
						}}
						variant="text">
						Add
					</Button>
				</div>
			) : (
				<RenderTable data={data} />
			)}
		</div>
	);
};
