import type { FinancialStatus } from "@utils/types";
import { create } from "zustand";
export const useTransactionStore = create<FinancialStatus>((set, get) => ({
  income: [],
  expenses: [],
  add_Income: (income) =>
    set((state) => ({ income: [...state.income, income] })),

  addExpense: (newExpense) =>
    set((state) => ({ expenses: [...state.expenses, newExpense] })),
  removeIncome: (id) =>
    set((state) => ({
      income: state.income.filter((income) => income.id != id),
    })),
  getIncome: (id) => get().income.find((income) => income.id === id) || null,
  getExpense: (id) =>
    get().expenses.find((expense) => expense.id === id) || null,
  removeExpense: (id) =>
    set((state) => ({
      expenses: state.expenses.filter((expense) => expense.id != id),
    })),
  setIncome: (income) =>
    set({
      income: income.map((_income) => ({
        ..._income,
        transactionType: "income",
      })),
    }),
  setExpenses: (expense) =>
    set({
      expenses: expense.map((_expense) => ({
        ..._expense,
        transactionType: "expense",
      })),
    }),
  totalIncome: () =>
    get().income.reduce(
      (accumulator, currentValue) => currentValue.amount + accumulator,
      0
    ),
  totalExpenses: () =>
    get().expenses.reduce(
      (accumulator, currentValue) => currentValue?.amount + accumulator,
      0
    ),

  totalBalance: () => {
    let totalIncome = get().totalIncome();
    let totalExpense = get().totalExpenses();
    return +totalIncome - +totalExpense;
  },
  checkAuthStatus: () => {
    try {
      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      if (parsedUser) {
        return true;
      }
      return false;
    } catch (err) {
      console.error("Failed to parse user from localStorage", err);
      return false;
    }
  },
}));
