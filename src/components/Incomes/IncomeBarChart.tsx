import type { IncomeResponse } from "@utils/types";

import { dateToString } from "@utils/helpers";
import dayjs from "dayjs";
import { Plus } from "lucide-react";
import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTransactionStore } from "../../../store/useTransactionStore";
import { EmptyState } from "@components/EmptyState";

const IncomeBarChart = () => {
  const navigate = useNavigate();
  const incomes = useTransactionStore((state) => state.income);
  // Sample data for the chart
  let sortedIncomes = useMemo(() => {
    if (!incomes && !Array.isArray(incomes)) return;
    return incomes
      .filter((income) => income && income.amount > 0 && income.date)
      .sort((a, b) => dayjs(a.date).diff(b.date))
      .map((income) => ({ ...income, date: dateToString(income.date) }));
  }, [incomes]);

  console.log("sortedIncomes");
  const gotoPage = () => {
    navigate("/income/add");
  };
  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Income Overview
          </h2>
          <p className="text-gray-500">
            Track your earnings over time and analyze your income trends.
          </p>
        </div>
        <button
          onClick={gotoPage}
          className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" />
          Add Income
        </button>
      </div>

      {/* Chart */}

      {sortedIncomes?.[0] ? (
        <div className="relative">
          {/* Y-axis labels */}
          {/* <div className="absolute left-0 top-0 h-80 flex flex-col justify-between text-sm text-gray-500 -ml-2">
          {verticalScale.map((value) => (
            <span>{value}</span>
          ))}
        </div>

        {/* Chart container */}
          <div className="p-4 bg-white rounded-2xl shadow">
            <h2 className="text-lg font-semibold mb-4">Income Overview</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={sortedIncomes}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="amount" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default React.memo(IncomeBarChart);
