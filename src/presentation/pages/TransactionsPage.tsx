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
  Calendar,
  Tag,
  FileText,
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

// Animation for centered popups
const centerModalVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 },
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
  const [detailTx, setDetailTx] = useState<Transaction | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editId, setEditId] = useState<string | null>(null);
  const [editType, setEditType] = useState<any>("expense");
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
    setEditAmount(tx.amount.toString());
    setEditCategory(tx.category);
    setEditDate(tx.date);
    setEditNote(tx.note || "");
    setIsEditOpen(true);
    setDetailTx(null);
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
    };
    await updateTransaction(updatedTx);
    setIsEditOpen(false);
  };

  const confirmDelete = async () => {
    if (deleteId) {
      await deleteTransaction(deleteId);
      setDeleteId(null);
      setDetailTx(null);
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
          className="text-2xl font-black text-slate-900 dark:text-white tracking-tight"
        >
          Trans<span className="text-[#477A71]">actions</span>
        </motion.h1>
      </header>

      {/* Date Selector */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={prevMonth}
          className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm text-[#477A71]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <AnimatePresence mode="wait" custom={direction}>
          <motion.span
            key={`${ethView.month}-${ethView.year}`}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-sm font-black text-slate-800 dark:text-slate-200 uppercase tracking-widest"
          >
            {ETHIOPIAN_MONTHS[ethView.month - 1]} {ethView.year}
          </motion.span>
        </AnimatePresence>
        <button
          onClick={nextMonth}
          className="p-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl shadow-sm text-[#477A71]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <main className="px-4">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-bold tracking-widest uppercase text-[10px]">
              No records found
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-3"
            >
              {filteredTransactions.map((tx, idx) => {
                const txType =
                  typeof tx.type === "string"
                    ? tx.type
                    : (tx.type as any).value;
                const isPos =
                  txType === "income" ||
                  (txType === "debt" && (tx as any).debtType === "owesMe");

                return (
                  <motion.div
                    // FIX: Using unique key combination to prevent React warning
                    key={tx.id || `tx-${idx}`}
                    layout
                    variants={itemVariants}
                    onClick={() => setDetailTx(tx)}
                    className="bg-white dark:bg-slate-900 p-4 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <div
                        className={`p-3 rounded-2xl ${isPos ? "bg-[#477A71]" : "bg-[#F0BB40]"} text-white shrink-0`}
                      >
                        {txType === "income" ? (
                          <TrendingUp size={18} />
                        ) : txType === "debt" ? (
                          <CreditCard size={18} />
                        ) : (
                          <TrendingDown size={18} />
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm truncate">
                          {tx.category}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight truncate">
                          {tx.note || "No details"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <p
                        className={`text-sm font-black ${isPos ? "text-[#477A71]" : "text-[#F0BB40]"}`}
                      >
                        {isPos ? "+" : "-"} {tx.amount.toLocaleString()}
                      </p>
                      <p className="text-[9px] font-bold text-slate-300 uppercase">
                        {formatEth(tx.date).split(",")[0]}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* CENTERED POPUPS */}
      <AnimatePresence>
        {/* DETAIL POPUP (CENTERED) */}
        {detailTx && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDetailTx(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              variants={centerModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white dark:bg-slate-950 rounded-[40px] p-8 w-full max-w-sm shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-black text-[#477A71] uppercase tracking-[0.2em]">
                    Transaction Detail
                  </span>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-1 break-words">
                    {detailTx.amount.toLocaleString()}{" "}
                    <span className="text-sm text-slate-400 font-bold">
                      ETB
                    </span>
                  </h2>
                </div>
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={() => openEditModal(detailTx)}
                    className="p-2 bg-slate-50 dark:bg-slate-900 rounded-xl text-slate-400"
                  >
                    <Edit3 size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteId(detailTx.id)}
                    className="p-2 bg-rose-50 dark:bg-rose-950/30 rounded-xl text-rose-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                  <Tag size={16} className="text-[#477A71]" />
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-slate-400 uppercase">
                      Category
                    </p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate">
                      {detailTx.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                  <Calendar size={16} className="text-[#477A71]" />
                  <div className="min-w-0">
                    <p className="text-[8px] font-black text-slate-400 uppercase">
                      Date
                    </p>
                    <p className="font-bold text-slate-800 dark:text-slate-200 text-xs truncate">
                      {formatEth(detailTx.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl">
                  <FileText size={16} className="text-[#477A71] shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[8px] font-black text-slate-400 uppercase">
                      Note
                    </p>
                    <p className="font-bold text-slate-700 dark:text-slate-300 text-xs leading-relaxed break-words whitespace-pre-wrap">
                      {detailTx.note || "No additional notes provided."}
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setDetailTx(null)}
                className="w-full mt-6 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest"
              >
                Close
              </button>
            </motion.div>
          </div>
        )}

        {/* DELETE CONFIRMATION (CENTERED) */}
        {deleteId && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              variants={centerModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white dark:bg-slate-900 p-8 rounded-[32px] w-full max-w-xs text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-500">
                <AlertTriangle size={32} />
              </div>
              <p className="font-black text-slate-800 dark:text-white mb-1">
                Are you sure?
              </p>
              <p className="text-[10px] font-bold text-slate-400 mb-6 uppercase">
                This action cannot be undone
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-4 bg-slate-100 dark:bg-slate-800 rounded-2xl font-black text-[10px] uppercase tracking-widest text-slate-500"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-500/30"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* EDIT POPUP (CENTERED) */}
        {isEditOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              variants={centerModalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative bg-white dark:bg-slate-900 rounded-[40px] p-8 w-full max-w-sm shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <h2 className="text-lg font-black mb-6 uppercase tracking-widest text-center">
                Edit Record
              </h2>
              <div className="space-y-5">
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-[#477A71]/20 rounded-xl py-3 px-4 text-lg font-black outline-none transition-all mt-1"
                  />
                </div>
                <div>
                  <label className="text-[9px] font-black text-slate-400 uppercase ml-1">
                    Note
                  </label>
                  <input
                    type="text"
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    placeholder="Add note..."
                    className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-[#477A71]/20 rounded-xl py-3 px-4 text-sm font-bold outline-none mt-1"
                  />
                </div>
                <div className="grid grid-cols-4 gap-3 py-2">
                  {filteredCategories.map((cat) => {
                    const IconComp =
                      (Icons as any)[cat.icon] ?? Icons.MoreHorizontal;
                    const isSelected = editCategory === cat.name;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setEditCategory(cat.name)}
                        className={`flex flex-col items-center gap-1 transition-all ${isSelected ? "scale-110" : "opacity-30 grayscale"}`}
                      >
                        <div
                          className={`${cat.color} w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm`}
                        >
                          <IconComp size={16} />
                        </div>
                        <span className="text-[8px] font-black truncate w-full text-center">
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={handleSaveEdit}
                  className="w-full py-4 bg-[#477A71] text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-[#477A71]/30"
                >
                  Update
                </button>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="w-full py-3 text-slate-400 font-black text-[9px] uppercase tracking-widest"
                >
                  Cancel
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
