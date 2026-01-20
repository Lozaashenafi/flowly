"use client";
import React, { useState, useEffect } from "react"; // Added useEffect
import { useFlowlyContext } from "../context/FlowlyContext";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft, Plus, DollarSign } from "lucide-react";
import * as Icons from "lucide-react";

export default function DebtLedgerPage() {
  const { debts, addDebtPayment, addDebt, addTransaction, categories } =
    useFlowlyContext();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [paymentTarget, setPaymentTarget] = useState<any>(null);
  const [newDebt, setNewDebt] = useState({
    name: "",
    amount: "",
    type: "owed",
    note: "",
  });
  const [payAmt, setPayAmt] = useState("");

  const debtCategories = categories.filter(
    (c) => (typeof c.type === "string" ? c.type : c.type.value) === "debt",
  );

  useEffect(() => {
    if (isAddOpen && debtCategories.length > 0 && !newDebt.name) {
      setNewDebt((prev) => ({ ...prev, name: debtCategories[0].name }));
    }
  }, [isAddOpen, debtCategories]);

  const handleAddDebt = async () => {
    if (!newDebt.name || !newDebt.amount) return;
    const parsedAmount = parseFloat(newDebt.amount);

    await addDebt({
      id: "",
      name: newDebt.name,
      totalAmount: parsedAmount,
      remainingAmount: parsedAmount,
      type: newDebt.type as any,
      note: newDebt.note,
      createdAt: Date.now(),
      isClosed: false,
    });

    await addTransaction({
      id: "",
      type: "debt",
      // @ts-ignore
      debtType: newDebt.type,
      amount: parsedAmount,
      category: newDebt.name,
      note: `Initial record: ${newDebt.note || newDebt.name}`,
      date: new Date().toISOString(),
      createdAt: Date.now(),
    });

    setNewDebt({ name: "", amount: "", type: "owed", note: "" });
    setIsAddOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-slate-950 pb-32 transition-colors duration-500">
      <header className="px-6 pt-12 pb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Debt <span className="text-[#477A71]">Ledger</span>
          </h1>
          <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
            Individual Tracking
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsAddOpen(true)}
          className="bg-[#477A71] text-white p-3.5 rounded-2xl shadow-lg"
        >
          <Plus size={24} strokeWidth={3} />
        </motion.button>
      </header>

      <main className="px-4 space-y-4">
        {debts.length === 0 ? (
          <div className="py-20 text-center text-slate-400 dark:text-slate-600">
            <p className="font-bold">No active debts found.</p>
          </div>
        ) : (
          debts.map((debt) => (
            <motion.div
              key={debt.id}
              layout
              className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800 shadow-sm transition-colors"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div
                    className={`p-3 rounded-2xl ${
                      debt.type === "owed"
                        ? "bg-rose-50 dark:bg-rose-900/20 text-rose-500"
                        : "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500"
                    }`}
                  >
                    {debt.type === "owed" ? (
                      <ArrowUpRight size={24} />
                    ) : (
                      <ArrowDownLeft size={24} />
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                      {debt.name}
                    </h4>
                    <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      {debt.type === "owed" ? "I borrowed" : "I lent"}
                    </p>
                    {debt.note && (
                      <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 italic mb-1">
                        "{debt.note}"
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-slate-900 dark:text-white">
                    {debt.remainingAmount.toLocaleString()} ETB
                  </p>
                  <p className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase">
                    Left of {debt.totalAmount.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mb-6 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${
                      ((debt.totalAmount - debt.remainingAmount) /
                        debt.totalAmount) *
                      100
                    }%`,
                  }}
                  className={`h-full ${
                    debt.type === "owed" ? "bg-rose-500" : "bg-emerald-500"
                  }`}
                />
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setPaymentTarget(debt)}
                  disabled={debt.isClosed}
                  className="flex-1 py-4 bg-[#477A71] text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-[#477A71]/20 disabled:opacity-30 disabled:shadow-none"
                >
                  {debt.isClosed ? "Debt Settled" : "Record Payment"}
                </button>
              </div>
            </motion.div>
          ))
        )}
      </main>

      {/* --- ADD DEBT MODAL --- */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddOpen(false)}
              className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25 }}
              className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 z-10 shadow-2xl max-w-lg mx-auto w-full border dark:border-slate-800"
            >
              <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">
                Track New Debt
              </h2>
              <div className="space-y-6">
                <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex">
                  <button
                    onClick={() => setNewDebt({ ...newDebt, type: "owed" })}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                      newDebt.type === "owed"
                        ? "bg-white dark:bg-slate-700 text-rose-500 shadow-sm"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    I Borrowed
                  </button>
                  <button
                    onClick={() => setNewDebt({ ...newDebt, type: "owesMe" })}
                    className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${
                      newDebt.type === "owesMe"
                        ? "bg-white dark:bg-slate-700 text-emerald-500 shadow-sm"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  >
                    I Lent
                  </button>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">
                    Debt Category
                  </label>
                  <div className="grid grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-3xl">
                    {debtCategories.map((cat) => {
                      const Icon =
                        (Icons as any)[cat.icon] || Icons.MoreHorizontal;
                      const isSel = newDebt.name === cat.name;
                      return (
                        <button
                          key={cat.id}
                          onClick={() =>
                            setNewDebt({ ...newDebt, name: cat.name })
                          }
                          className="flex flex-col items-center gap-1.5"
                        >
                          <div
                            className={`${
                              cat.color
                            } w-12 h-12 rounded-2xl flex items-center justify-center text-white transition-all ${
                              isSel
                                ? "ring-4 ring-offset-2 dark:ring-offset-slate-900 ring-white dark:ring-slate-400 scale-110 shadow-lg"
                                : "opacity-30"
                            }`}
                          >
                            <Icon size={20} />
                          </div>
                          <span
                            className={`text-[8px] font-bold ${
                              isSel
                                ? "text-slate-900 dark:text-white"
                                : "text-slate-400 dark:text-slate-600"
                            }`}
                          >
                            {cat.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="What is this for? (Optional note)"
                      value={newDebt.note}
                      onChange={(e) =>
                        setNewDebt({ ...newDebt, note: e.target.value })
                      }
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-transparent focus:border-[#477A71]/30 rounded-2xl py-4 px-12 text-sm font-bold text-slate-700 dark:text-slate-300 outline-none transition-all"
                    />
                    <Icons.Edit3
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 dark:text-slate-700 group-focus-within:text-[#F0BB40] transition-colors"
                    />
                  </div>
                </div>

                <div className="relative">
                  <input
                    type="number"
                    placeholder="Total Amount"
                    value={newDebt.amount}
                    onChange={(e) =>
                      setNewDebt({ ...newDebt, amount: e.target.value })
                    }
                    className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl py-5 px-8 font-black text-xl text-slate-800 dark:text-white outline-none"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-300 dark:text-slate-600">
                    ETB
                  </span>
                </div>
                <button
                  onClick={handleAddDebt}
                  className="w-full py-5 bg-[#477A71] text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#477A71]/20"
                >
                  Start Ledger Record
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- PAYMENT MODAL --- */}
      <AnimatePresence>
        {paymentTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPaymentTarget(null)}
              className="absolute inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-sm bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 z-10 shadow-2xl text-center border dark:border-slate-800"
            >
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                Record Payment
              </h3>
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-6">
                Settling: {paymentTarget.name}
              </p>

              <input
                autoFocus
                type="number"
                placeholder="Amount Paid"
                value={payAmt}
                onChange={(e) => setPayAmt(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-5 text-center text-2xl font-black text-slate-800 dark:text-white mb-6 outline-none"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => setPaymentTarget(null)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-bold text-slate-400 dark:text-slate-500"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    await addDebtPayment(paymentTarget.id, parseFloat(payAmt));
                    setPaymentTarget(null);
                    setPayAmt("");
                  }}
                  className="flex-1 py-4 bg-[#477A71] text-white rounded-2xl font-bold shadow-lg"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
