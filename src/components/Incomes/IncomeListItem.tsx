import { useIncome } from "@hooks/useIncome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getTransactionColor, getTransactionIcon } from "@utils/helpers";
import type { IncomeResponse, WithStringDate } from "@utils/types";
import { TrendingUp } from "lucide-react";
import { useCallback } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTransactionStore } from "../../../store/useTransactionStore";
const IncomeListItem = ({
  id,
  income,
}: {
  id: string;
  income: WithStringDate<IncomeResponse>;
}) => {
  const { DeleteIncome } = useIncome();
  const removeIncome = useTransactionStore((state) => state.removeIncome);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const IconComponent = getTransactionIcon(income);
  const iconColor = getTransactionColor(income);

  //delete mutation
  const deleteMutation = useMutation({
    mutationFn: DeleteIncome,
    onSuccess: () => {
      removeIncome(id);
      queryClient?.invalidateQueries();
      toast.success("Income delete successfully");
    },
  });

  const handleEdit = useCallback(() => {
    navigate(`/income/update/${id}`);
  }, [income]);
  const handleDelete = useCallback(() => {
    deleteMutation.mutate(id);
  }, [income]);
  return (
    <div
      key={id}
      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-xl transition-colors cursor-pointer group"
    >
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className={`p-3 rounded-xl`}>
          {IconComponent && (
            <IconComponent className="text-lg" style={{ color: iconColor }} />
          )}
        </div>

        {/* Info */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-1 capitalize text-base md:text-.5lg lg:text-.5xl">
            {income.title}
          </h3>
          <p className="text-sm text-gray-500 lg:text-.5lg">{income.date}</p>
        </div>
      </div>

      {/* Amount and trend */}
      <div className="flex items-center gap-3">
        <div className="mr-4 flex items-center">
          <div className="text-right">
            <div className="font-semibold text-green-600 text-base md:text-.5lg lg:text-.5xl">
              + ${income.amount.toLocaleString()}
            </div>
          </div>
          <TrendingUp className="w-4 h-4 text-green-500" />
        </div>

        <div className="mr-4 flex items-center gap-2">
          <MdEdit onClick={handleEdit} />
          <MdDelete onClick={handleDelete} color="red" />
        </div>
      </div>
    </div>
  );
};

export default IncomeListItem;
