import API from "@utils/axios";
import type {
  DeleteExpenseResponse,
  ExpenseIValues,
  ExpenseResponse,
  IncomeResponse,
  ParamsForGetIncomesExpenses,
} from "@utils/types";
import { useState } from "react";

export const useExpense = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const addExpense = async (expenseInput: ExpenseIValues) => {
    try {
      const expenseResponse = await API.post("/expense/add", expenseInput);
      return expenseResponse.data;
    } catch (err) {
      throw err;
    }
  };

  const getExpenses = async (period?: string): Promise<ExpenseResponse[]> => {
    try {
      const expensesResponse = await API.get(`/expense/all`, {
        params: { period },
      });
      return expensesResponse?.data;
    } catch (err) {
      throw err;
    }
  };

  const updateExpense = async ({
    id,
    data,
  }: {
    id: string;
    data: ExpenseIValues;
  }): Promise<ExpenseResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.put(`/expense/update/${id}`, data);
      //   updateStoreTask(String(id), res.data); // <-- update store
      setLoading(false);
      return res.data;
    } catch (err: any) {
      console.error("Failed to update expense:", err);
      setLoading(false);
      setError(err.response?.data?.message || "failed to update expense");
      throw err;
    }
  };
  const DeleteExpense = async (id: string): Promise<DeleteExpenseResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.delete(`/expense/delete/${id}`);
      setLoading(false);
      return res.data;
    } catch (err: any) {
      console.error("Failed to delete expense:", err);
      setLoading(false);
      setError(err.response?.data?.message || "failed to delete expense");
      throw err;
    }
  };
  return {
    addExpense,
    getExpenses,
    updateExpense,
    loading,
    error,
    DeleteExpense,
  };
};
