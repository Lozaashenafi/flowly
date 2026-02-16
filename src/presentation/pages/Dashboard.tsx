"use client";
import { useEffect, useMemo, useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  Target,
  Eye,
  EyeOff,
} from "lucide-react";
import Header from "../components/layout/Header";
import { useRouter } from "next/navigation";
import { useFlowlyContext } from "../context/FlowlyContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  formatEth,
  toEthiopian,
} from "../../infrastructure/utils/ethiopianDate";

const Dashboard = () => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const { transactions } = useFlowlyContext();
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = useMemo(() => {
    const nowEth = toEthiopian(new Date());
    let allTimeBalance = 0;
    let yearlyIncome = 0;
    let yearlyExpense = 0;

    transactions.forEach((t) => {
      const txEth = toEthiopian(t.date);
      const type = typeof t.type === "string" ? t.type : (t.type as any).value;
      const dType = t.debtType
        ? typeof t.debtType === "string"
          ? t.debtType
          : (t.debtType as any).value
        : null;

      const amount = t.amount;

      if (type === "income") {
        allTimeBalance += amount;
      } else if (type === "expense") {
        allTimeBalance -= amount;
      } else if (type === "debt") {
        if (dType === "owed") allTimeBalance += amount;
        else if (dType === "owesMe") allTimeBalance -= amount;
      }

      if (txEth.year === nowEth.year) {
        if (type === "income") yearlyIncome += amount;
        else if (type === "expense") yearlyExpense += amount;
      }
    });

    return {
      totalIncome: yearlyIncome,
      totalExpenses: yearlyExpense,
      balance: allTimeBalance,
    };
  }, [transactions]);

  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 4);
  }, [transactions]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950">
        <p className="text-[#477A71] font-bold animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
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
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen pb-24 md:pb-8 transition-colors duration-500">
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
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 opacity-90">
              <Wallet size={20} className="text-[#F0BB40]" />
              <span className="text-sm sm:text-base font-medium">
                Current Balance
              </span>
            </div>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="p-2 hover:bg-white/10 rounded-full transition-all"
            >
              {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <motion.h2 className="text-4xl sm:text-5xl font-bold mb-6 sm:mb-8 tracking-tight">
            {showBalance ? `${stats.balance.toLocaleString()} ETB` : "••••••••"}
          </motion.h2>

          <div className="grid grid-cols-2 gap-4">
            {/* Yearly Income Box - GREEN TINT */}
            <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-emerald-400" />
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold opacity-80">
                  Income
                </span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-emerald-50">
                {showBalance
                  ? `${stats.totalIncome.toLocaleString()} ETB`
                  : "••••"}
              </p>
            </div>
            {/* Yearly Expense Box - RED TINT */}
            <div className="bg-rose-500/20 backdrop-blur-md border border-rose-400/30 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown size={16} className="text-rose-400" />
                <span className="text-[10px] sm:text-xs uppercase tracking-wider font-bold opacity-80">
                  Expenses
                </span>
              </div>
              <p className="text-lg sm:text-xl font-bold text-rose-50">
                {showBalance
                  ? `${stats.totalExpenses.toLocaleString()} ETB`
                  : "••••"}
              </p>
            </div>
          </div>
        </motion.section>

        {/* Quick Actions */}
        <motion.section variants={itemVariants} className="px-2">
          <h3 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-4 gap-2 sm:gap-4">
            {[
              {
                label: "Income",
                icon: TrendingUp,
                color: "bg-[#477A71]",
                path: "/add",
              },
              {
                label: "Expense",
                icon: TrendingDown,
                color: "bg-[#F0BB40]",
                path: "/add",
              },
              {
                label: "Debt",
                icon: CreditCard,
                color: "bg-[#477A71]",
                path: "/debt",
              },
              {
                label: "Budget",
                icon: Target,
                color: "bg-[#F0BB40]",
                path: "/budget",
              },
            ].map((btn, idx) => (
              <motion.button
                key={idx}
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(btn.path)}
                className={`flex flex-col items-center justify-center gap-2 py-4 sm:py-6 rounded-2xl ${btn.color} shadow-sm`}
              >
                <btn.icon className="size-5 sm:size-7 text-white/80" />
                <span className="text-[10px] sm:text-xs font-bold text-white">
                  {btn.label}
                </span>
              </motion.button>
            ))}
          </div>
        </motion.section>

        {/* Recent Transactions - COLORS ADDED HERE */}
        <motion.section variants={itemVariants} className="px-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-gray-500 dark:text-slate-400 uppercase tracking-widest">
              Recent Transactions
            </h3>
            <button
              onClick={() => router.push("/transactions")}
              className="text-xs font-bold text-[#477A71]"
            >
              View All
            </button>
          </div>

          <div className="space-y-3">
            {recentTransactions.length === 0 ? (
              <p className="text-center text-slate-400 py-10">
                No transactions yet
              </p>
            ) : (
              recentTransactions.map((tx) => {
                const type =
                  typeof tx.type === "string"
                    ? tx.type
                    : (tx.type as any).value;

                // Transaction color logic
                let colorClass = "text-[#477A71]";
                let iconBg = "bg-emerald-50 dark:bg-emerald-500/10";
                let Icon = TrendingUp;

                if (type === "expense") {
                  colorClass = "text-rose-500";
                  iconBg = "bg-rose-50 dark:bg-rose-500/10";
                  Icon = TrendingDown;
                } else if (type === "debt") {
                  colorClass = "text-amber-500";
                  iconBg = "bg-amber-50 dark:bg-amber-500/10";
                  Icon = CreditCard;
                }

                return (
                  <div
                    key={tx.id}
                    className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 flex justify-between items-center shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${iconBg}`}>
                        <Icon size={18} className={colorClass} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800 dark:text-white">
                          {tx.category}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {formatEth(tx.date)}
                        </p>
                      </div>
                    </div>
                    <p className={`font-black text-sm ${colorClass}`}>
                      {showBalance
                        ? `${type === "expense" ? "-" : "+"}${tx.amount.toLocaleString()} ETB`
                        : "••••••"}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
};

export default Dashboard;
