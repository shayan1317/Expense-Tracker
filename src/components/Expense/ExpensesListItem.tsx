import { useIncome } from "@hooks/useIncome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTransactionColor, getTransactionIcon } from "@utils/helpers";
import type { ExpenseResponse } from "@utils/types";
import { useCallback } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTransactionStore } from "../../../store/useTransactionStore";
import { useExpense } from "@hooks/useExpense";

const ExpensesListItem = ({ expense }: { expense: ExpenseResponse }) => {
  const IconComponent = getTransactionIcon(expense);
  const iconColor = getTransactionColor(expense);

  const navigate = useNavigate();
  //for deleting income
  const { DeleteExpense } = useExpense();
  const removeExpense = useTransactionStore((state) => state.removeExpense);
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: DeleteExpense,
    onSuccess: () => {
      removeExpense(expense?.id);
      queryClient?.invalidateQueries();
      toast.success("Expense delete successfully");
    },
  });

  const handleEdit = useCallback(() => {
    navigate(`/expense/update/${expense?.id}`);
  }, [expense]);

  const handleDelete = useCallback(() => {
    try {
      deleteMutation.mutate(expense?.id);
    } catch (err) {
      console.log(err);
    }
  }, [expense]);

  console.log("first", expense);
  return (
    <div
      key={`${expense?.id}`}
      className="flex justify-between items-center px-4 py-3 rounded-xl"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3`}>
          {IconComponent && (
            <IconComponent className="text-lg" style={{ color: iconColor }} />
          )}
        </div>
        {/* <div className="text-2xl">{expense.icon}</div> */}
        <div>
          <h3 className="font-semibold capitalize text-base md:text-.5lg lg:text-.5xl">
            {expense.title}
          </h3>
          <p className="text-sm text-gray-500 lg:text-.5lg">{expense.date}</p>
        </div>
      </div>
      <div className="flex items-center">
        <div className="text-red-600 font-semibold mr-4 text-base md:text-.5lg lg:text-.5xl">
          - ${expense.amount}
        </div>
        <div className="mr-4 flex items-center gap-2">
          <MdEdit onClick={handleEdit} />
          <MdDelete onClick={handleDelete} color="red" />
        </div>
      </div>
    </div>
  );
};

export default ExpensesListItem;
