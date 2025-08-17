import { FaArrowTrendDown } from "react-icons/fa6";
import { FiArrowRight } from "react-icons/fi";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTransactionStore } from "../../store/useTransactionStore";

import { useExpense } from "@hooks/useExpense";
import { useQuery } from "@tanstack/react-query";
import {
  dateToString,
  getTransactionColor,
  getTransactionIcon,
} from "@utils/helpers";
import { LoadingSpinner } from "./LoadingSpinner";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "./EmptyState";

export default function ExpensesAnalytics() {
  const { expenses } = useTransactionStore();
  const { getExpenses } = useExpense();
  const navigate = useNavigate();
  let period = "weekly";
  const {
    data: expensesData,
    isLoading: expensesLoading, // Fix: Add variable name
    isError: expensesError, // Fix: Add variable name for clarity
  } = useQuery({
    queryKey: ["expense", period],
    queryFn: () => getExpenses(period),
    staleTime: 5 * 60 * 1000, // Consider data stale immediately
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const resultExpenseData = useMemo(() => {
    if (expensesData && expensesData?.length < 0) return [];

    return expensesData?.map((expense, index) => {
      return { ...expense, label: `week${index + 1}` };
    });
  }, [expensesData]);

  if (expensesLoading) {
    return <LoadingSpinner />;
  }

  if (expensesError) {
    return <div>Error loading data</div>;
  }

  // const expensesByWeek = useMemo(() => {
  //   console.log("called");
  //   let sorted =
  //     [...(expensesData || [])]?.sort((a, b) =>
  //       dayjs(a.createdAt).diff(b.createdAt)
  //     ) || [];
  //   console.log("sorted", sorted);

  //   let weeks = {};

  //   sorted?.forEach((element, index) => {
  //     let endofweek = endOfWeek(new Date(element.createdAt), {
  //       weekStartsOn: 1,
  //     });

  //     let key = makeKey(endofweek);
  //     console.log("endofweek", endofweek, element?.createdAt, key);
  //     weeks[key] = {
  //       amount: (weeks[key]?.amount ? weeks[key]?.amount : 0) + element?.amount,
  //     };
  //   });

  //   let weeksData = Object.values(weeks)?.map((expense, index) => ({
  //     name: `week${index}`,
  //     amount: expense.amount,
  //   }));

  //   return weeksData;
  // }, [expensesData]);
  console.log("expensesData====>", resultExpenseData);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
      {/* Left Box: Expenses List */}
      <div className="bg-white rounded-xl shadow p-6 h-[450px] flex flex-col">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h2 className="text-lg font-semibold">Expenses</h2>
          <button
            className="text-sm text-gray-500 flex items-center gap-1 cursor-pointer"
            onClick={() => navigate("/expenses")}
          >
            See All →
          </button>
        </div>
        {expenses?.[0] ? (
          <div className="space-y-3 overflow-y-auto flex-1">
            {expenses.map((item, i) => {
              const IconComponent = getTransactionIcon(item);
              const iconColor = getTransactionColor(item);
              return (
                <div
                  key={i}
                  className="flex items-center justify-between  px-4 py-3 rounded-lg transition"
                >
                  <div className="flex items-center gap-3">
                    {IconComponent && (
                      <IconComponent
                        className="text-lg"
                        style={{ color: iconColor }}
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-800 capitalize text-base md:text-.5lg lg:text-.5xl">
                        {item.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {dateToString(item.date)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-red-500 font-semibold text-base md:text-.5lg lg:text-.5xl">
                    - ${item.amount}
                    <FaArrowTrendDown className="ml-1 text-sm" />
                  </div>
                </div>
              );
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

      {/* Right Box: Last 30 Days Expenses Chart */}
      <div className="bg-white rounded-xl shadow p-6 h-[450px] flex flex-col">
        <h2 className="text-lg font-semibold mb-4">Last 30 Days Expenses</h2>
        <div className="flex-1 min-h-0">
          {expensesData?.[0] ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={resultExpenseData}>
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="total_amount"
                  fill="url(#colorUv)"
                  radius={[10, 10, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
}
