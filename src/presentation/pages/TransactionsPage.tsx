"use client";
import React, { useState, useMemo, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Trash2,
  Edit3,
  Filter,
  AlertTriangle,
  X,
  Calendar,
  Edit3 as EditIcon,
} from "lucide-react";
import * as Icons from "lucide-react";
import { useFlowlyContext } from "../context/FlowlyContext";
import { format, addMonths, subMonths } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "../../domain/entities/Transaction";

const TransactionsPage = () => {
  const {
    transactions,
    deleteTransaction,
    updateTransaction,
    categories,
    isLoading,
  } = useFlowlyContext();
  const dateInputRef = useRef<HTMLInputElement>(null);

  // --- Page States ---
  const [currentDate, setCurrentDate] = useState(new Date());
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // --- Edit Modal States ---
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editType, setEditType] = useState<any>("expense");
  const [editDebtType, setEditDebtType] = useState<any>("owed");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editNote, setEditNote] = useState("");

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const filteredTransactions = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    return transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [transactions, currentDate]);

  // --- Logic to open Edit Modal ---
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
    <div className="min-h-screen bg-[#FDFCFB] pb-32">
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          Transactions
        </h1>
      </header>

      {/* Date Selector */}
      <div className="flex items-center justify-between px-6 py-4">
        <button
          onClick={prevMonth}
          className="p-1 hover:bg-white rounded-full transition text-[#477A71]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-lg font-semibold text-gray-700">
          {format(currentDate, "MMMM yyyy")}
        </span>
        <button
          onClick={nextMonth}
          className="p-1 hover:bg-white rounded-full transition text-[#477A71]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      <main className="px-4 space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="py-20 text-center text-slate-400 font-bold tracking-widest uppercase text-xs">
            No records found
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx) => {
              const txType =
                typeof tx.type === "string" ? tx.type : (tx.type as any).value;
              const isPos =
                txType === "income" ||
                (txType === "debt" && (tx as any).debtType === "owed");

              return (
                <div
                  key={tx.id}
                  className="bg-white p-5 rounded-[2.5rem] border-2 border-slate-50 shadow-sm flex flex-col gap-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-2xl shadow-lg ${
                          txType === "income"
                            ? "bg-[#477A71] text-white"
                            : txType === "debt"
                            ? "bg-[#F0BB40] text-white"
                            : "bg-[#477A71] text-white"
                        }`}
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
                        isPos ? "text-[#477A71]" : "text-[#F0BB40"
                      }`}
                    >
                      {isPos ? "+" : "-"} {tx.amount.toLocaleString()} ETB
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                    <button
                      onClick={() => openEditModal(tx)}
                      className="flex-1 py-2.5 bg-slate-50 rounded-xl text-slate-600 text-[10px] font-black uppercase tracking-widest transition-colors active:bg-slate-100"
                    >
                      <Edit3 size={14} className="inline mr-1" /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(tx.id)}
                      className="flex-1 py-2.5 bg-rose-50 rounded-xl text-rose-600 text-[10px] font-black uppercase tracking-widest active:bg-rose-100"
                    >
                      <Trash2 size={14} className="inline mr-1" /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <AnimatePresence>
        {/* DELETE POPUP */}
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteId(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-10"
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-6 inset-x-4 bg-white rounded-[2.5rem] p-8 z-10 shadow-2xl max-w-md mx-auto text-center"
            >
              <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">
                Delete?
              </h3>
              <p className="text-sm text-slate-500 mb-8">This is permanent.</p>
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
          </>
        )}

        {/* EDIT POPUP (BOTTOM SHEET) */}
        {isEditOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEditOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-10"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed bottom-0 inset-x-0 bg-[#FDFCFB] rounded-t-[3rem] p-8 z-10 shadow-2xl overflow-y-auto max-h-[90vh] md:max-w-lg md:mx-auto"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8" />
              <h2 className="text-xl font-black text-slate-900 mb-6">
                Edit Transaction
              </h2>

              <div className="space-y-6">
                {/* Type Toggle */}
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

                {/* Amount */}
                <div className="relative group">
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full bg-white border-2 border-slate-50 rounded-2xl py-6 pl-14 pr-6 text-3xl font-black text-slate-800 focus:outline-none"
                  />
                </div>

                {/* Category Selection */}
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
                        <div
                          className={`${
                            cat.color
                          } w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
                            selected
                              ? "ring-4 ring-offset-2 ring-white scale-110"
                              : "opacity-40"
                          }`}
                        >
                          <IconComp size={20} />
                        </div>
                        <span className="text-[9px] font-bold text-slate-400">
                          {cat.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Save Button */}
                <button
                  onClick={handleSaveEdit}
                  className="w-full py-5 rounded-10 bg-[#477A71] text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-[#477A71]/20"
                >
                  Update Record
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TransactionsPage;
