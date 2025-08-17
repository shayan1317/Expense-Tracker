import DashboardLayout from "@components/DashboardLayout";
import IncomeForm from "@components/Incomes/IncomeForm";

const AddIncome = () => {
  return (
    <DashboardLayout>
      <div className="p-20">
        <IncomeForm />
      </div>
    </DashboardLayout>
  );
};

export default AddIncome;
