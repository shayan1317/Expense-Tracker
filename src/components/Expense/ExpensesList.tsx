// ExpenseList.tsx

import dayjs from "dayjs";
import { Download } from "lucide-react";
import { useMemo } from "react";
import { useTransactionStore } from "../../../store/useTransactionStore";
import ExpensesListItem from "./ExpensesListItem";
import { dateToString } from "@utils/helpers";

export default function ExpenseList() {
  const expenses = useTransactionStore((state) => state?.expenses);
  console.log("expenses", expenses);
  let sortedExpenses = useMemo(() => {
    if (!expenses || !Array.isArray(expenses)) return [];
    return expenses
      .filter((expense) => expense && expense?.amount > 0 && expense?.date)
      .sort((a, b) => dayjs(b.date).diff(a?.date))
      .map((expense) => ({
        ...expense,
        date: dateToString(expense.date) || "",
      }));
  }, [expenses]);
  console.log("sortedExpenses", sortedExpenses);
  return (
    <div className="bg-white mt-6 p-6 rounded-2xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">All Expenses</h2>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg px-3 py-2 text-sm flex items-center gap-2">
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      <div className="space-y-4">
        {sortedExpenses?.[0] ? (
          <div>
            {sortedExpenses?.map((expense) => {
              return <ExpensesListItem expense={expense} />;
            })}
          </div>
        ) : (
          <div className="w-full h-full  rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8">
            <p className="text-gray-600 text-center mb-4 max-w-sm">
              There's no data available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
