"use client";
import { TrendingUp, TrendingDown, CreditCard, Wallet } from "lucide-react";
import Header from "../components/layout/Header";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();

  const handleAddTransaction = () => {
    router.push("/add");
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24 md:pb-8">
      {" "}
      {/* Space for bottom nav on mobile */}
      <Header />
      <main className="px-4 pt-6 pb-12 space-y-8 max-w-5xl mx-auto">
        {/* Main Balance Card */}
        <section className="relative overflow-hidden rounded-3xl bg-[#477A71] p-5 sm:p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-3 opacity-90">
            <Wallet size={20} className="text-[#F0BB40]" />
            <span className="text-sm sm:text-base font-medium">
              Current Balance
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 sm:mb-8">$0.00</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1 opacity-90">
                <TrendingUp size={16} className="text-[#F0BB40]" />
                <span className="text-xs sm:text-sm uppercase tracking-wider">
                  Income
                </span>
              </div>
              <p className="text-lg sm:text-xl font-semibold">$0.00</p>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1 opacity-90">
                <TrendingDown size={16} className="text-[#F0BB40]" />
                <span className="text-xs sm:text-sm uppercase tracking-wider">
                  Expenses
                </span>
              </div>
              <p className="text-lg sm:text-xl font-semibold">$0.00</p>
            </div>
          </div>

          {/* Decorative bubble */}
          <div className="absolute -top-12 -right-12 w-40 h-40 sm:w-48 sm:h-48 bg-[#F0BB40]/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-[#F0BB40]/10 rounded-full blur-3xl"></div>
        </section>

        {/* Quick Add Section */}
        <section className="px-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            Quick Add
          </h3>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <button className="flex flex-col items-center justify-center gap-2 py-5 sm:py-6 rounded-2xl bg-[#477A71] text-white shadow-sm hover:bg-[#3a615a] transition-colors">
              <TrendingUp className="size-6 sm:size-7 text-[#F0BB40]" />
              <span className="text-xs sm:text-sm font-semibold">Income</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 py-5 sm:py-6 rounded-2xl bg-[#F0BB40] text-[#477A71] shadow-sm hover:bg-[#efad13] transition-colors">
              <TrendingDown className="size-6 sm:size-7 text-[#477A71]" />
              <span className="text-xs sm:text-sm font-semibold">Expense</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 py-5 sm:py-6 rounded-2xl bg-[#477A71] text-white shadow-sm hover:bg-[#3a615a] transition-colors">
              <CreditCard className="size-6 sm:size-7 text-[#F0BB40]" />
              <span className="text-xs sm:text-sm font-semibold">Debt</span>
            </button>
          </div>
        </section>

        {/* Recent Transactions Section */}
        <section className="px-2">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
            Recent Transactions
          </h3>
          <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 flex flex-col items-center justify-center text-center shadow-sm border border-gray-200 w-full">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#F0BB40]/10 rounded-full flex items-center justify-center mb-5">
              <div className="rotate-12 bg-[#477A71] p-2 rounded text-white text-2xl">
                💸
              </div>
            </div>
            <h4 className="font-bold text-gray-800 text-lg mb-2">
              No transactions yet
            </h4>
            <p className="text-sm text-gray-600 mb-6 max-w-xs">
              Start tracking your income and expenses to see them here.
            </p>

            <button
              onClick={handleAddTransaction}
              className="bg-[#477A71] text-white px-8 py-3 rounded-2xl font-semibold text-sm shadow-md hover:bg-[#3a615a] transition-colors"
            >
              Add Transaction
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
