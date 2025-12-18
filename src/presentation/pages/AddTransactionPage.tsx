"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Calendar,
  Tag,
  DollarSign,
  TextQuote,
} from "lucide-react";

export default function AddTransactionPage() {
  const router = useRouter();

  // Local state for the form
  const [type, setType] = useState<"expense" | "income">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here: Invoke your Use Case / Controller

    // e.g., createTransactionUseCase.execute({ amount, type, category, date })
    console.log("Saving...", { amount, type, category, date });
    router.back();
  };

  return (
    <div className="min-h-screen bg-[#F8F7F4] text-slate-900 font-sans pb-10">
      {/* Top Navigation */}
      <header className="px-4 pt-6 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="p-2 -ml-2 text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-semibold italic text-slate-800">
          New Entry
        </h1>
        <div className="w-10" /> {/* Spacer for centering */}
      </header>

      <main className="max-w-md mx-auto px-6 mt-8">
        {/* Toggle Expense/Income */}
        <div className="flex p-1 bg-slate-200/50 rounded-2xl mb-10">
          <button
            onClick={() => setType("expense")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              type === "expense"
                ? "bg-white text-rose-500 shadow-sm"
                : "text-slate-500"
            }`}
          >
            Expense
          </button>
          <button
            onClick={() => setType("income")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              type === "income"
                ? "bg-white text-emerald-600 shadow-sm"
                : "text-slate-500"
            }`}
          >
            Income
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Amount Input - The Focus Piece */}
          <div className="text-center space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-400">
              Amount
            </label>
            <div className="relative flex items-center justify-center">
              <span className="text-4xl font-light text-slate-400 mr-1">$</span>
              <input
                type="number"
                placeholder="0.00"
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-transparent text-5xl font-semibold outline-none w-2/3 text-center placeholder:text-slate-200"
              />
            </div>
          </div>

          <div className="space-y-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            {/* Category Select */}
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                <Tag size={20} />
              </div>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700"
              >
                <option value="" disabled>
                  Select Category
                </option>
                <option value="Food">Food & Drinks</option>
                <option value="Salary">Salary</option>
                <option value="Transport">Transport</option>
                <option value="Shopping">Shopping</option>
              </select>
            </div>

            <hr className="border-slate-50" />

            {/* Date Input */}
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                <Calendar size={20} />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700"
              />
            </div>

            <hr className="border-slate-50" />

            {/* Optional Note */}
            <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-50 rounded-xl text-slate-400">
                <TextQuote size={20} />
              </div>
              <input
                type="text"
                placeholder="Add a note..."
                className="flex-1 bg-transparent outline-none text-sm font-medium text-slate-700 placeholder:text-slate-300"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-transform active:scale-[0.98] ${
              type === "expense" ? "bg-slate-900" : "bg-emerald-600"
            }`}
          >
            Save Transaction
          </button>
        </form>
      </main>
    </div>
  );
}
