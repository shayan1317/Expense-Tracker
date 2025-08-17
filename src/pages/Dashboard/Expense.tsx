import DashboardLayout from "@components/DashboardLayout";
import ExpenseLIneChart from "@components/Expense/ExpenseLIneChart";
import ExpenseList from "@components/Expense/ExpensesList";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { useExpense } from "@hooks/useExpense";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTransactionStore } from "../../../store/useTransactionStore";

const Expense = () => {
  const { setExpenses } = useTransactionStore();
  const { getExpenses } = useExpense();
  let period = "all";
  const {
    data: expenses,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["expense", period],
    queryFn: () => getExpenses(period),
    staleTime: 0, // Consider data stale immediately
  });
  useEffect(() => {
    if (expenses?.length) {
      console.log("expenses===>", expenses);
      setExpenses(expenses); // only runs once when data is fetched
    }
  }, [expenses, setExpenses]);
  // const memoizedIncome = useMemo(() => data || [], [data]);
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <div>error</div>;
  }

  console.log("home");
  return (
    <DashboardLayout>
      <div className="w-full">
        <div className="bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Income Overview Chart */}
            <ExpenseLIneChart />

            {/* Income Sources List */}
            <ExpenseList />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Expense;
