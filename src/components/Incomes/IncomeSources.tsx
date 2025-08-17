import { Download } from "lucide-react";
import IncomeListItem from "./IncomeListItem";
import dayjs from "dayjs";
import { dateToString } from "@utils/helpers";
import { useMemo } from "react";
import React from "react";
import { useTransactionStore } from "../../../store/useTransactionStore";

const IncomeSources = () => {
  const incomes = useTransactionStore((state) => state.income);
  let sortedIncomes = useMemo(() => {
    if (!incomes && !Array.isArray(incomes)) return;
    return incomes
      .filter((income) => income && income.amount > 0 && income.date)
      .sort((a, b) => dayjs(b.createdAt).diff(a.createdAt))
      .map((income) => ({ ...income, date: dateToString(income.date) || "" }));
  }, [incomes]);

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Income Sources</h2>
        <button className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
          <Download className="w-4 h-4" />
          Download
        </button>
      </div>

      {/* Income List */}
      <div className="space-y-4">
        {sortedIncomes?.[0] ? (
          <div>
            {sortedIncomes?.map((income) => {
              return (
                <IncomeListItem
                  key={income?.id}
                  id={income?.id}
                  income={income}
                />
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
    </div>
  );
};
export default React.memo(IncomeSources);
