"use client";
import React, { useState, useRef, useEffect } from "react";
import * as Icons from "lucide-react";
import { useRouter } from "next/navigation";
import { useFlowlyContext } from "../context/FlowlyContext";
import { Transaction } from "../../domain/entities/Transaction";
import { TransactionType } from "../../domain/value-objects/TransactionType";
import { motion, AnimatePresence } from "framer-motion";

type DebtType = "owed" | "owesMe";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease: "easeOut" },
};

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } },
};

const AddTransactionPage = () => {
  const { addTransaction, categories } = useFlowlyContext();
  const router = useRouter();
  const dateInputRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState(new Date().toISOString());
  const [note, setNote] = useState("");

  const filteredCategories = categories.filter((cat) => {
    const typeValue =
      typeof cat.type === "object" ? (cat.type as any).value : cat.type;
    return typeValue === type;
  });

  // Auto-select first category when type changes
  useEffect(() => {
    if (filteredCategories.length > 0) {
      setCategory(filteredCategories[0].name);
    }
  }, [type]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || !category) return;

    const newTx: Transaction = {
      id: "",
      type,
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
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-slate-950 font-sans pb-32 transition-colors duration-500">
      <motion.header
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-6 pt-12 pb-6"
      >
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Add <span className="text-[#477A71]">Transaction</span>
        </h1>
        <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
          Flowly Financial Core
        </p>
      </motion.header>

      <motion.main
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="px-5 space-y-8"
      >
        {/* Type Selector Tabs */}
        <motion.div
          variants={fadeInUp}
          className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl flex shadow-sm border border-slate-100 dark:border-slate-800 relative"
        >
          {(["income", "expense"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`relative flex-1 py-3.5 rounded-[20px] text-[11px] font-black uppercase tracking-widest transition-all z-10 ${
                type === t ? "text-white" : "text-gray-400 dark:text-slate-500"
              }`}
            >
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
          <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-1">
            How much?
          </label>
          <div className="relative group">
            <input
              type="number"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border-2 border-slate-50 dark:border-slate-800 rounded-2xl py-8 pl-14 pr-6 text-4xl font-black text-slate-800 dark:text-white placeholder:text-slate-100 dark:placeholder:text-slate-800 focus:outline-none focus:border-[#477a71]/20 shadow-xl shadow-slate-200/40 dark:shadow-none transition-all"
            />
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 font-light text-2xl group-focus-within:text-[#477a71] transition-colors">
              $
            </span>
          </div>
        </motion.div>

        {/* Categories - IMPROVED UI */}
        <motion.div variants={fadeInUp} className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Category
            </label>
          </div>
          <div className="grid grid-cols-4 gap-y-6 gap-x-3">
            {filteredCategories.map((cat) => {
              const IconComponent =
                (Icons as any)[cat.icon] ?? Icons.MoreHorizontal;
              const isSelected = category === cat.name;

              return (
                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.9 }}
                  key={cat.id}
                  onClick={() => setCategory(cat.name)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div
                    className={`${
                      cat.color
                    } w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-300 relative
                    ${
                      isSelected
                        ? "ring-4 ring-[#477A71] ring-offset-4 dark:ring-offset-slate-950 scale-105 shadow-lg"
                        : "opacity-80 grayscale-[20%] border-2 border-transparent hover:grayscale-0 hover:opacity-100"
                    }
                    bg-white dark:bg-slate-800 p-1 shadow-sm`}
                  >
                    {/* The icon tile */}
                    <div
                      className={`w-full h-full rounded-[20px] flex items-center justify-center ${cat.color} text-white`}
                    >
                      <IconComponent size={24} strokeWidth={2.5} />
                    </div>

                    {/* Active Indicator */}
                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 bg-[#477A71] text-white rounded-full p-1 border-2 border-white dark:border-slate-950"
                        >
                          <Icons.Check size={10} strokeWidth={4} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <span
                    className={`text-[10px] font-bold transition-colors ${
                      isSelected
                        ? "text-slate-900 dark:text-white"
                        : "text-slate-400 dark:text-slate-600 group-hover:text-slate-500"
                    }`}
                  >
                    {cat.name}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Form Controls */}
        <motion.div variants={fadeInUp} className="space-y-3">
          <button
            type="button"
            onClick={() => dateInputRef.current?.showPicker()}
            className="w-full flex items-center bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[22px] p-4 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="bg-[#477A71]/10 p-2.5 rounded-xl mr-4">
              <Icons.Calendar size={18} className="text-[#477A71]" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                Date & Time
              </span>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
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
              className="w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[22px] p-4 pl-12 text-sm font-bold text-slate-700 dark:text-slate-300 focus:border-[#477a71]/30 focus:outline-none shadow-sm transition-all"
            />
            <Icons.Edit3
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-[#F0BB40] transition-colors"
            />
          </div>
        </motion.div>

        {/* Submit Button */}
        <motion.button
          variants={fadeInUp}
          whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          disabled={!amount || !category}
          className={`w-full py-5 rounded-2xl font-black text-[12px] uppercase tracking-[0.3em] text-white shadow-2xl transition-all disabled:bg-slate-100 dark:disabled:bg-slate-800 disabled:text-slate-300 dark:disabled:text-slate-700 disabled:shadow-none ${
            type === "income"
              ? "bg-[#477A71] shadow-[#477A71]/40"
              : "bg-[#F0BB40] shadow-[#F0BB40]/40 dark:shadow-none"
          }`}
        >
          Confirm {type}
        </motion.button>
      </motion.main>
    </div>
  );
};

export default AddTransactionPage;
