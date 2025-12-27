"use client";
import React, { useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  Target,
} from "lucide-react";
import Header from "../components/layout/Header";
import { useRouter } from "next/navigation";
import { useFlowlyContext } from "../context/FlowlyContext";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

const Dashboard = () => {
  const router = useRouter();
  const { transactions, getMonthlyStats } = useFlowlyContext();

  const stats = useMemo(() => {
    const now = new Date();
    return getMonthlyStats(now.getFullYear(), now.getMonth());
  }, [transactions, getMonthlyStats]);

  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 4);
  }, [transactions]);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 md:pb-8">
      <Header />
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="px-4 pt-6 pb-12 space-y-8 max-w-5xl mx-auto"
      >
        {/* Main Balance Card */}
        <motion.section
          variants={itemVariants}
          className="relative overflow-hidden rounded-3xl bg-[#477A71] p-5 sm:p-6 text-white shadow-lg"
        >
          <div className="flex items-center gap-2 mb-3 opacity-90">
            <Wallet size={20} className="text-[#F0BB40]" />
            <span className="text-sm sm:text-base font-medium">
              Current Balance
            </span>
          </div>
          <motion.h2
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="text-4xl sm:text-5xl font-bold mb-6 sm:mb-8"
          >
            {stats.balance.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}{" "}
            ETB
          </motion.h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1 opacity-90">
                <TrendingUp size={16} className="text-[#F0BB40]" />
                <span className="text-xs sm:text-sm uppercase tracking-wider">
                  Income
                </span>
              </div>
              <p className="text-lg sm:text-xl font-semibold">
                {stats.totalIncome.toLocaleString()} ETB
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1 opacity-90">
                <TrendingDown size={16} className="text-[#F0BB40]" />
                <span className="text-xs sm:text-sm uppercase tracking-wider">
                  Expenses
                </span>
              </div>
              <p className="text-lg sm:text-xl font-semibold">
                {stats.totalExpenses.toLocaleString()} ETB
              </p>
            </div>
          </div>

          <motion.div
            animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute -top-12 -right-12 w-40 h-40 sm:w-48 sm:h-48 bg-[#F0BB40]/20 rounded-full blur-3xl"
          ></motion.div>
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-[#F0BB40]/10 rounded-full blur-3xl"></div>
        </motion.section>

        {/* Quick Add Section - UPDATED TO 4 COLUMNS */}
        <motion.section variants={itemVariants} className="px-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {[
              {
                label: "Income",
                icon: TrendingUp,
                color: "bg-[#477A71]",
                iconCol: "text-[#F0BB40]",
                textCol: "text-white",
                path: "/add",
              },
              {
                label: "Expense",
                icon: TrendingDown,
                color: "bg-[#F0BB40]",
                iconCol: "text-[#477A71]",
                textCol: "text-[#477A71]",
                path: "/add",
              },
              {
                label: "Debt",
                icon: CreditCard,
                color: "bg-[#477A71]",
                iconCol: "text-[#F0BB40]",
                textCol: "text-white",
                path: "/debt",
              },
              {
                label: "Budget",
                icon: Target,
                color: "bg-[#F0BB40]",
                iconCol: "text-[#477A71]",
                textCol: "text-[#477A71]",
                path: "/budget",
              },
            ].map((btn, idx) => (
              <motion.button
                key={idx}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(btn.path)}
                className={`flex flex-col items-center justify-center gap-2 py-4 sm:py-6 rounded-2xl ${btn.color} ${btn.textCol} shadow-sm transition-colors`}
              >
                <btn.icon className={`size-5 sm:size-7 ${btn.iconCol}`} />
                <span className="text-[10px] sm:text-xs font-bold">
                  {btn.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Recent Transactions Section */}
        <motion.section variants={itemVariants} className="px-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
              Recent Transactions
            </h3>
            <button
              onClick={() => router.push("/transactions")}
              className="text-xs font-bold text-[#477A71] hover:underline transition-all"
            >
              View All
            </button>
          </div>

          <AnimatePresence mode="wait">
            {transactions.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white rounded-[2.5rem] p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-sm border border-gray-200 w-full"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F0BB40]/10 rounded-full flex items-center justify-center mb-5">
                  <div className="rotate-12 bg-[#477A71] p-2 rounded text-white text-2xl">
                    <Wallet size={28} />
                  </div>
                </div>
                <h4 className="font-bold text-gray-800 text-lg mb-2">
                  No transactions yet
                </h4>
                <p className="text-sm text-gray-600 mb-6 max-w-xs">
                  Start tracking your income and expenses to see them here.
                </p>
                <button
                  onClick={() => router.push("/add")}
                  className="bg-[#477A71] text-white px-8 py-3 rounded-2xl font-semibold text-sm shadow-md hover:bg-[#3a615a] transition-colors"
                >
                  Add Transaction
                </button>
              </motion.div>
            ) : (
              <motion.div key="list" className="space-y-3">
                {recentTransactions.map((tx, idx) => {
                  const txType =
                    typeof tx.type === "string"
                      ? tx.type
                      : (tx.type as any).value;
                  return (
                    <motion.div
                      key={tx.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{
                        opacity: 1,
                        x: 0,
                        transition: { delay: idx * 0.05 },
                      }}
                      className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex justify-between items-center"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            txType === "income"
                              ? "bg-[#477A71]/10 text-[#477A71]"
                              : txType === "debt"
                              ? "bg-slate-100 text-slate-600"
                              : "bg-[#F0BB40]/10 text-[#F0BB40]"
                          }`}
                        >
                          {txType === "income" ? (
                            <TrendingUp size={18} />
                          ) : txType === "debt" ? (
                            <CreditCard size={18} />
                          ) : (
                            <TrendingDown size={18} />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
                            {tx.category}
                            {txType === "debt" && (
                              <span className="text-[8px] font-black uppercase px-1.5 py-0.5 bg-slate-100 rounded text-slate-500">
                                {(tx as any).debtType === "owed"
                                  ? "Owed"
                                  : "Owes Me"}
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-slate-400 font-medium">
                            {format(new Date(tx.date), "MMM dd, yyyy")}
                          </p>
                          {tx.note && (
                            <p className="text-[10px] text-slate-400 font-medium">
                              {tx.note}
                            </p>
                          )}
                        </div>
                      </div>
                      <p
                        className={`font-bold ${
                          txType === "income" ||
                          (txType === "debt" &&
                            (tx as any).debtType === "owesMe")
                            ? "text-[#477A71]"
                            : "text-[#F0BB40]"
                        }`}
                      >
                        {txType === "income" ||
                        (txType === "debt" && (tx as any).debtType === "owesMe")
                          ? "+"
                          : "-"}
                        {tx.amount.toLocaleString()} ETB
                      </p>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>
      </motion.main>
    </div>
  );
};

export default Dashboard;
