// src/data/defaultCategories.ts

import { TransactionTypeVO } from "../domain/value-objects/TransactionType";
import { Category } from "../domain/entities/Category";

export const defaultCategories: Category[] = [
  {
    id: "cat-income-salary",
    name: "Salary",
    icon: "Briefcase",
    type: TransactionTypeVO.Income,
    color: "bg-emerald-200",
    createdAt: Date.now(),
  },
  {
    id: "cat-income-freelance",
    name: "Freelance",
    icon: "Wallet",
    type: TransactionTypeVO.Income,
    color: "bg-teal-200",
    createdAt: Date.now(),
  },
  {
    id: "cat-income-investments",
    name: "Investments",
    icon: "DollarSign",
    type: TransactionTypeVO.Income,
    color: "bg-cyan-200",
    createdAt: Date.now(),
  },
  {
    id: "cat-income-gifts",
    name: "Gifts",
    icon: "HandCoins",
    type: TransactionTypeVO.Income,
    color: "bg-sky-200",
    createdAt: Date.now(),
  },

  // Expense - Soft Warm Tones
  {
    id: "cat-expense-food",
    name: "Food & Dining",
    icon: "UtensilsCrossed",
    type: TransactionTypeVO.Expense,
    color: "bg-orange-200",
    createdAt: Date.now(),
  },
  {
    id: "cat-expense-transport",
    name: "Transport",
    icon: "Bus",
    type: TransactionTypeVO.Expense,
    color: "bg-indigo-200",
    createdAt: Date.now(),
  },
  {
    id: "cat-expense-shopping",
    name: "Shopping",
    icon: "ShoppingBag",
    type: TransactionTypeVO.Expense,
    color: "bg-rose-200",
    createdAt: Date.now(),
  },
  {
    id: "cat-expense-bills",
    name: "Bills & Utilities",
    icon: "Receipt",
    type: TransactionTypeVO.Expense,
    color: "bg-purple-200",
    createdAt: Date.now(),
  },
  {
    id: "cat-expense-entertainment",
    name: "Entertainment",
    icon: "Gamepad2",
    type: TransactionTypeVO.Expense,
    color: "bg-violet-200",
    createdAt: Date.now(),
  },

  // Debt - Soft Muted Tones
  {
    id: "cat-debt-credit",
    name: "Credit Card",
    icon: "CreditCard",
    type: TransactionTypeVO.Debt,
    color: "bg-amber-200",
    createdAt: Date.now(),
  },
  {
    id: "cat-debt-loan",
    name: "Personal Loan",
    icon: "PiggyBank",
    type: TransactionTypeVO.Debt,
    color: "bg-slate-200",
    createdAt: Date.now(),
  },
];
