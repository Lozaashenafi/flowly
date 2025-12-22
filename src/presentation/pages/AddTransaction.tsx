"use client";
import React, { useState, useRef } from "react";
import * as Icons from "lucide-react";
import { useRouter } from "next/navigation";
import { useFlowlyContext } from "../context/FlowlyContext";
import { Transaction } from "../../domain/entities/Transaction";
import { TransactionType } from "../../domain/value-objects/TransactionType";
type DebtType = "owed" | "owesMe";

const AddTransactionPage = () => {
  const { addTransaction, categories } = useFlowlyContext();
  const router = useRouter();
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<TransactionType>("expense");
  const [debtType, setDebtType] = useState<DebtType>("owed"); // New state for debt type
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString());
  const [note, setNote] = useState("");

  const filteredCategories = categories.filter((cat) => {
    const typeValue =
      typeof cat.type === "object" ? (cat.type as any).value : cat.type;
    return typeValue === type;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || !category) {
      alert("Amount and category are required");
      return;
    }

    const newTx: Transaction = {
      id: "",
      type,
      debtType: type === "debt" ? debtType : undefined,
      amount: parsedAmount,
      category,
      note: note || undefined,
      date,
      createdAt: Date.now(),
    };

    try {
      await addTransaction(newTx);
      router.push("/");
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const handleDateContainerClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
    }
  };

  const toLocalDateTimeString = (isoString: string): string => {
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans pb-32">
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Add Transaction
        </h1>
        <p className="text-slate-400 text-sm font-medium">
          Fill in the details below
        </p>
      </header>

      <main className="px-4 space-y-8">
        {/* Type Toggle */}
        <div className="bg-slate-100 p-1.5 rounded-3xl flex shadow-inner">
          {(["income", "expense", "debt"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setType(t);
                setCategory("");
              }}
              className={`flex-1 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                type === t
                  ? t === "income"
                    ? "bg-emerald-500 text-white shadow-lg"
                    : t === "expense"
                    ? "bg-rose-500 text-white shadow-lg"
                    : "bg-slate-800 text-white shadow-lg"
                  : "text-slate-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Debt Type Toggle - Only visible when "debt" is selected */}
        {type === "debt" && (
          <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
              Debt Type
            </label>
            <div className="bg-slate-100/50 p-1 rounded-2xl flex border border-slate-50">
              <button
                onClick={() => setDebtType("owed")}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  debtType === "owed"
                    ? "bg-white text-rose-500 shadow-sm"
                    : "text-slate-400"
                }`}
              >
                I Owe (Borrowed)
              </button>
              <button
                onClick={() => setDebtType("owesMe")}
                className={`flex-1 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                  debtType === "owesMe"
                    ? "bg-white text-emerald-500 shadow-sm"
                    : "text-slate-400"
                }`}
              >
                Owes Me (Lent)
              </button>
            </div>
          </div>
        )}

        {/* Amount Section */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
            How much?
          </label>
          <div className="relative group">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-light text-3xl group-focus-within:text-[#477a71] transition-colors">
              $
            </span>
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white border-2 border-slate-50 rounded-2xl py-8 pl-14 pr-6 text-4xl font-black text-slate-800 placeholder:text-slate-100 focus:outline-none focus:border-[#477a71]/20 shadow-xl shadow-slate-200/40 transition-all"
            />
          </div>
        </div>

        {/* Category Grid */}
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
            Category
          </label>
          <div className="grid grid-cols-4 gap-4">
            {filteredCategories.map((cat) => {
              const IconComponent =
                (Icons as any)[cat.icon] ?? Icons.MoreHorizontal;
              const isSelected = category === cat.name;

              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.name)}
                  className={`relative flex flex-col items-center gap-3 transition-all duration-300 ${
                    isSelected ? "scale-110" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  <div
                    className={`${
                      cat.color
                    } w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg ${
                      isSelected
                        ? "ring-4 ring-offset-2 ring-slate-100"
                        : "shadow-slate-200"
                    }`}
                  >
                    <IconComponent size={24} strokeWidth={2.5} />
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      isSelected ? "text-slate-900" : "text-slate-400"
                    } text-center`}
                  >
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date Picker Section */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
            Date & Time
          </label>
          <button
            type="button"
            onClick={handleDateContainerClick}
            className="relative w-full flex items-center bg-white border-2 border-slate-50 rounded-2xl py-5 px-6 shadow-md shadow-slate-200/50 cursor-pointer active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-[#477a71]/30 focus:border-[#477a71]/20 text-left"
          >
            <div className="bg-slate-100 p-2 rounded-lg mr-4 ">
              <Icons.Calendar className="text-slate-600" size={20} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-tight">
                Schedule
              </span>
              <span className="text-sm font-bold text-slate-800 truncate">
                {date
                  ? new Date(date).toLocaleString([], {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })
                  : "Select date & time"}
              </span>
            </div>

            <input
              ref={dateInputRef}
              type="datetime-local"
              value={date ? toLocalDateTimeString(date) : ""}
              onChange={(e) => {
                const value = e.target.value;
                if (value) {
                  const localDate = new Date(value + ":00");
                  setDate(localDate.toISOString());
                }
              }}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              tabIndex={-1}
            />
          </button>
        </div>

        {/* Notes */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
            Note
          </label>
          <div className="relative">
            <textarea
              placeholder="What was this for?"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white border-2 border-slate-50 rounded-2xl py-4 px-6 text-sm font-bold text-slate-700 focus:outline-none shadow-md shadow-slate-200/50 resize-none"
            />
            <Icons.Edit3
              size={16}
              className="absolute right-4 bottom-4 text-slate-200"
            />
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleSubmit}
          disabled={!amount || !category}
          className={`w-full py-6 rounded-2xl font-black text-sm uppercase tracking-[0.2em] text-white shadow-2xl transition-all active:scale-[0.95] disabled:bg-slate-200 disabled:shadow-none ${
            type === "income"
              ? "bg-emerald-500 shadow-emerald-200"
              : type === "expense"
              ? "bg-rose-500 shadow-rose-200"
              : "bg-slate-800 shadow-slate-300"
          }`}
        >
          Confirm{" "}
          {type === "debt"
            ? debtType === "owed"
              ? "Owed Debt"
              : "Owes Me"
            : type}
        </button>
      </main>
    </div>
  );
};

export default AddTransactionPage;
