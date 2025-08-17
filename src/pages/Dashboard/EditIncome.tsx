import DashboardLayout from "@components/DashboardLayout";
import IncomeForm from "@components/Incomes/IncomeForm";
import { useParams } from "react-router-dom";
import { useTransactionStore } from "../../../store/useTransactionStore";
const EditIncome = () => {
  const { id } = useParams();

  const getIncome = useTransactionStore((state) => state.getIncome);

  const income = getIncome(id || ""); // Will return undefined if not found

  if (!income) return <p>Loading income...</p>;
  return (
    <DashboardLayout>
      <div className="p-20">
        <IncomeForm income={income} />
      </div>
    </DashboardLayout>
  );
};

export default EditIncome;
