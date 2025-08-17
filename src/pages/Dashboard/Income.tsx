import DashboardLayout from "@components/DashboardLayout";
import IncomeBarChart from "@components/Incomes/IncomeBarChart";
import IncomeSources from "@components/Incomes/IncomeSources";
import { LoadingSpinner } from "@components/LoadingSpinner";
import { useIncome } from "@hooks/useIncome";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useTransactionStore } from "../../../store/useTransactionStore";

const Income = () => {
  const { setIncome } = useTransactionStore();
  const { fetchIncomes } = useIncome();
  const {
    data: income,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["income"],
    queryFn: fetchIncomes,
    staleTime: 5 * 60 * 1000, // Don't refetch for 5 minutes
    retry: 3, // Retry failed requests 3 times
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
  console.log("income====>", income);
  useEffect(() => {
    if (income?.length) {
      setIncome(income); // only runs once when data is fetched
    }
  }, [income, setIncome]);
  // const memoizedIncome = useMemo(() => data || [], [data]);
  if (isLoading) {
    return <LoadingSpinner />;
  }
  if (isError) {
    return <div>error</div>;
  }
  return (
    <DashboardLayout>
      <div className="w-full">
        <div className="bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Income Overview Chart */}
            <IncomeBarChart />

            {/* Income Sources List */}
            <IncomeSources />
          </div>
        </div>
        {/* <IncomeForm /> */}
      </div>
    </DashboardLayout>
  );
};

export default Income;
