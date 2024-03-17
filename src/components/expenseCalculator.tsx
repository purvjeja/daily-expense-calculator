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
	const [isDark, setIsDark] = useState<Boolean>(false);
	const [userNameState, setUserNameState] = useState<string>("");

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

		setIsDark(setTheme() === "dark");
		setUserNameState(userName || "");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex gap-10 items-center flex-col m-3">
			<div className="w-[98%] flex justify-between items-center min-h-fit p-3 pr-7 dark:bg-gray-900 rounded-xl">
				<div className="flex items-center gap-2">
					<Avatar sx={{ bgcolor: deepOrange[500] }}>{userNameState?.charAt(0).toUpperCase() || ""}</Avatar>
					<div>Hi {userNameState?.toUpperCase()}</div>
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
			<div className="w-full flex justify-center	 gap-5">
				<div
					className={`text-xs p-3 ${currentActiveTab == "add" ? "bg-gray-900 rounded font-medium" : "border border-black rounded"}`}
					onClick={() => setCurrentActiveTab("add")}>
					Add Expenses
				</div>
				<div className={`text-xs p-3 ${currentActiveTab == "show" ? "bg-gray-900 rounded" : "border border-black rounded"}`} onClick={() => setCurrentActiveTab("show")}>
					Expenses List
				</div>
				{/* <div value="graph" className="text-xs" label="Graph" disabled></div> */}
			</div>
			{currentActiveTab == "add" ? (
				<div className="flex flex-col gap-5 w-full overflow-auto max-w-fit">
					<input value={item.expenseName} onChange={(e) => updateItem("expenseName", e.target.value)} placeholder="What is your expense today?" />

					<input value={item.price == 0 ? "" : item.price} onChange={(e) => updateItem("price", e.target.value)} placeholder="at what price?" />

					<div className="flex gap-2 flex-col">
						<label>on?</label>
						<input type="date" onChange={(e) => updateItem("startDate", new Date(e.target.value).getTime())} placeholder="DD/MM/YYY" />
					</div>

					<div className="flex gap-2">
						<Switch
							TouchRippleProps={{ color: "black" }}
							value={item.isGoingToBePermanent}
							onChange={(e) => updateItem("isGoingToBePermanent", e.target.checked)}></Switch>
						<label>Is this expense till particular date?</label>
					</div>
					{item.isGoingToBePermanent && (
						<div className="flex gap-2 flex-col">
							<label>till ?</label>
							<input type="date" onChange={(e) => updateItem("tillDate", new Date(e.target.value).getTime())} placeholder="DD/MM/YYY" />
						</div>
					)}

					<button
						className="w-full border border-gray-900 text-white font-bold p-3"
						onClick={() => {
							setItem({ expenseName: "", price: 0, startDate: 0, tillDate: 0, isGoingToBePermanent: false });
							const customItem = { ...item, id: data.length + 1 };
							setData([...data, customItem]);
							updateUser(localStorage.getItem("userName")!, { expenses: [...data, customItem] });
							setCurrentActiveTab("show");
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
