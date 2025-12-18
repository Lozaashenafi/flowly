"use client";

import React from "react";
import {
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  LayoutGrid,
  CreditCard,
} from "lucide-react";
import TransactionList from "../components/TransactionList";
import { Transaction } from "../../domain/entities/Transaction";

const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "expense",
    amount: 120,
    category: "Food",
    date: new Date().toISOString(),
    createdAt: Date.now(),
  },
  {
    id: "2",
    type: "income",
    amount: 1500,
    category: "Salary",
    date: new Date().toISOString(),
    createdAt: Date.now(),
  },
  {
    id: "3",
    type: "expense",
    amount: 60,
    category: "Transport",
    date: new Date().toISOString(),
    createdAt: Date.now(),
  },
];

export default function Dashboard() {
  // Logic for calculations (In Clean Architecture, this eventually moves to a Use Case)
  const income = mockTransactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);
  const expenses = mockTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);
  const balance = income - expenses;

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-slate-900 pb-24">
      {/* Header */}
      <header className="px-6 pt-10 pb-6">
        <h1 className="text-2xl font-bold tracking-tight text-slate-800">
          Flowly
        </h1>
        <p className="text-slate-500 text-sm font-medium">Monthly Summary</p>
      </header>

      <main className="px-4 space-y-6">
        {/* 1. Monthly Summary (Top Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SummaryCard label="Income" amount={income} type="income" />
          <SummaryCard label="Expenses" amount={expenses} type="expense" />
          <SummaryCard label="Balance" amount={balance} type="balance" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* 2. Expense Breakdown (Simple progress bars) */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg">Spending patterns</h2>
              <LayoutGrid className="w-5 h-5 text-slate-300" />
            </div>
            <div className="space-y-4">
              <CategoryProgress
                name="Food"
                amount={120}
                total={expenses}
                color="bg-orange-400"
              />
              <CategoryProgress
                name="Transport"
                amount={60}
                total={expenses}
                color="bg-blue-400"
              />
            </div>
          </section>

          {/* 3. Debt Snapshot */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-lg">Debts</h2>
              <CreditCard className="w-5 h-5 text-slate-300" />
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-slate-50 rounded-2xl">
                <span className="text-sm font-medium">Personal Loan</span>
                <span className="text-sm font-bold text-rose-600">$1,200</span>
              </div>
            </div>
          </section>
        </div>

        {/* 4. Recent Transactions */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h2 className="font-semibold text-lg mb-4">Recent Activity</h2>
          <TransactionList transactions={mockTransactions} />
        </section>
      </main>

      {/* 5. Quick Actions Button */}
      <button
        onClick={() => {
          window.location.href = "/add";
        }}
        className="fixed bottom-8 right-6 w-14 h-14 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
        aria-label="Add New"
      >
        <Plus size={28} />
      </button>
    </div>
  );
}

// --- Sub-components for Cleanliness ---

function SummaryCard({
  label,
  amount,
  type,
}: {
  label: string;
  amount: number;
  type: "income" | "expense" | "balance";
}) {
  const colorMap = {
    income: "text-emerald-600",
    expense: "text-rose-500",
    balance: "text-slate-900",
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">
        {label}
      </p>
      <p className={`text-2xl font-bold ${colorMap[type]}`}>
        ${amount.toLocaleString()}
      </p>
    </div>
  );
}

function CategoryProgress({
  name,
  amount,
  total,
  color,
}: {
  name: string;
  amount: number;
  total: number;
  color: string;
}) {
  const percentage = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-sm font-medium">
        <span className="text-slate-600">{name}</span>
        <span>${amount}</span>
      </div>
      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
        <div
          className={`${color} h-full rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
