import DashboardLayout from "@components/DashboardLayout";
import ExpensesAnalytics from "@components/ExpensesAnalytics";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { useExpense } from "@hooks/useExpense";
import { useIncome } from "@hooks/useIncome";
import { useQuery } from "@tanstack/react-query";
import {
  dateToString,
  getTransactionColor,
  getTransactionIcon,
} from "@utils/helpers";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import { FaHandHoldingUsd, FaMoneyBillWave, FaWallet } from "react-icons/fa";
import { Cell, Pie, PieChart } from "recharts";
import { useTransactionStore } from "../../../store/useTransactionStore";
import type { ExpenseResponse } from "@utils/types";
import { useNavigate } from "react-router-dom";
import { EmptyState } from "@components/EmptyState";

const data = [
  { name: "Total Balance", value: 79100, color: "#7E3AF2" },
  { name: "Total Expenses", value: 7100, color: "#EF4444" },
  { name: "Total Income", value: 86200, color: "#F97316" },
];

export default function Home() {
  const {
    totalIncome,
    setExpenses,
    setIncome,
    totalExpenses,
    totalBalance,
    income,
    expenses,
  } = useTransactionStore();
  console.log("income", income);
  const { fetchIncomes } = useIncome();
  const { getExpenses } = useExpense();
  const navigate = useNavigate();
  const {
    data: expensesData,
    isLoading: expensesLoading, // Fix: Add variable name
    isError: expensesError, // Fix: Add variable name for clarity
  } = useQuery({
    queryKey: ["expense"],
    queryFn: () => getExpenses(),
    staleTime: 5 * 60 * 1000, // Consider data stale immediately
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const {
    data: incomeData,
    isLoading: incomeLoading, // Fix: Add variable name to avoid conflict
    isError: incomeError, // Fix: Add variable name for clarity
  } = useQuery({
    queryKey: ["income"],
    queryFn: fetchIncomes,
    staleTime: 5 * 60 * 1000, // Don't refetch for 5 minutes
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  //recent transactions
  const recentTransactions = useMemo(() => {
    let transactions = [...income, ...expenses];
    let sortedTransactions = [...transactions].sort((a, b) =>
      dayjs(b.date).diff(a.date)
    );

    return sortedTransactions;
  }, [income, expenses]);

  const financialCalculations = useMemo((): {
    _totalBalance: number;
    _totalIncome: number;
    _totalExpense: number;
  } => {
    let _totalBalance =
      income?.length &&
      income?.length > 0 &&
      expenses?.length &&
      expenses.length > 0
        ? totalBalance()
        : 0;
    let _totalIncome = income?.length ? totalIncome() : 0;
    let _totalExpense = expenses?.length ? totalExpenses() : 0;

    return { _totalExpense, _totalBalance, _totalIncome };
  }, [income, expenses]);
  // Memoized pie chart data
  const pieChartData = useMemo(
    () => [
      {
        name: "Total Balance",
        value: financialCalculations._totalBalance,
        color: "#7E3AF2",
      },
      {
        name: "Total Expenses",
        value: financialCalculations._totalExpense,
        color: "#EF4444",
      },
      {
        name: "Total Income",
        value: financialCalculations._totalIncome,
        color: "#F97316",
      },
    ],
    [financialCalculations]
  );
  useEffect(() => {
    if (incomeData?.length) {
      setIncome(incomeData); // only runs once when data is fetched
    }
  }, [incomeData, setIncome]);

  useEffect(() => {
    if (expensesData) {
      console.log("expensesData---", expensesData);
      setExpenses(expensesData); // only runs once when data is fetched
    }
  }, [expensesData, setExpenses]);

  // Fix: Combine loading and error states
  if (incomeLoading || expensesLoading) {
    return <LoadingSpinner />;
  }

  if (incomeError || expensesError) {
    return <div>Error loading data</div>;
  }
  console.log("home");
  return (
    <DashboardLayout>
      <div className="space-y-6 h-full">
        {/* Stat Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Balance */}
          <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white rounded-xl shadow-lg p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <FaWallet className="text-white text-3xl" />
            <div>
              <p className="text-sm opacity-80">Total Balance</p>
              <p className="text-sm md:text-base lg:text-xl font-semibold">{`$ ${financialCalculations._totalBalance}`}</p>
            </div>
          </div>

          {/* Total Income */}
          <div className="bg-gradient-to-br from-orange-400 to-orange-600 text-white rounded-xl shadow-lg p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <FaMoneyBillWave className="text-white text-3xl" />
            <div>
              <p className="text-sm opacity-80">Total Income</p>
              <p className="text-sm md:text-base lg:text-lg xl:text-xl font-semibold">{`$ ${financialCalculations._totalIncome}`}</p>
            </div>
          </div>

          {/* Total Expense */}
          <div className="bg-gradient-to-br from-red-400 to-red-600 text-white rounded-xl shadow-lg p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform">
            <FaHandHoldingUsd className="text-white text-3xl" />
            <div>
              <p className="text-sm opacity-80">Total Expense</p>
              <p className="text-sm md:text-base lg:text-lg xl:text-xl font-semibold">{`$ ${financialCalculations._totalExpense}`}</p>
            </div>
          </div>
        </div>

        {/* Content Cards */}
        <div className="h-full">
          <div className="lg:h-[450px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Transactions */}
              <div className=" rounded-xl shadow-lg p-6 h-[450px] flex flex-col border border-gray-200 hover:shadow-xl transition-shadow">
                <div className="flex justify-between items-center mb-4 shrink-0">
                  <h2 className="text-lg font-semibold">Recent Transactions</h2>
                  <button className="text-sm text-gray-600 hover:text-purple-600 transition-colors flex items-center gap-1">
                    See All →
                  </button>
                </div>
                {recentTransactions?.[0] ? (
                  <div className="space-y-4 overflow-y-auto flex-1">
                    {recentTransactions.map((item, idx) => {
                      const IconComponent = getTransactionIcon(item);
                      const iconColor = getTransactionColor(item);
                      return (
                        <div
                          key={idx}
                          className="flex justify-between items-center hover:bg-white hover:shadow-sm rounded-lg p-2 transition-all"
                        >
                          <div className="flex items-center gap-3">
                            {IconComponent && (
                              <IconComponent
                                className="text-lg"
                                style={{ color: iconColor }}
                              />
                            )}
                            <div>
                              <p className="font-medium text-gray-800 capitalize text-base">
                                {item.title}
                              </p>
                              <p className="text-sm text-gray-400">
                                {dateToString(item?.date)}
                              </p>
                            </div>
                          </div>
                          {item.transactionType === "income" ? (
                            <p className="text-green-600 bg-green-100 px-3 py-1 rounded-md font-medium">
                              + ${item.amount}
                            </p>
                          ) : (
                            <p className="text-red-500 bg-red-100 px-3 py-1 rounded-md font-medium">
                              - ${item.amount}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="w-full h-full rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center p-8">
                    <p className="text-gray-600 text-center mb-4 max-w-sm">
                      There's no data available.
                    </p>
                  </div>
                )}
              </div>

              {/* Pie Chart */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg p-6 h-[450px] flex flex-col border border-gray-200 hover:shadow-xl transition-shadow">
                <h2 className="text-lg font-semibold mb-6">
                  Financial Overview
                </h2>

                <div className="flex justify-center">
                  {incomeData?.[0] || expensesData?.[0] ? (
                    <PieChart width={220} height={220}>
                      <Pie
                        data={pieChartData}
                        innerRadius={70}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {data.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  ) : (
                    <EmptyState />
                  )}
                </div>
                <p className="text-center text-xl font-bold mt-2">
                  Total Balance :{`$${financialCalculations._totalBalance}`}
                </p>
                <div className="flex justify-center gap-4 mt-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-600 rounded-full" /> Total
                    Balance
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full" /> Total
                    Expenses
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full" /> Total
                    Income
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:h-[450px]">
            <ExpensesAnalytics />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
