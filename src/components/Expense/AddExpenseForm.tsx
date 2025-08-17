import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import * as yup from "yup";
import { useExpense } from "@hooks/useExpense";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ExpenseIValues, ExpenseResponse } from "@utils/types";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTransactionStore } from "../../../store/useTransactionStore";
import IconsPicker from "@components/IconsPicker";
import { useState, useEffect } from "react";
import { parseExpense } from "../../../services/openAi";

const schema = yup.object().shape({
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive()
    .required(),
  date: yup.date().required(),
  notes: yup.string().optional(),
  title: yup.string().required(),
  expenseIconLabel: yup.string().required(),
});

const AddExpenseForm = ({ expense }: { expense?: ExpenseResponse }) => {
  const { totalExpenses, totalIncome } = useTransactionStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [prompt, setPrompt] = useState("");
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<ExpenseIValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      title: "",
      notes: "",
      expenseIconLabel: "",
    },
  });

  const { addExpense, updateExpense } = useExpense();
  const mutation = useMutation({
    mutationFn: addExpense,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      toast.success("Expense added successfully");
      navigate("/expenses");
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateExpense,
    onSuccess: () => {
      toast.success("Expense updated successfully");
      queryClient.invalidateQueries();
      navigate("/expenses");
    },
  });

  const onSubmit = (data: ExpenseIValues) => {
    const _totalExpenses = totalExpenses();
    const _totalIncome = totalIncome();
    if (_totalExpenses + data.amount > _totalIncome) {
      toast.error("Insufficient income");
      return;
    }
    if (expense) {
      updateMutation.mutate({ id: expense.id, data });
    } else {
      mutation.mutate(data);
    }
    reset();
};

  const handleParsePrompt = async () => {
    // if (!prompt.trim()) {
    //   toast.error("Please enter a description first");
    //   return;
    // }
    try {
      const parsed = await parseExpense("i bought eggs for 300");
      if (parsed) {
        setValue("title", parsed.title || "");
        setValue("amount", parsed.amount || 0);
        setValue("date", parsed.date || new Date().toISOString().split("T")[0]);
        setValue("notes", parsed.notes || "");
        setValue("expenseIconLabel", parsed.expenseIconLabel || "");
        toast.success("Fields filled from AI prompt");
      }
    } catch (error) {
      toast.error("Failed to parse expense");
    }
  };

  useEffect(() => {
    if (expense) {
      const { createdAt, updatedAt, id, ...rest } = expense;
      reset({
        ...rest,
        date: expense.date
          ? new Date(expense.date).toISOString().split("T")[0]
          : "",
      });
    }
  }, [expense, reset]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="lg:w-[70%] bg-white lg:mx-20  rounded-lg shadow-md space-y-4 p-6"
    >
      {/* AI Prompt Input */}
      <div>
        <label className="block mb-1 font-medium">Describe your expense</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder='e.g. "Yesterday I bought a mobile for 200"'
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          />
          <button
            type="button"
            onClick={handleParsePrompt}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Parse with AI
          </button>
        </div>
      </div>

      {/* Expense Icon Picker */}
      <Controller
        name="expenseIconLabel"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block mb-1 font-medium">
              Select Expense Category
            </label>
            <IconsPicker
              onIconSelect={field.onChange}
              selectedIcon={field.value}
              type="expense"
            />
            {errors.expenseIconLabel && (
              <p className="text-red-500 text-sm">
                {errors.expenseIconLabel.message}
              </p>
            )}
          </div>
        )}
      />

      {/* Title */}
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block mb-1 font-medium">Expense Title</label>
            <input
              {...field}
              type="text"
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>
        )}
      />

      {/* Amount */}
      <Controller
        name="amount"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block mb-1 font-medium">Amount (PKR)</label>
            <input
              {...field}
              type="number"
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount.message}</p>
            )}
          </div>
        )}
      />

      {/* Date */}
      <Controller
        name="date"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block mb-1 font-medium">Date</label>
            <input
              {...field}
              type="date"
              className="w-full px-4 py-2 border rounded-lg"
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date.message}</p>
            )}
          </div>
        )}
      />

      {/* Notes */}
      <Controller
        name="notes"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block mb-1 font-medium">Notes (optional)</label>
            <textarea
              {...field}
              className="w-full px-4 py-2 border rounded-lg"
              rows={3}
            />
          </div>
        )}
      />

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Add Expense
      </button>
    </form>
  );
};

export default AddExpenseForm;
