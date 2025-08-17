import DashboardLayout from "@components/DashboardLayout";
import AddExpenseForm from "@components/Expense/AddExpenseForm";

const AddExpense = () => {
  return (
    <DashboardLayout>
      <div className="p-20">
        <AddExpenseForm />
      </div>
    </DashboardLayout>
  );
};

export default AddExpense;
