import { IExpenseItem } from "@/interface/main.interface";
import { calculateDailyPrice, calculateDateDifference, isExpenseTillToday } from "@/util/calculations";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export const RenderTable = ({ data, isDark }: { data: IExpenseItem[]; isDark: Boolean }) => {
	const columns: GridColDef[] = [
		{
			field: "expenseName",
			headerName: "Name",
			width: 200,
			editable: false,
		},
		{
			field: "expenseDate",
			headerName: "On",
			width: 200,
			editable: false,
		},
		{
			field: "price",
			headerName: "Price",
			width: 200,
			editable: false,
		},
		{
			field: "sinceDaysOfExpense",
			headerName: "Since Days of Expense",
			width: 200,
			editable: false,
		},
		{
			field: "currentDailyPrice",
			headerName: "Current Daily Price",
			width: 200,
			editable: true,
		},
	];

	const rows = data.map((d) => ({
		id: d.id,
		expenseName: d.expenseName,
		expenseDate: new Date(d.startDate).toLocaleDateString(),
		price: d.price,
		sinceDaysOfExpense: calculateDateDifference(d.isGoingToBePermanent ? d.tillDate : new Date().getTime(), d.startDate),
		currentDailyPrice: calculateDailyPrice(d.isGoingToBePermanent ? d.tillDate : new Date().getTime(), d.startDate, d.price),
	}));

	return (
		<div className="w-full flex flex-col gap-5 items-center max-w-fit">
			<div className="whitespace-nowrap text-[14px]">
				{`Today's Daily Expense Rate: `}
				<span className="text-white font-bold">
					₹{" "}
					{parseFloat(
						String(
							data.reduce((accumulator, d) => {
								const expenseDailyCount = !d.isGoingToBePermanent
									? Number(calculateDailyPrice(d.isGoingToBePermanent ? d.tillDate : new Date().getTime(), d.startDate, d.price))
									: isExpenseTillToday(d)
									? Number(calculateDailyPrice(d.isGoingToBePermanent ? d.tillDate : new Date().getTime(), d.startDate, d.price))
									: 0;
								return accumulator + expenseDailyCount;
							}, 0),
						),
					).toFixed(2)}{" "}
					/-
				</span>
			</div>
			{data.length ? (
				<div className="flex flex-col justify-center items-center mx-3 gap-5">
					<Box sx={{ overflow: "auto" }}>
						<Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
							<DataGrid
								sx={{ border: isDark ? "2px solid wheat" : "2px solid rgba(5, 17, 35)", color: isDark ? "wheat" : "rgba(5, 17, 35)" }}
								rows={rows}
								columns={columns}
								checkboxSelection
								disableRowSelectionOnClick
							/>
						</Box>
					</Box>
				</div>
			) : (
				<h1 className="text-xl dark:font-bold">No data to show, Please add some.</h1>
			)}{" "}
		</div>
	);
};
