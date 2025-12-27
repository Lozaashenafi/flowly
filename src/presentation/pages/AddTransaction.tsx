"use client";
import React, { useState, useRef } from "react";
import * as Icons from "lucide-react";
import { useRouter } from "next/navigation";
import { useFlowlyContext } from "../context/FlowlyContext";
import { Transaction } from "../../domain/entities/Transaction";
import { TransactionType } from "../../domain/value-objects/TransactionType";
// 1. Import motion
import { motion, AnimatePresence } from "framer-motion";

type DebtType = "owed" | "owesMe";

// Animation Variants
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const AddTransactionPage = () => {
  const { addTransaction, categories } = useFlowlyContext();
  const router = useRouter();
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<TransactionType>("expense");
  const [debtType, setDebtType] = useState<DebtType>("owed");
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
    if (!parsedAmount || !category) return;

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

  const toLocalDateTimeString = (isoString: string): string => {
    const date = new Date(isoString);
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().slice(0, 16);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] font-sans pb-32">
      {/* Header with Motion */}
      <motion.header
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-6 pt-12 pb-6 flex justify-between items-start"
      >
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Add <span className="text-[#477A71]">Transaction</span>
          </h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">
            Flowly Financial Core
          </p>
        </div>
      </motion.header>
      <motion.main
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="px-5 space-y-8"
      >
        {/* Type Selector Tabs - REMOVED DEBT */}
        <motion.div
          variants={fadeInUp}
          className="bg-white p-1.5 rounded-2xl flex shadow-sm border border-slate-100 relative"
        >
          {(["income", "expense"] as const).map((t) => (
            <button
              key={t}
              onClick={() => {
                setType(t);
                setCategory("");
              }}
              className={`relative flex-1 py-3.5 rounded-[20px] text-[11px] font-black uppercase tracking-[0.15em] transition-all z-10 ${
                type === t ? "text-white" : "text-gray-400 hover:bg-gray-50"
              }`}
            >
              {/* Layout animation for the selection pill */}
              {type === t && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 rounded-[20px] -z-10 ${
                    t === "income" ? "bg-[#477A71]" : "bg-[#F0BB40]"
                  }`}
                  transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}
                />
              )}
              {t}
            </button>
          ))}
        </motion.div>

        {/* Amount Input */}
        <motion.div variants={fadeInUp} className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] px-1">
            How much?
          </label>
          <div className="relative group">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white border-2 border-slate-50 rounded-2xl py-8 pl-14 pr-6 text-4xl font-black text-slate-800 placeholder:text-slate-100 focus:outline-none focus:border-[#477a71]/20 shadow-xl shadow-slate-200/40 transition-all"
            />
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 font-light text-2xl group-focus-within:text-[#477a71] transition-colors">
              $
            </span>
          </div>
        </motion.div>

        {/* Categories with Entry Animation */}
        <motion.div variants={fadeInUp} className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Category
            </label>
            <AnimatePresence mode="wait">
              {category && (
                <motion.span
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  key={category}
                  className="text-[10px] font-bold text-[#477A71] uppercase"
                >
                  Selected: {category}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <motion.div className="grid grid-cols-4 gap-y-6 gap-x-2">
            {filteredCategories.map((cat) => {
              const IconComponent =
                (Icons as any)[cat.icon] ?? Icons.MoreHorizontal;
              const isSelected = category === cat.name;

              return (
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  key={cat.id}
                  onClick={() => setCategory(cat.name)}
                  className="flex flex-col items-center gap-2 transition-all"
                >
                  <div
                    className={`${
                      cat.color
                    } w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? "ring-2 ring-[#F0BB40] ring-offset-4 scale-105 shadow-xl"
                        : "opacity-80 hover:opacity-100 shadow-sm"
                    }`}
                  >
                    <IconComponent
                      size={26}
                      className="text-white"
                      strokeWidth={2.5}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      isSelected ? "text-slate-900" : "text-slate-400"
                    }`}
                  >
                    {cat.name}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Form Controls */}
        <motion.div variants={fadeInUp} className="space-y-3">
          <button
            type="button"
            onClick={() => dateInputRef.current?.showPicker()}
            className="w-full flex items-center bg-white border border-slate-100 rounded-[22px] p-4 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="bg-[#477A71]/10 p-2.5 rounded-xl mr-4">
              <Icons.Calendar size={18} className="text-[#477A71]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                Date & Time
              </span>
              <span className="text-sm font-bold text-slate-700">
                {new Date(date).toLocaleString([], {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
            <input
              ref={dateInputRef}
              type="datetime-local"
              value={toLocalDateTimeString(date)}
              onChange={(e) =>
                e.target.value &&
                setDate(new Date(e.target.value).toISOString())
              }
              className="absolute opacity-0 w-0 h-0"
            />
          </button>

          <div className="relative group">
            <input
              type="text"
              placeholder="Add a note..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full bg-white border border-slate-100 rounded-[22px] p-4 pl-12 text-sm font-bold text-slate-700 focus:border-[#477a71]/30 focus:outline-none shadow-sm transition-all"
            />
            <Icons.Edit3
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#F0BB40] transition-colors"
            />
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          variants={fadeInUp}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!amount || !category}
          className={`w-full py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] text-white shadow-2xl transition-all active:scale-[0.95] disabled:bg-slate-100 disabled:text-slate-300 disabled:shadow-none ${
            type === "income"
              ? "bg-[#477A71] shadow-[#477A71]/40"
              : "bg-[#F0BB40] shadow-[#F0BB40]/40"
          }`}
        >
          Confirm {type}
        </motion.button>
      </motion.main>
    </div>
  );
};

export default AddTransactionPage;
