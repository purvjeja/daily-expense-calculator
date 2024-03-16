import { ExpenseCalculator } from "@/components/expenseCalculator";
import { IAPIStructure } from "@/interface/main.interface";
import { getData } from "@/util/callPostData";

export default async function Home() {
	const APIdata: IAPIStructure = await getData();

	return <ExpenseCalculator APIdata={APIdata} />;
}
