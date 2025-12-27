"use client";
import React, { useState } from "react";
import { useFlowlyContext } from "../context/FlowlyContext";
import { motion, AnimatePresence } from "framer-motion";
import { Target, ChevronRight, X } from "lucide-react";

export default function BudgetsPage() {
  const { categories, budgets, addBudget } = useFlowlyContext();
  const [selectedCat, setSelectedCat] = useState<any>(null);
  const [amount, setAmount] = useState("");

  const handleSave = async () => {
    if (!selectedCat || !amount) return;
    await addBudget({
      id: "",
      categoryId: selectedCat.id,
      amount: parseFloat(amount),
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
    });
    setSelectedCat(null);
    setAmount("");
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32">
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Monthly <span className="text-[#477A71]">Budgets</span>
        </h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
          Set Spending Targets
        </p>
      </header>

      <main className="px-4 space-y-3">
        {categories
          .filter(
            (c) =>
              (typeof c.type === "string" ? c.type : c.type.value) === "expense"
          )
          .map((cat) => {
            const budget = budgets.find((b) => b.categoryId === cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat)}
                className="w-full bg-white p-5 rounded-[2.5rem] border-2 border-slate-50 flex items-center justify-between shadow-sm active:scale-95 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`${cat.color} p-3 rounded-2xl text-white shadow-lg`}
                  >
                    <Target size={20} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-800">{cat.name}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase">
                      {budget
                        ? `${budget.amount.toLocaleString()} ETB Limit`
                        : "No target set"}
                    </p>
                  </div>
                </div>
                <ChevronRight className="text-slate-200" size={20} />
              </button>
            );
          })}
      </main>

      <AnimatePresence>
        {selectedCat && (
          <div className="fixed inset-0 z-10 flex items-end justify-center pb-15">
            {/* Backdrop - High Z-Index */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCat(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />

            {/* Modal Content - Higher Z-Index */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-white rounded-t-2xl p-8 pb-12 w-full max-w-lg shadow-2xl z-10"
            >
              <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />
              <h3 className="text-xl font-black text-slate-900 mb-6 text-center">
                Set Budget for {selectedCat.name}
              </h3>
              <div className="relative mb-8">
                <input
                  autoFocus
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-50 border-none rounded-3xl py-6 px-8 text-3xl font-black text-slate-800 text-center focus:ring-2 focus:ring-[#477A71]/20 outline-none"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-300">
                  ETB
                </span>
              </div>
              <button
                onClick={handleSave}
                className="w-full py-5 rounded-2xl bg-[#477A71] text-white font-black uppercase tracking-widest shadow-xl active:scale-95 transition-transform"
              >
                Save Target
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
