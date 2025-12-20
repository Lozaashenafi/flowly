// src/data/defaultCategories.ts

import { TransactionTypeVO } from "../domain/value-objects/TransactionType";
import { Category } from "../domain/entities/Category";

export const defaultCategories: Category[] = [
  // Income
  {
    id: "cat-income-salary",
    name: "Salary",
    icon: "Briefcase",
    type: TransactionTypeVO.Income,
    color: "bg-emerald-500",
    createdAt: Date.now(),
  },
  {
    id: "cat-income-freelance",
    name: "Freelance",
    icon: "Wallet",
    type: TransactionTypeVO.Income,
    color: "bg-teal-500",
    createdAt: Date.now(),
  },
  {
    id: "cat-income-investments",
    name: "Investments",
    icon: "DollarSign",
    type: TransactionTypeVO.Income,
    color: "bg-cyan-500",
    createdAt: Date.now(),
  },
  {
    id: "cat-income-gifts",
    name: "Gifts",
    icon: "HandCoins",
    type: TransactionTypeVO.Income,
    color: "bg-blue-500",
    createdAt: Date.now(),
  },

  // Expense
  {
    id: "cat-expense-food",
    name: "Food & Dining",
    icon: "UtensilsCrossed",
    type: TransactionTypeVO.Expense,
    color: "bg-orange-500",
    createdAt: Date.now(),
  },
  {
    id: "cat-expense-transport",
    name: "Transport",
    icon: "Bus",
    type: TransactionTypeVO.Expense,
    color: "bg-indigo-500",
    createdAt: Date.now(),
  },
  {
    id: "cat-expense-shopping",
    name: "Shopping",
    icon: "ShoppingBag",
    type: TransactionTypeVO.Expense,
    color: "bg-pink-500",
    createdAt: Date.now(),
  },
  {
    id: "cat-expense-bills",
    name: "Bills & Utilities",
    icon: "Receipt",
    type: TransactionTypeVO.Expense,
    color: "bg-purple-500",
    createdAt: Date.now(),
  },
  {
    id: "cat-expense-entertainment",
    name: "Entertainment",
    icon: "Gamepad2",
    type: TransactionTypeVO.Expense,
    color: "bg-fuchsia-500",
    createdAt: Date.now(),
  },

  // Debt
  {
    id: "cat-debt-credit",
    name: "Credit Card",
    icon: "CreditCard",
    type: TransactionTypeVO.Debt,
    color: "bg-red-500",
    createdAt: Date.now(),
  },
  {
    id: "cat-debt-loan",
    name: "Loan Repayment",
    icon: "PiggyBank",
    type: TransactionTypeVO.Debt,
    color: "bg-rose-500",
    createdAt: Date.now(),
  },
];
