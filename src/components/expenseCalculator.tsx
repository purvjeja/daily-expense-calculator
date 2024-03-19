"use client";

import { IAPIStructure, IExpenseItem } from "@/interface/main.interface";
import { setUserDetailsToLocalStorage, updateUser } from "@/util/callPostData";
import { useEffect, useState } from "react";
import { RenderTable } from "./renderTable";
import { Avatar, Switch } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import { setTheme, toggleUserPreferedTheme } from "@/util/user";
import { InputComponent } from "./inputComponent";
import { RenderGraph } from "./RenderGraph";

export const ExpenseCalculator = ({ APIdata }: { APIdata: IAPIStructure }) => {
	const [data, setData] = useState<IExpenseItem[]>([]);
	const [currentActiveTab, setCurrentActiveTab] = useState<"add" | "show" | "graph">("add");
	const [isDark, setIsDark] = useState<Boolean>(false);
	const [userNameState, setUserNameState] = useState<string>("");

	const addNewUser = async () => {
		let inputedName = prompt("Hey, you seems to new here! Add your name and let's get started");
		inputedName = inputedName ? inputedName?.replaceAll(" ", "") : "";
		if (!inputedName) addNewUser();
		else {
			if (Object.keys(APIdata).includes(inputedName)) {
				setUserDetailsToLocalStorage(inputedName);
				setData(APIdata[inputedName]["expenses"]);
			} else await updateUser(inputedName, { expenses: [] });
			setUserNameState(inputedName);
		}
	};

	useEffect(() => {
		const userName = localStorage.getItem("userName");

		if (!userName) {
			addNewUser();
		} else {
			setUserDetailsToLocalStorage(userName);
			setData(APIdata[userName]["expenses"] || []);
		}

		setIsDark(setTheme() === "dark");
		setUserNameState(userName || "");
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="flex gap-10 items-center flex-col">
			<div className="w-full flex flex-col gap-7 min-h-fit bg-gray-50 dark:bg-blue-950 shadow-sm dark:shadow-lg shadow-gray-50 dark:shadow-blue-950">
				<div className="w-full static top-0 flex justify-between items-center min-h-fit p-3 pr-7 px-5">
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
				<div className="w-full flex justify-center gap-5 overflow-x-auto">
					<div
						className={`text-xs p-3 whitespace-nowrap ${currentActiveTab == "add" ? "font-bold border-b-2 border-navy dark:border-wheat " : ""}`}
						onClick={() => setCurrentActiveTab("add")}>
						Add Expenses
					</div>
					<div
						className={`text-xs p-3 whitespace-nowrap ${currentActiveTab == "show" ? "font-bold border-b-2 border-navy dark:border-wheat" : ""}`}
						onClick={() => setCurrentActiveTab("show")}>
						List
					</div>
					<div
						className={`text-xs p-3 whitespace-nowrap ${currentActiveTab == "graph" ? "font-bold border-b-2 border-navy dark:border-wheat" : ""}`}
						onClick={() => setCurrentActiveTab("graph")}>
						Graph
					</div>
				</div>
			</div>
			{currentActiveTab == "add" ? (
				<InputComponent
					onInputCallBack={(item: IExpenseItem) => {
						const customItem = { ...item, id: data.length + 1 };
						setData([...data, customItem]);
						updateUser(localStorage.getItem("userName")!, { expenses: [...data, customItem] });
						setCurrentActiveTab("show");
					}}
				/>
			) : currentActiveTab == "show" ? (
				<RenderTable data={data} isDark={isDark} />
			) : (
				<RenderGraph />
			)}
		</div>
	);
};
