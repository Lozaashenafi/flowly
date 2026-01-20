"use client";
import React, { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  BarChart,
  Target,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { useFlowlyContext } from "../context/FlowlyContext";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  toEthiopian,
  ETHIOPIAN_MONTHS,
} from "../../infrastructure/utils/ethiopianDate";

const Analytics = () => {
  const { transactions, getWeeklyBudgetProgress, debts, isLoading } =
    useFlowlyContext();

  // --- Ethiopian Date State ---
  const [ethView, setEthView] = useState(() => {
    const now = toEthiopian(new Date());
    return { year: now.year, month: now.month };
  });

  const [direction, setDirection] = useState(0);

  // --- Handlers (Ethiopian 13-Month Logic) ---
  const nextMonth = () => {
    setDirection(1);
    setEthView((prev) => {
      if (prev.month === 13) {
        return { year: prev.year + 1, month: 1 };
      }
      return { ...prev, month: prev.month + 1 };
    });
  };

  const prevMonth = () => {
    setDirection(-1);
    setEthView((prev) => {
      if (prev.month === 1) {
        return { year: prev.year - 1, month: 13 };
      }
      return { ...prev, month: prev.month - 1 };
    });
  };

  // --- Calculations ---
  const stats = useMemo(() => {
    // Filter transactions that match the selected Ethiopian Month/Year
    const monthTransactions = transactions.filter((t) => {
      const tEth = toEthiopian(t.date);
      return tEth.year === ethView.year && tEth.month === ethView.month;
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
      { income: 0, expense: 0, debtOwed: 0, debtOwesMe: 0 },
    );

    return {
      ...totals,
      balance: totals.income - totals.expense,
      hasData: monthTransactions.length > 0,
    };
  }, [transactions, ethView]);

  const budgetProgress = getWeeklyBudgetProgress();

  const debtPortfolio = useMemo(() => {
    return debts.reduce(
      (acc, d) => {
        if (d.type === "owed") acc.totalOwed += d.remainingAmount;
        else acc.totalOwesMe += d.remainingAmount;
        return acc;
      },
      { totalOwed: 0, totalOwesMe: 0 },
    );
  }, [debts]);

  // Framer Motion Variants
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  if (isLoading)
    return (
      <div className="p-10 text-center font-bold text-[#477A71] dark:text-[#477A71]/80">
        Loading Analytics...
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans pb-32 overflow-x-hidden transition-colors duration-500">
      <header className="px-6 pt-12 pb-6">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-black text-slate-900 dark:text-white tracking-tight"
        >
          Financial <span className="text-[#477A71]">Analytics</span>
        </motion.h1>
      </header>

      {/* Ethiopian Month Selector */}
      <div className="flex items-center justify-between px-6 py-4 mb-4">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={prevMonth}
          className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full shadow-sm text-[#477A71] bg-white/50 dark:bg-slate-900/50"
        >
          <ChevronLeft size={20} />
        </motion.button>

        <AnimatePresence mode="wait" custom={direction}>
          <motion.span
            key={`${ethView.month}-${ethView.year}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-lg font-black text-slate-700 dark:text-slate-200 uppercase tracking-widest"
          >
            {ETHIOPIAN_MONTHS[ethView.month - 1]} {ethView.year}
          </motion.span>
        </AnimatePresence>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={nextMonth}
          className="p-2 hover:bg-white dark:hover:bg-slate-800 rounded-full shadow-sm text-[#477A71] bg-white/50 dark:bg-slate-900/50"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      <main className="flex-1 px-4 space-y-10">
        <AnimatePresence mode="wait">
          {!stats.hasData && budgetProgress.length === 0 ? (
            <motion.div
              key="empty-state"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <BarChart className="w-16 h-16 text-slate-200 dark:text-slate-800 mb-4" />
              <p className="text-slate-400 dark:text-slate-600 font-bold uppercase tracking-widest text-xs">
                No activity in {ETHIOPIAN_MONTHS[ethView.month - 1]}
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="analytics-content"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-10"
            >
              {/* Cash Flow Cards */}
              <div key="monthly-flow-section" className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">
                  Flow: {ETHIOPIAN_MONTHS[ethView.month - 1]}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-slate-900 p-6 rounded-[2rem] border-2 border-slate-50 dark:border-slate-800 shadow-sm"
                  >
                    <p className="text-[#477A71] font-black text-[10px] uppercase tracking-widest mb-1">
                      Total Income
                    </p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">
                      {stats.income.toLocaleString()}{" "}
                      <span className="text-sm font-bold text-slate-300">
                        ETB
                      </span>
                    </p>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-slate-50 dark:border-slate-800 shadow-sm"
                  >
                    <p className="text-[#F0BB40] font-black text-[10px] uppercase tracking-widest mb-1">
                      Total Expenses
                    </p>
                    <p className="text-3xl font-black text-slate-900 dark:text-white">
                      {stats.expense.toLocaleString()}{" "}
                      <span className="text-sm font-bold text-slate-300">
                        ETB
                      </span>
                    </p>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-slate-900 p-6 rounded-2xl border-2 border-slate-50 dark:border-slate-800 shadow-sm md:col-span-2"
                  >
                    <p className="text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-widest mb-1">
                      Monthly Balance
                    </p>
                    <p
                      className={`text-4xl font-black ${stats.balance >= 0 ? "text-[#477A71]" : "text-rose-500"}`}
                    >
                      {stats.balance >= 0 ? "+" : "-"}
                      {Math.abs(stats.balance).toLocaleString()}{" "}
                      <span className="text-sm font-bold opacity-30">ETB</span>
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* SECTION 2: BUDGET COMPLIANCE (Weekly) */}
              {budgetProgress.length > 0 && (
                <div key="budget-pulse-section" className="space-y-4">
                  <div className="flex items-center gap-2 ml-2">
                    <Target size={14} className="text-[#477A71]" />
                    <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                      Budget Performance
                    </h3>
                  </div>
                  <motion.div
                    variants={itemVariants}
                    className="bg-white dark:bg-slate-900 p-6 rounded-[2.5rem] border-2 border-slate-50 dark:border-slate-800 shadow-sm space-y-6"
                  >
                    {budgetProgress.map((item: any, index: number) => (
                      <div
                        key={item.categoryId || `budget-${index}`}
                        className="space-y-2"
                      >
                        <div className="flex justify-between items-end">
                          <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                            {item.category}
                          </span>
                          <span
                            className={`text-[10px] font-black ${item.isOver ? "text-rose-500" : "text-[#477A71]"}`}
                          >
                            {item.spent.toLocaleString()} /{" "}
                            {Math.round(item.target).toLocaleString()} ETB
                          </span>
                        </div>
                        <div className="h-2 w-full bg-slate-50 dark:bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.percentage}%` }}
                            className={`h-full ${item.isOver ? "bg-rose-400" : "bg-[#477A71]"}`}
                          />
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </div>
              )}

              {/* SECTION 3: DEBT PORTFOLIO (Total) */}
              <div key="debt-portfolio-section" className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] ml-2">
                  Debt Portfolio (Total)
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    variants={itemVariants}
                    className="bg-rose-50/50 dark:bg-rose-950/20 p-6 rounded-[2rem] border border-rose-100 dark:border-rose-900/30"
                  >
                    <div className="flex items-center gap-2 mb-2 text-rose-500 dark:text-rose-400">
                      <ArrowUpRight size={14} />
                      <p className="font-black text-[9px] uppercase tracking-widest">
                        I Owe
                      </p>
                    </div>
                    <p className="text-2xl font-black text-rose-600 dark:text-rose-400">
                      {debtPortfolio.totalOwed.toLocaleString()}
                    </p>
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="bg-emerald-50/50 dark:bg-emerald-950/20 p-6 rounded-[2rem] border border-emerald-100 dark:border-emerald-900/30"
                  >
                    <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400">
                      <ArrowDownLeft size={14} />
                      <p className="font-black text-[9px] uppercase tracking-widest">
                        Owes Me
                      </p>
                    </div>
                    <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                      {debtPortfolio.totalOwesMe.toLocaleString()}
                    </p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Analytics;
