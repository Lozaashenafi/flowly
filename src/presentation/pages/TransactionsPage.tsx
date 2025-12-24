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
import { format, addMonths, subMonths, startOfMonth } from "date-fns";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Transaction } from "../../domain/entities/Transaction";

// Animation Variants
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
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

  const [currentDate, setCurrentDate] = useState(startOfMonth(new Date()));
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editType, setEditType] = useState<any>("expense");
  const [editDebtType, setEditDebtType] = useState<any>("owed");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editNote, setEditNote] = useState("");
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const nextMonth = () => {
    setDirection(1);
    setCurrentDate((prev) => startOfMonth(addMonths(prev, 1)));
  };

  const prevMonth = () => {
    setDirection(-1);
    setCurrentDate((prev) => startOfMonth(subMonths(prev, 1)));
  };

  const filteredTransactions = useMemo(() => {
    const start = startOfMonth(currentDate);
    const end = addMonths(start, 1); // exclusive end

    return transactions.filter((t) => {
      const txDate = new Date(t.date);

      // Check if transaction date is within the current month
      return txDate >= start && txDate < end;
    });
  }, [transactions, currentDate]);

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
    <div className="min-h-screen bg-[#FDFCFB] pb-32 overflow-x-hidden">
      <header className="px-6 pt-8 pb-4">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-800 flex items-center gap-2"
        >
          Transactions
        </motion.h1>
      </header>

      {/* Date Selector */}
      <div className="flex items-center justify-between px-6 py-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={prevMonth}
          className="p-2 bg-white rounded-full shadow-sm text-[#477A71]"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>
        <AnimatePresence mode="wait">
          <motion.span
            key={currentDate.toISOString()}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="text-lg font-semibold text-gray-700"
          >
            {format(currentDate, "MMMM yyyy")}
          </motion.span>
        </AnimatePresence>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={nextMonth}
          className="p-2 bg-white rounded-full shadow-sm text-[#477A71]"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      <main className="px-4">
        <AnimatePresence mode="popLayout">
          {filteredTransactions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center text-slate-400 font-bold tracking-widest uppercase text-xs"
            >
              No records found
            </motion.div>
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
                  (txType === "debt" && (tx as any).debtType === "owed");

                return (
                  <motion.div
                    key={tx.id}
                    layout
                    variants={itemVariants}
                    className="bg-white p-5 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex flex-col gap-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 rounded-2xl shadow-lg ${
                            isPos ? "bg-[#477A71]" : "bg-[#F0BB40]"
                          } text-white`}
                        >
                          {txType === "income" ? (
                            <TrendingUp size={20} />
                          ) : txType === "debt" ? (
                            <CreditCard size={20} />
                          ) : (
                            <TrendingDown size={20} />
                          )}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 flex items-center gap-2">
                            {tx.category}
                            {txType === "debt" && (
                              <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">
                                {(tx as any).debtType}
                              </span>
                            )}
                          </h4>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">
                            {format(new Date(tx.date), "EEEE, MMM dd")}
                          </p>
                        </div>
                      </div>
                      <p
                        className={`text-lg font-black ${
                          isPos ? "text-[#477A71]" : "text-[#F0BB40]"
                        }`}
                      >
                        {isPos ? "+" : "-"} {tx.amount.toLocaleString()} ETB
                      </p>
                    </div>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openEditModal(tx)}
                        className="flex-1 py-2.5 bg-slate-50 rounded-xl text-slate-600 text-[10px] font-black uppercase tracking-widest"
                      >
                        <Edit3 size={14} className="inline mr-1" /> Edit
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setDeleteId(tx.id)}
                        className="flex-1 py-2.5 bg-rose-50 rounded-xl text-rose-600 text-[10px] font-black uppercase tracking-widest"
                      >
                        <Trash2 size={14} className="inline mr-1" /> Delete
                      </motion.button>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <AnimatePresence>
        {/* DELETE POPUP */}
        {deleteId && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.9 }}
              className="relative bg-white rounded-[2.5rem] p-8 w-full max-w-md text-center shadow-2xl"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                Delete Record?
              </h3>
              <p className="text-sm text-slate-500 mb-8">
                This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-4 bg-slate-50 rounded-2xl font-bold text-slate-400"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-4 bg-rose-500 text-white rounded-2xl font-bold"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* EDIT POPUP (BOTTOM SHEET) */}
        {isEditOpen && (
          <div className="pb-15 fixed inset-0 z-50 flex items-end justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative bg-[#FDFCFB] rounded-t-[3rem] p-8 w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
              <h2 className="text-xl font-black text-slate-900 mb-6">
                Edit Transaction
              </h2>

              <div className="space-y-6">
                <div className="bg-slate-100 p-1 rounded-2xl flex">
                  {(["income", "expense", "debt"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => {
                        setEditType(t);
                        setEditCategory("");
                      }}
                      className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase transition-all ${
                        editType === t
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-400"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full bg-white border-2 border-slate-50 rounded-2xl py-6 px-6 text-3xl font-black text-slate-800 focus:ring-2 focus:ring-[#477A71] outline-none transition-all"
                  />
                  <span className="absolute right-6 top-1/2 -translate-y-1/2 font-bold text-slate-300">
                    ETB
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3">
                  {filteredCategories.map((cat) => {
                    const IconComp =
                      (Icons as any)[cat.icon] ?? Icons.MoreHorizontal;
                    const selected = editCategory === cat.name;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setEditCategory(cat.name)}
                        className="flex flex-col items-center gap-1.5"
                      >
                        <motion.div
                          animate={{
                            scale: selected ? 1.1 : 1,
                            opacity: selected ? 1 : 0.4,
                          }}
                          className={`${cat.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md`}
                        >
                          <IconComp size={20} />
                        </motion.div>
                        <span
                          className={`text-[9px] font-bold ${
                            selected ? "text-slate-900" : "text-slate-400"
                          }`}
                        >
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveEdit}
                  className="w-full py-5 rounded-2xl bg-[#477A71] text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-[#477A71]/20"
                >
                  Update Record
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionsPage;
