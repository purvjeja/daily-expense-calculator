import { IExpenseItem } from "@/interface/main.interface";
import { calculateDailyPrice, calculateDateDifference } from "@/util/calculations";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

export const RenderTable = ({ data }: { data: IExpenseItem[] }) => {
	const columns: GridColDef[] = [
		{
			field: "expenseName",
			headerName: "Name",
			width: 150,
			editable: false,
		},
		{
			field: "price",
			headerName: "Price",
			width: 150,
			editable: false,
		},
		{
			field: "sinceDaysOfExpense",
			headerName: "Since Days of Expense",
			width: 150,
			editable: false,
		},
		{
			field: "currentDailyPrice",
			headerName: "Current Daily Price",
			width: 150,
			editable: false,
		},
	];

	const rows = data.map((d) => ({
		id: d.id,
		expenseName: d.expenseName,
		price: d.price,
		sinceDaysOfExpense: calculateDateDifference(d.isGoingToBePermanent ? d.tillDate : new Date().getTime(), d.startDate),
		currentDailyPrice: calculateDailyPrice(d.isGoingToBePermanent ? d.tillDate : new Date().getTime(), d.startDate, d.price),
	}));

	return (
		<div className="w-full flex flex-col items-center max-w-fit">
			{data.length ? (
				<div className="flex flex-col justify-center items-center gap-5">
					<Box sx={{ overflow: "auto" }}>
						<Box sx={{ width: "100%", display: "table", tableLayout: "fixed" }}>
							<DataGrid rows={rows} columns={columns} checkboxSelection disableRowSelectionOnClick />
						</Box>
					</Box>
					<div>
						{`Today's Daily Expense Rate: `}
						<span className="bg-black text-white font-bold text-[18px] p-2 rounded whitespace-nowrap">
							₹{" "}
							{parseFloat(
								String(
									data.reduce(
										(accumulator, d) =>
											accumulator + Number(calculateDailyPrice(d.isGoingToBePermanent ? d.tillDate : new Date().getTime(), d.startDate, d.price)),
										0,
									),
								),
							).toFixed(2)}{" "}
							/-
						</span>
					</div>
				</div>
			) : (
				<h1 className="text-xl font-bold">No Data to show, Please add some.</h1>
			)}{" "}
		</div>
	);
};
