import type { IconType } from "react-icons/lib";

export type User = {
  id: string;
  name: string;
  email: string;
  image: string;
};

export type ParamsForGetIncomesExpenses = {
  period?: "last30days" | "monthly" | "daily";
  startDate?: Date;
  endDate?: Date;
};
export type IncomeIValues = {
  title: string;
  notes?: string;
  date: string;
  amount: number;
  incomeSourceIconLabel: string;
};
export type IncomeResponse = {
  id: string;
  title: string;
  notes?: string;
  date: Date;
  amount: number;
  createdAt: Date;
  transactionType: string;
  incomeSourceIconLabel: string;
  updatedAt: Date;
};

export type AddIncomeResponse = {
  message: string;
  data: IncomeResponse;
};

export type EditIncomeResponse = {
  message: string;
  data: IncomeResponse;
};
export type DeleteIncomeResponse = {
  message: string;
};

export type FinancialStatus = {
  income: IncomeResponse[];
  expenses: ExpenseResponse[];
  setIncome: (income: IncomeResponse[]) => void;
  setExpenses: (ExpenseIValues: ExpenseResponse[]) => void;
  add_Income: (income: IncomeResponse) => void;
  addExpense: (expense: ExpenseResponse) => void;
  removeIncome: (id: string) => void;
  removeExpense: (id: string) => void;
  totalIncome: () => number;
  totalExpenses: () => number;
  totalBalance: () => number;
  getIncome: (id: string) => IncomeResponse | null;
  getExpense: (id: string) => ExpenseResponse | null;
  // resetFinance: () => void;
};

export type WithStringDate<T extends { date: any }> = Omit<T, "date"> & {
  date: string;
};
export type TransactionIconType = {
  icon: IconType;
  name?: string;
  color: string;
};

//expense flow types
export type ExpenseResponse = {
  id: string;
  title: string;
  notes?: string;
  date: string;
  amount: number;
  expenseIconLabel: string;
  createdAt: Date;
  updatedAt: Date;
};

export type ExpenseIValues = {
  title: string;
  notes?: string;
  date: string;
  amount: number;
  expenseIconLabel: string;
};

export type AddExpenseResponse = {
  message: string;
  data: ExpenseResponse;
};

export type EditExpenseResponse = {
  message: string;
  data: ExpenseResponse;
};
export type DeleteExpenseResponse = {
  message: string;
};

export type ExpenseByWeek = {
  amount: number;
  key: string;
}[];
