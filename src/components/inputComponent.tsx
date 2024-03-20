import { IExpenseItem } from "@/interface/main.interface";
import { Switch } from "@mui/material";
import { useState } from "react";

export const InputComponent = ({ onInputCallBack }: { onInputCallBack: (data: IExpenseItem) => void }) => {
	const [item, setItem] = useState<IExpenseItem>({ expenseName: "", price: 0, startDate: 0, tillDate: 0, isGoingToBePermanent: false });
	const [sameDayExpense, setSameDayExpense] = useState<Boolean>(true);

	const updateItem = (itemName: keyof IExpenseItem, value: string | number | boolean) => {
		const currentInputObject = item;
		setItem({ ...currentInputObject, [itemName]: value });
	};

	const validateInputs = () => {
		if (sameDayExpense) {
			return item.expenseName !== "" && item.price !== 0;
		} else {
			if (item.isGoingToBePermanent) {
				return item.expenseName !== "" && item.price !== 0 && item.startDate !== 0 && item.tillDate !== 0;
			} else {
				return item.expenseName !== "" && item.price !== 0 && item.startDate !== 0;
			}
		}
	};

	const onAddClick = () => {
		if (validateInputs()) {
			if (sameDayExpense) {
				onInputCallBack({ ...item, isGoingToBePermanent: true, startDate: new Date().getTime(), tillDate: new Date().getTime() });
				setItem({ expenseName: "", price: 0, startDate: 0, tillDate: 0, isGoingToBePermanent: false });
			} else {
				onInputCallBack(item);
			}
		} else {
			alert("Please ensure that all fields have been entered accurately.");
		}
	};

	return (
		<div className="flex flex-col gap-5 mt-8 overflow-auto w-11/12">
			<input
				className="dark:bg-blue-950"
				type="text"
				value={item.expenseName}
				onChange={(e) => updateItem("expenseName", e.target.value)}
				placeholder="What is your expense today?"
			/>
			<input
				className="dark:bg-blue-950"
				type="number"
				value={item.price == 0 ? "" : item.price}
				onChange={(e) => updateItem("price", e.target.value)}
				placeholder="at what price?"
			/>

			<div className="flex items-center gap-2">
				<Switch defaultChecked={true} onChange={() => setSameDayExpense(!sameDayExpense)}></Switch>
				<label>This is same day expense.</label>
			</div>

			{!sameDayExpense ? (
				<>
					<div className="flex gap-2">
						<Switch value={item.isGoingToBePermanent} onChange={(e) => updateItem("isGoingToBePermanent", e.target.checked)}></Switch>
						<label>Is this expense till particular date?</label>
					</div>
					<div className="flex gap-2 flex-col">
						<label>on?</label>
						<input
							className="dark:bg-blue-950 text-wheat"
							type="date"
							onChange={(e) => updateItem("startDate", new Date(e.target.value).getTime())}
							placeholder="DD/MM/YYY"
						/>
					</div>
					{item.isGoingToBePermanent && (
						<div className="flex gap-2 flex-col">
							<label>till ?</label>
							<input
								className="dark:bg-blue-950 text-wheat"
								type="date"
								onChange={(e) => updateItem("tillDate", new Date(e.target.value).getTime())}
								placeholder="DD/MM/YYY"
							/>
						</div>
					)}
				</>
			) : (
				<></>
			)}
			<button className="w-full border border-navy dark:border-wheat text-navy dark:text-wheat rounded-lg font-bold p-3" onClick={() => onAddClick()}>
				Add
			</button>
		</div>
	);
};
