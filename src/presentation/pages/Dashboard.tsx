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

  // 1. Move useEffect to the top
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

      // Handle Value Objects (checking if it's a string or an object with .value)
      const type = typeof t.type === "string" ? t.type : (t.type as any).value;
      const dType = t.debtType
        ? typeof t.debtType === "string"
          ? t.debtType
          : (t.debtType as any).value
        : null;

      const amount = t.amount;

      // --- 1. ALL-TIME BALANCE (Cash on Hand) ---
      if (type === "income") {
        allTimeBalance += amount;
      } else if (type === "expense") {
        allTimeBalance -= amount;
      } else if (type === "debt") {
        if (dType === "owed") {
          // You borrowed money: Cash in pocket increases
          allTimeBalance += amount;
        } else if (dType === "owesMe") {
          // You lent money: Cash in pocket decreases
          allTimeBalance -= amount;
        }
      }

      // --- 2. YEARLY TOTALS (Current Ethiopian Year) ---
      if (txEth.year === nowEth.year) {
        if (type === "income") {
          yearlyIncome += amount;
        } else if (type === "expense") {
          yearlyExpense += amount;
        }
      }
    });

    return {
      totalIncome: yearlyIncome,
      totalExpenses: yearlyExpense,
      balance: allTimeBalance,
    };
  }, [transactions]);

  // 3. Define other memos before any returns
  const recentTransactions = useMemo(() => {
    return transactions.slice(0, 4);
  }, [transactions]);

  // 4. NOW handle the loading state
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-slate-950">
        <p className="text-[#477A71] font-bold animate-pulse">
          Loading Dashboard...
        </p>
      </div>
    );
  }

  // Animation Variants
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
              className="p-2 hover:bg-white/10 rounded-full transition-all active:scale-90"
            >
              {showBalance ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <motion.h2 className="text-4xl sm:text-5xl font-bold mb-6 sm:mb-8">
            {showBalance ? `${stats.balance.toLocaleString()} ETB` : "••••••••"}
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
                {showBalance
                  ? `${stats.totalIncome.toLocaleString()} ETB`
                  : "••••"}
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

        {/* Recent Transactions */}
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
              recentTransactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gray-100 dark:border-slate-800 flex justify-between items-center"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded-lg">
                      <Wallet size={18} className="text-[#477A71]" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">{tx.category}</p>
                      <p className="text-[10px] text-slate-400">
                        {formatEth(tx.date)}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-slate-800 dark:text-white">
                    {showBalance
                      ? `${tx.amount.toLocaleString()} ETB`
                      : "••••••"}
                  </p>
                </div>
              ))
            )}
          </div>
        </motion.section>
      </motion.main>
    </div>
  );
};

export default Dashboard;
