import DashboardLayout from "@components/DashboardLayout";
import AddExpenseForm from "@components/Expense/AddExpenseForm";
import { useParams } from "react-router-dom";
import { useTransactionStore } from "../../../store/useTransactionStore";
import { Loader } from "lucide-react";

const EditExpense = () => {
  const { id } = useParams();

  const getIncome = useTransactionStore((state) => state.getExpense);

  const expense = getIncome(id || ""); // Will return undefined if not found
  if (!expense) return <Loader />;
  return (
    <DashboardLayout>
      <div className="p-20">
        <AddExpenseForm expense={expense} />
      </div>
    </DashboardLayout>
  );
};

export default EditExpense;
