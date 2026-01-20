"use client";
import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Trash2,
  Edit3,
  AlertTriangle,
} from "lucide-react";
import * as Icons from "lucide-react";
import { useFlowlyContext } from "../context/FlowlyContext";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Transaction } from "../../domain/entities/Transaction";
import {
  toEthiopian,
  formatEth,
  ETHIOPIAN_MONTHS,
} from "../../infrastructure/utils/ethiopianDate";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 },
};

const TransactionsPage = () => {
  const {
    transactions,
    deleteTransaction,
    updateTransaction,
    categories,
    isLoading,
  } = useFlowlyContext();

  const [ethView, setEthView] = useState(() => {
    const now = toEthiopian(new Date());
    return { year: now.year, month: now.month };
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editType, setEditType] = useState<any>("expense");
  const [editDebtType, setEditDebtType] = useState<any>("owed");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editNote, setEditNote] = useState("");
  const [direction, setDirection] = useState(0);

  const nextMonth = () => {
    setDirection(1);
    setEthView((prev) => {
      if (prev.month === 13) return { year: prev.year + 1, month: 1 };
      return { ...prev, month: prev.month + 1 };
    });
  };

  const prevMonth = () => {
    setDirection(-1);
    setEthView((prev) => {
      if (prev.month === 1) return { year: prev.year - 1, month: 13 };
      return { ...prev, month: prev.month - 1 };
    });
  };

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const txEth = toEthiopian(t.date);
      return txEth.year === ethView.year && txEth.month === ethView.month;
    });
  }, [transactions, ethView]);

  const openEditModal = (tx: Transaction) => {
    const txType =
      typeof tx.type === "string" ? tx.type : (tx.type as any).value;
    setEditId(tx.id);
    setEditType(txType);
    setEditDebtType((tx as any).debtType || "owed");
    setEditAmount(tx.amount.toString());
    setEditCategory(tx.category);
    setEditDate(tx.date);
    setEditNote(tx.note || "");
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editId || !editAmount || !editCategory) return;
    const updatedTx: Transaction = {
      id: editId,
      type: editType,
      amount: parseFloat(editAmount),
      category: editCategory,
      date: editDate,
      note: editNote || undefined,
      createdAt: Date.now(),
      // @ts-ignore
      debtType: editType === "debt" ? editDebtType : undefined,
    };
    await updateTransaction(updatedTx);
    setIsEditOpen(false);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteTransaction(deleteId);
      setDeleteId(null);
    }
  };

  const filteredCategories = categories.filter((cat) => {
    const typeValue =
      typeof cat.type === "object" ? (cat.type as any).value : cat.type;
    return typeValue === editType;
  });

  if (isLoading)
    return (
      <div className="p-10 text-center text-slate-400 font-bold">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-[#FDFCFB] dark:bg-slate-950 pb-32 overflow-x-hidden transition-colors duration-500">
      <header className="px-6 pt-8 pb-4">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-800 dark:text-white"
        >
          Transactions
        </motion.h1>
      </header>

      {/* Date Selector */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={prevMonth}
          className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-[#477A71]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.span
            key={`${ethView.month}-${ethView.year}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-lg font-bold text-gray-700 dark:text-slate-200"
          >
            {ETHIOPIAN_MONTHS[ethView.month - 1]} {ethView.year}
          </motion.span>
        </AnimatePresence>
        <button
          onClick={nextMonth}
          className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm text-[#477A71]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <main className="px-4">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-bold tracking-widest uppercase text-xs">
              No records found
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {filteredTransactions.map((tx) => {
                const txType =
                  typeof tx.type === "string"
                    ? tx.type
                    : (tx.type as any).value;
                const isPos =
                  txType === "income" ||
                  (txType === "debt" && (tx as any).debtType === "owesMe");

                return (
                  <motion.div
                    key={tx.id}
                    layout
                    variants={itemVariants}
                    className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-3"
                  >
                    {/* CONTENT */}
                    <div className="flex-1 flex items-center justify-between overflow-hidden">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2.5 rounded-2xl ${isPos ? "bg-[#477A71]" : "bg-[#F0BB40]"} text-white shadow-sm`}
                        >
                          {txType === "income" ? (
                            <TrendingUp size={18} />
                          ) : txType === "debt" ? (
                            <CreditCard size={18} />
                          ) : (
                            <TrendingDown size={18} />
                          )}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-slate-800 dark:text-white truncate text-sm">
                            {tx.category}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 truncate uppercase">
                            {tx.note || "No Notes"} • {formatEth(tx.date)}
                          </p>
                        </div>
                      </div>

                      <p
                        className={`text-sm font-black whitespace-nowrap ${isPos ? "text-[#477A71]" : "text-[#F0BB40]"}`}
                      >
                        {isPos ? "+" : "-"} {tx.amount.toLocaleString()}
                      </p>
                      {/* LEFT SIDE ACTION BUTTONS */}
                      <div className="flex flex-col gap-2 pr-3 border-r border-slate-50 dark:border-slate-800">
                        <button
                          onClick={() => openEditModal(tx)}
                          className="p-1.5 text-slate-300 hover:text-[#477A71] transition-colors"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => setDeleteId(tx.id)}
                          className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* POPUPS (Delete/Edit) */}
      <AnimatePresence>
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative bg-white dark:bg-slate-900 p-6 rounded-2xl w-full max-w-xs text-center"
            >
              <AlertTriangle className="mx-auto text-rose-500 mb-2" size={32} />
              <p className="font-bold mb-6">Delete this transaction?</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl font-bold text-xs"
                >
                  No
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-rose-500 text-white rounded-xl font-bold text-xs"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-center pb-15">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative bg-white dark:bg-slate-900 rounded-t-[2.5rem] p-8 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[80vh]"
            >
              <div className="w-12 h-1 bg-slate-200 rounded-full mx-auto mb-6" />
              <h2 className="text-xl font-black mb-6">Edit Record</h2>
              <div className="space-y-4">
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl py-4 px-6 text-xl font-black outline-none"
                />
                <input
                  type="text"
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  placeholder="Note"
                  className="w-full bg-slate-50 dark:bg-slate-800 rounded-2xl py-4 px-6 outline-none"
                />
                <div className="grid grid-cols-4 gap-3">
                  {filteredCategories.map((cat) => {
                    const IconComp =
                      (Icons as any)[cat.icon] ?? Icons.MoreHorizontal;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setEditCategory(cat.name)}
                        className={`flex flex-col items-center gap-1 transition-opacity ${editCategory === cat.name ? "opacity-100" : "opacity-30"}`}
                      >
                        <div
                          className={`${cat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white`}
                        >
                          <IconComp size={18} />
                        </div>
                        <span className="text-[9px] font-bold">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleSaveEdit}
                  className="w-full py-4 bg-[#477A71] text-white rounded-2xl font-black uppercase tracking-widest mt-4"
                >
                  Update
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionsPage;
