import API from "@utils/axios";
import type {
  IncomeIValues,
  IncomeReturn,
  IncomeResponse,
  DeleteIncomeResponse,
} from "@utils/types";
import { useState } from "react";

export const useIncome = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zustand store functions

  const fetchIncomes = async (): Promise<IncomeResponse[]> => {
    try {
      const res = await API.get("/income/all");
      //   setTasks(res.data); // <-- update store
      console.log("res", res);

      return res.data;
    } catch (err: any) {
      console.error("Failed to fetch incomes:", err);
      setError(err.response?.data?.message || "failed to fetch incomes");
      return err;
    }
  };
  //   const getTaskById = async (id: string) => {
  //     setLoading(true);
  //     setError(null);

  //     try {
  //       const res = await API.get(`/tasks/${id}`);
  //       return res.data;
  //     } catch (err: any) {
  //       console.error("Failed to fetchhh task:", err);
  //       setError(err.response?.data?.error || "Failed to fetch task");
  //       return null;
  //     }
  //   };
  const addIncome = async (
    incomeInput: IncomeIValues
  ): Promise<IncomeResponse> => {
    setLoading(true);
    setError(null);
    try {
      let variables = { title: incomeInput.incomeSource, ...incomeInput };

      const res = await API.post("/income/add", variables);
      setLoading(false);
      //   addTask(res.data); // <-- update store
      return res.data;
    } catch (err: any) {
      console.error("Failed to create task:", err);
      setError(err.response?.data?.message || "failed to create task");
      throw err;
    }
  };

  const updateIncome = async ({
    id,
    data,
  }: {
    id: string;
    data: IncomeIValues;
  }): Promise<IncomeReturn> => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.put(`/income/update/${id}`, data);
      //   updateStoreTask(String(id), res.data); // <-- update store
      setLoading(false);
      return res.data;
    } catch (err: any) {
      console.error("Failed to update income:", err);
      setLoading(false);
      setError(err.response?.data?.message || "failed to update income");
      throw err;
    }
  };

  const DeleteIncome = async (id: string): Promise<DeleteIncomeResponse> => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.delete(`/income/delete/${id}`);
      setLoading(false);
      return res.data;
    } catch (err: any) {
      console.error("Failed to delete income:", err);
      setLoading(false);
      setError(err.response?.data?.message || "failed to delete income");
      throw err;
    }
  };

  //   useEffect(() => {
  //     fetchTasks();
  //   }, []);

  return {
    loading,
    error,
    fetchIncomes,
    addIncome,
    updateIncome,
    DeleteIncome,
  };
};
