"use client";
import React, { useState } from "react";
import {
  ChevronLeft,
  Calendar,
  Receipt,
  GraduationCap,
  Film,
  Utensils,
  Heart,
  MoreHorizontal,
  ShoppingBag,
  Car,
  Home,
  BarChart2,
  Layers,
  Settings,
  Plus,
} from "lucide-react";

const AddTransaction = () => {
  const [type, setType] = useState("Expense");

  const categories = [
    {
      icon: <Receipt size={20} />,
      name: "Bills & Utilities",
      color: "bg-indigo-100 text-indigo-600",
    },
    {
      icon: <GraduationCap size={20} />,
      name: "Education",
      color: "bg-teal-100 text-teal-600",
    },
    {
      icon: <Film size={20} />,
      name: "Entertainment",
      color: "bg-purple-100 text-purple-600",
    },
    {
      icon: <Utensils size={20} />,
      name: "Food & Dining",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: <Heart size={20} />,
      name: "Health",
      color: "bg-red-100 text-red-600",
    },
    {
      icon: <MoreHorizontal size={20} />,
      name: "Other",
      color: "bg-gray-100 text-gray-600",
    },
    {
      icon: <ShoppingBag size={20} />,
      name: "Shopping",
      color: "bg-pink-100 text-pink-600",
    },
    {
      icon: <Car size={20} />,
      name: "Transport",
      color: "bg-blue-100 text-blue-600",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans pb-32">
      {/* Top Header */}
      <header className="px-6 py-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#477a71]">Add Transaction</h1>
        <button className="text-[#477a71]">
          <ChevronLeft size={24} />
        </button>
      </header>

      <main className="px-4 space-y-6">
        {/* Transaction Type Toggle */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex">
          <button
            onClick={() => setType("Income")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              type === "Income"
                ? "bg-[#f0bb40] text-white shadow-sm"
                : "text-slate-500"
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setType("Expense")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              type === "Expense"
                ? "bg-[#477a71] text-white shadow-sm"
                : "text-slate-500"
            }`}
          >
            Expense
          </button>
          <button
            onClick={() => setType("Debt")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              type === "Debt"
                ? "bg-slate-800 text-white shadow-sm"
                : "text-slate-500"
            }`}
          >
            Debt
          </button>
        </div>

        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#477a71]/60 uppercase tracking-widest px-1">
            Amount
          </label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#477a71] font-bold text-lg">
              $
            </span>
            <input
              type="text"
              placeholder="0.00"
              className="w-full bg-white border border-slate-100 rounded-2xl py-5 pl-10 pr-4 text-xl font-bold text-[#477a71] focus:outline-none focus:ring-2 focus:ring-[#477a71]/20 shadow-sm transition-all"
            />
          </div>
        </div>

        {/* Category Grid */}
        <div className="space-y-4">
          <label className="text-xs font-bold text-[#477a71]/60 uppercase tracking-widest px-1">
            Category
          </label>
          <div className="grid grid-cols-4 gap-3">
            {categories.map((cat, idx) => (
              <button
                key={idx}
                className="bg-white p-3 rounded-2xl border border-slate-50 flex flex-col items-center gap-2 shadow-sm hover:border-[#477a71]/30 transition-all group"
              >
                <div
                  className={`${cat.color} p-2.5 rounded-xl group-hover:scale-110 transition-transform`}
                >
                  {cat.icon}
                </div>
                <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">
                  {cat.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#477a71]/60 uppercase tracking-widest px-1">
            Date & Time
          </label>
          <div className="relative">
            <input
              type="text"
              defaultValue="12/19/2025 05:18 PM"
              className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-4 text-sm font-medium text-slate-700 focus:outline-none shadow-sm"
            />
            <Calendar
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
              size={18}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#477a71]/60 uppercase tracking-widest px-1">
            Notes (optional)
          </label>
          <textarea
            placeholder="Add a note..."
            rows={4}
            className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-4 text-sm text-slate-700 focus:outline-none shadow-sm resize-none"
          />
        </div>

        {/* Action Button */}
        <button
          className={`w-full py-5 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
            type === "Income" ? "bg-[#f0bb40]" : "bg-[#477a71] opacity-60"
          }`}
        >
          Add {type}
        </button>
      </main>

      {/* Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center z-50">
        <div className="flex flex-col items-center gap-1 text-slate-400">
          <Home size={22} />
          <span className="text-[10px] font-bold">Home</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-400">
          <BarChart2 size={22} />
          <span className="text-[10px] font-bold">Analytics</span>
        </div>
        <div className="relative -top-8">
          <button className="bg-[#477a71] text-white p-4 rounded-full shadow-xl border-4 border-white">
            <Plus size={28} strokeWidth={3} />
          </button>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-400">
          <Layers size={22} />
          <span className="text-[10px] font-bold">Categories</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-slate-400">
          <Settings size={22} />
          <span className="text-[10px] font-bold">Settings</span>
        </div>
      </nav>
    </div>
  );
};

export default AddTransaction;
