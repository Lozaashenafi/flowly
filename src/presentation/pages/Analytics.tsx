"use client";
import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, BarChart } from "lucide-react";
import { useFlowlyContext } from "../context/FlowlyContext";
import { format, addMonths, subMonths } from "date-fns";
import { motion, AnimatePresence, Variants } from "framer-motion";

const Analytics = () => {
  const { transactions, isLoading } = useFlowlyContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const nextMonth = () => {
    setDirection(1);
    setCurrentDate(addMonths(currentDate, 1));
  };
  const prevMonth = () => {
    setDirection(-1);
    setCurrentDate(subMonths(currentDate, 1));
  };

  const stats = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const monthTransactions = transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });

    const getTypeValue = (t: any) =>
      typeof t.type === "string" ? t.type : t.type.value;

    const totals = monthTransactions.reduce(
      (acc, t) => {
        const type = getTypeValue(t);
        const amount = t.amount;

        if (type === "income") acc.income += amount;
        else if (type === "expense") acc.expense += amount;
        else if (type === "debt") {
          if (t.debtType === "owed") acc.debtOwed += amount;
          else if (t.debtType === "owesMe") acc.debtOwesMe += amount;
        }
        return acc;
      },
      { income: 0, expense: 0, debtOwed: 0, debtOwesMe: 0 }
    );

    return {
      ...totals,
      balance: totals.income - totals.expense,
      hasData: monthTransactions.length > 0,
    };
  }, [transactions, currentDate]);

  const cardContainerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const cardItemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring", // TypeScript now knows this is a valid spring type
        stiffness: 300,
        damping: 24,
      },
    },
  };

  if (isLoading)
    return (
      <div className="p-10 text-center font-bold text-[#477A71]">
        Loading Analytics...
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-slate-800 font-sans pb-32 overflow-x-hidden">
      <header className="px-6 pt-8 pb-4">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold text-gray-800 flex items-center gap-2"
        >
          Analytics
        </motion.h1>
      </header>

      {/* Date Selector */}
      <div className="flex items-center justify-between px-6 py-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={prevMonth}
          className="p-2 hover:bg-white rounded-full shadow-sm transition text-[#477A71] bg-white/50"
        >
          <ChevronLeft className="w-5 h-5" />
        </motion.button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.span
            key={currentDate.toISOString()}
            custom={direction}
            initial={{ opacity: 0, x: direction * 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -20 }}
            className="text-lg font-semibold text-gray-700"
          >
            {format(currentDate, "MMMM yyyy")}
          </motion.span>
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={nextMonth}
          className="p-2 hover:bg-white rounded-full shadow-sm transition text-[#477A71] bg-white/50"
        >
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </div>

      <main className="flex-1 px-4">
        <AnimatePresence mode="wait">
          {!stats.hasData ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-16 space-y-4"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="bg-[#F0BB40]/10 p-4 rounded-2xl"
              >
                <BarChart className="w-12 h-12 text-[#477A71]" />
              </motion.div>
              <div className="text-center">
                <h3 className="font-bold text-lg text-gray-800">
                  No data for this month
                </h3>
                <p className="text-gray-500 text-sm">
                  Add transactions to see your analytics
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="data"
              variants={cardContainerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {/* Total Income Card */}
              <motion.div
                variants={cardItemVariants}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
              >
                <p className="text-[#477A71] font-bold text-xs uppercase tracking-widest mb-1">
                  Total Income
                </p>
                <p className="text-3xl font-bold text-[#477A71]">
                  {stats.income.toLocaleString()} ETB
                </p>
              </motion.div>

              {/* Total Expenses Card */}
              <motion.div
                variants={cardItemVariants}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
              >
                <p className="text-[#F0BB40] font-bold text-xs uppercase tracking-widest mb-1">
                  Total Expenses
                </p>
                <p className="text-3xl font-bold text-[#F0BB40]">
                  {stats.expense.toLocaleString()} ETB
                </p>
              </motion.div>

              {/* Balance Card */}
              <motion.div
                variants={cardItemVariants}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
              >
                <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">
                  Monthly Balance
                </p>
                <p
                  className={`text-3xl font-bold ${
                    stats.balance >= 0 ? "text-[#477A71]" : "text-[#F0BB40]"
                  }`}
                >
                  {stats.balance >= 0 ? "+" : "-"} ETB{" "}
                  {Math.abs(stats.balance).toLocaleString()}
                </p>
              </motion.div>

              {/* Debt Cards */}
              <motion.div
                variants={cardItemVariants}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
              >
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">
                  Debt (I Owe)
                </p>
                <p className="text-3xl font-bold text-[#F0BB40]">
                  {stats.debtOwed.toLocaleString()} ETB
                </p>
              </motion.div>

              <motion.div
                variants={cardItemVariants}
                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"
              >
                <p className="text-[#477A71] font-bold text-xs uppercase tracking-widest mb-1">
                  Debt (Owes Me)
                </p>
                <p className="text-3xl font-bold text-[#477A71]">
                  {stats.debtOwesMe.toLocaleString()} ETB
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Analytics;
