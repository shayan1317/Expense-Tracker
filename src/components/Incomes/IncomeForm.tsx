import IconsPicker from "@components/IconsPicker";
import { yupResolver } from "@hookform/resolvers/yup";
import { useIncome } from "@hooks/useIncome";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { IncomeIValues, IncomeResponse } from "@utils/types";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as yup from "yup";
import { parseExpense } from "../../../services/openAi";
// ⚠ For testing only — store securely in production
const schema = yup.object().shape({
  amount: yup
    .number()
    .typeError("Amount must be a number")
    .positive("Amount must be greater than zero")
    .required("Amount is required"),
  date: yup.date().required("Date is required"),
  notes: yup.string().optional(),
  title: yup.string().required("Income Source is required"),
  incomeSourceIconLabel: yup
    .string()
    .required("Income Source Icon is required"),
});

const IncomeForm = ({ income }: { income?: IncomeResponse }) => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [aiPrompt, setAiPrompt] = useState("");
  const [parsing, setParsing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useForm<IncomeIValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      amount: 0,
      date: new Date().toISOString().split("T")[0],
      notes: "",
      title: "",
      incomeSourceIconLabel: "",
    },
  });

  const { addIncome, loading, updateIncome } = useIncome();
  const mutation = useMutation({
    mutationFn: addIncome,
    onSuccess: () => {
      toast.success("Income added successfully");
      queryClient.invalidateQueries();
      navigate("/income");
    },
  });
  const updateMutation = useMutation({
    mutationFn: updateIncome,
    onSuccess: () => {
      toast.success("Income updated successfully");
      queryClient.invalidateQueries();
      navigate("/income");
    },
  });

  const onSubmit = (data: IncomeIValues) => {
    if (income) {
      updateMutation.mutate({ id: income?.id, data });
      reset();
    } else {
      mutation.mutate(data);
      reset();
    }
  };

  useEffect(() => {
    if (income) {
      const { createdAt, updatedAt, id, ...rest } = income;
      reset({
        ...rest,
        date: income?.date
          ? new Date(income.date).toISOString().split("T")[0]
          : "",
        incomeSourceIconLabel: income.incomeSourceIconLabel,
      });
    }
  }, [income]);

  const handleParsePrompt = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a description first");
      return;
    }
    try {
      const parsed = await parseExpense(prompt);
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="lg:w-[70%] bg-white lg:mx-20 rounded-lg shadow-md space-y-4 p-6"
    >
      {/* AI Prompt Input */}
      <div>
        <label className="block mb-1 font-medium">Quick Add (AI Prompt)</label>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder='e.g. "Yesterday I got salary of 50000"'
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
          />
          <button
            type="button"
            onClick={handleParsePrompt}
            disabled={parsing}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            {parsing ? "Parsing..." : "Parse with AI"}
          </button>
        </div>
      </div>

      <Controller
        name="incomeSourceIconLabel"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block mb-1 font-medium">
              Select Income Source
            </label>
            <IconsPicker
              onIconSelect={field.onChange}
              selectedIcon={field.value}
              type="income"
            />
            {errors.incomeSourceIconLabel && (
              <p className="text-red-500 text-sm">
                {errors.incomeSourceIconLabel.message}
              </p>
            )}
          </div>
        )}
      />

      <h2 className="text-xl font-semibold mb-4">Add Income</h2>

      {/* Title */}
      <Controller
        name="title"
        control={control}
        render={({ field }) => (
          <div>
            <label className="block mb-1 font-medium">Income Source</label>
            <input
              type="text"
              {...field}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
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
              type="number"
              {...field}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
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
              type="date"
              {...field}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
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
            <label className="block mb-1 font-medium">Note (optional)</label>
            <textarea
              {...field}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400"
            />
          </div>
        )}
      />

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
      >
        {loading ? "loading" : "Add Income"}
      </button>
    </form>
  );
};

export default IncomeForm;
