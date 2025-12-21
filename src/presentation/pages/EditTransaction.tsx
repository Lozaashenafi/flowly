// src/presentation/pages/EditTransaction.tsx
// Updated with dynamic categories and preserved createdAt
"use client";

import React, { useState, useEffect } from "react";
import * as Icons from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { useFlowlyContext } from "../context/FlowlyContext";
import { Transaction } from "../../domain/entities/Transaction";
import { TransactionType } from "../../domain/value-objects/TransactionType";

const EditTransactionPage = () => {
  const { getTransaction, updateTransaction, categories } = useFlowlyContext();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString());
  const [note, setNote] = useState("");
  const [loadedTx, setLoadedTx] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTransaction = async () => {
      if (!id) return;
      const tx = await getTransaction(id);
      if (tx) {
        setLoadedTx(tx);
        setType(tx.type);
        setAmount(tx.amount.toString());
        setCategory(tx.category);
        setDate(tx.date);
        setNote(tx.note || "");
      } else {
        alert("Transaction not found");
        router.back();
      }
      setIsLoading(false);
    };
    loadTransaction();
  }, [id, getTransaction, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || !category) {
      alert("Amount and category are required");
      return;
    }

    if (!loadedTx) {
      alert("No transaction loaded");
      return;
    }

    const updatedTx: Transaction = {
      ...loadedTx,
      type,
      amount: parsedAmount,
      category,
      note: note || undefined,
      date,
    };

    try {
      await updateTransaction(updatedTx);
      router.push("/transactions"); // Or back to list
    } catch (error) {
      console.error("Error updating transaction:", error);
      alert("Failed to update transaction");
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans pb-32">
      {/* Top Header */}
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          Edit Transaction
        </h1>
      </header>

      <main className="px-4 space-y-6">
        {/* Transaction Type Toggle */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex">
          <button
            onClick={() => setType("income")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              type === "income"
                ? "bg-[#f0bb40] text-white shadow-sm"
                : "text-slate-500"
            }`}
          >
            Income
          </button>
          <button
            onClick={() => setType("expense")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              type === "expense"
                ? "bg-[#477a71] text-white shadow-sm"
                : "text-slate-500"
            }`}
          >
            Expense
          </button>
          <button
            onClick={() => setType("debt")}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              type === "debt"
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
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
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
            {categories.map((cat) => {
              const IconComponent = ((Icons as any)[cat.icon] ??
                Icons.MoreHorizontal) as React.ComponentType<any>;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.name)}
                  className={`bg-white p-3 rounded-2xl border flex flex-col items-center gap-2 shadow-sm hover:border-[#477a71]/30 transition-all group ${
                    category === cat.name
                      ? "border-[#477a71] scale-105"
                      : "border-slate-50"
                  }`}
                >
                  <div
                    className={`${cat.color} p-2.5 rounded-xl group-hover:scale-110 transition-transform`}
                  >
                    <IconComponent size={20} />
                  </div>
                  <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date & Time */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#477a71]/60 uppercase tracking-widest px-1">
            Date & Time
          </label>
          <div className="relative">
            <input
              type="datetime-local"
              value={date.slice(0, 16)}
              onChange={(e) => setDate(new Date(e.target.value).toISOString())}
              className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-4 text-sm font-medium text-slate-700 focus:outline-none shadow-sm"
            />
            <Icons.Calendar
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
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-white border border-slate-100 rounded-2xl py-4 px-4 text-sm text-slate-700 focus:outline-none shadow-sm resize-none"
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleSubmit}
          className={`w-full py-5 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${
            type === "income"
              ? "bg-[#f0bb40]"
              : type === "expense"
              ? "bg-[#477a71]"
              : "bg-slate-800"
          }`}
        >
          Update {type.charAt(0).toUpperCase() + type.slice(1)}
        </button>
      </main>
    </div>
  );
};

export default EditTransactionPage;
