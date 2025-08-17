// ExpenseChart.tsx
import { dateToString } from "@utils/helpers";
import dayjs from "dayjs";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTransactionStore } from "../../../store/useTransactionStore";
import { EmptyState } from "@components/EmptyState";

export default function ExpenseLIneChart() {
  const { expenses } = useTransactionStore();
  const navigate = useNavigate();
  console.log("expenses", expenses);
  let sortedExpenses = useMemo(() => {
    if (!expenses && !Array.isArray(expenses)) return;
    return expenses
      .filter((expenses) => expenses && expenses.amount > 0 && expenses.date)
      .sort((a, b) => dayjs(a.date).diff(b.date))
      .map((expenses) => ({ ...expenses, date: dateToString(expenses.date) }));
  }, [expenses]);
  const gotoPage = () => {
    navigate("/expense/add");
  };

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Expense Overview
          </h2>
          <p className="text-sm text-gray-500">
            Track your spending trends over time and gain insights into where
            your money goes.
          </p>
        </div>
        <button
          onClick={gotoPage}
          className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-200 transition flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Expense
        </button>
      </div>

      {sortedExpenses?.[0] ? (
        <div className="relative">
          {/* Y-axis labels */}
          {/* <div className="absolute left-0 top-0 h-80 flex flex-col justify-between text-sm text-gray-500 -ml-2">
                {verticalScale.map((value) => (
                  <span>{value}</span>
                ))}
              </div>
      
              {/* Chart container */}
          <div className="p-4 bg-white rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">Expense Overview</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={sortedExpenses}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                  fillOpacity={1}
                  fill="#ede9fe"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
