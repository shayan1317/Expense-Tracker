import {
  FaShoppingCart,
  FaCar,
  FaHome,
  FaUtensils,
  FaGamepad,
  FaPlane,
  FaBook,
  FaMedkit,
  FaTshirt,
  FaGasPump,
  FaWallet,
  FaBriefcase,
  FaGift,
  FaPiggyBank,
  FaChartLine,
  FaUniversity,
  FaHandHoldingUsd,
  FaCreditCard,
  FaCoins,
  FaDollarSign,
} from "react-icons/fa";
import type { TransactionIconType } from "./types";

// export const EXPENSE_ICONS = [
//   { icon: FaShoppingCart, name: "Shopping", color: "#EF4444" },
//   { icon: FaCar, name: "Transport", color: "#3B82F6" },
//   { icon: FaHome, name: "Rent", color: "#8B5CF6" },
//   { icon: FaUtensils, name: "Food", color: "#F59E0B" },
//   { icon: FaGamepad, name: "Entertainment", color: "#EF4444" },
//   { icon: FaPlane, name: "Travel", color: "#06B6D4" },
//   { icon: FaBook, name: "Education", color: "#10B981" },
//   { icon: FaMedkit, name: "Healthcare", color: "#EF4444" },
//   { icon: FaTshirt, name: "Clothing", color: "#8B5CF6" },
//   { icon: FaGasPump, name: "Fuel", color: "#F59E0B" },
// ];

// export const INCOME_ICONS = [
//   { icon: FaWallet, name: "Salary", color: "#10B981" },
//   { icon: FaBriefcase, name: "Business", color: "#3B82F6" },
//   { icon: FaGift, name: "Gift", color: "#F59E0B" },
//   { icon: FaPiggyBank, name: "Savings", color: "#8B5CF6" },
//   { icon: FaChartLine, name: "Investment", color: "#06B6D4" },
//   { icon: FaUniversity, name: "Bank", color: "#10B981" },
//   { icon: FaHandHoldingUsd, name: "Bonus", color: "#F59E0B" },
//   { icon: FaCreditCard, name: "Refund", color: "#3B82F6" },
//   { icon: FaCoins, name: "Interest", color: "#8B5CF6" },
//   { icon: FaDollarSign, name: "Other", color: "#6B7280" },
// ];

export const EXPENSE_ICONS: Record<string, TransactionIconType> = {
  shopping: { icon: FaShoppingCart, name: "Shopping", color: "#EF4444" },
  transport: { icon: FaCar, name: "Transport", color: "#3B82F6" },
  rent: { icon: FaHome, name: "Rent", color: "#8B5CF6" },
  food: { icon: FaUtensils, name: "Food", color: "#F59E0B" },
  entertainment: { icon: FaGamepad, name: "Entertainment", color: "#EF4444" },
  travel: { icon: FaPlane, name: "Travel", color: "#06B6D4" },
  education: { icon: FaBook, name: "Education", color: "#10B981" },
  healthcare: { icon: FaMedkit, name: "Healthcare", color: "#EF4444" },
  clothing: { icon: FaTshirt, name: "Clothing", color: "#8B5CF6" },
  fuel: { icon: FaGasPump, name: "Fuel", color: "#F59E0B" },
};

// Plain object for income icons
export const INCOME_ICONS: Record<string, TransactionIconType> = {
  salary: { icon: FaWallet, name: "Salary", color: "#10B981" },
  business: { icon: FaBriefcase, name: "Business", color: "#3B82F6" },
  gift: { icon: FaGift, name: "Gift", color: "#F59E0B" },
  savings: { icon: FaPiggyBank, name: "Savings", color: "#8B5CF6" },
  investment: { icon: FaChartLine, name: "Investment", color: "#06B6D4" },
  bank: { icon: FaUniversity, name: "Bank", color: "#10B981" },
  bonus: { icon: FaHandHoldingUsd, name: "Bonus", color: "#F59E0B" },
  refund: { icon: FaCreditCard, name: "Refund", color: "#3B82F6" },
  interest: { icon: FaCoins, name: "Interest", color: "#8B5CF6" },
  other: { icon: FaDollarSign, name: "Other", color: "#6B7280" },
};

export const days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function makeKey(dateString) {
  const date = new Date(dateString);

  // Ensure valid date
  if (isNaN(date)) {
    throw new Error("Invalid date string");
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Month is zero-based
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
