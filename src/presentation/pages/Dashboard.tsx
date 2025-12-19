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
    <div className="bg-gray-50 min-h-screen mb-32">
      <Header />
      <main className="px-4 space-y-8">
        {/* Main Balance Card */}
        <section className="relative overflow-hidden rounded-3xl bg-[#477A71] p-6 text-white shadow-lg">
          <div className="flex items-center gap-2 mb-2 opacity-90">
            <Wallet size={18} className="text-[#F0BB40]" />
            <span className="text-sm font-medium">Current Balance</span>
          </div>
          <h2 className="text-5xl font-bold mb-8">$0.00</h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1 opacity-90">
                <TrendingUp size={14} className="text-[#F0BB40]" />
                <span className="text-xs uppercase tracking-wider">Income</span>
              </div>
              <p className="text-xl font-semibold">$0.00</p>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-1 opacity-90">
                <TrendingDown size={14} className="text-[#F0BB40]" />
                <span className="text-xs uppercase tracking-wider">
                  Expenses
                </span>
              </div>
              <p className="text-xl font-semibold">$0.00</p>
            </div>
          </div>
          {/* Decorative Circle Bubbles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#F0BB40]/20 rounded-full blur-3xl"></div>
        </section>

        {/* Quick Add Section */}
        <section>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">
            Quick Add
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <button className="flex flex-col items-center justify-center gap-2 py-6 rounded-2xl bg-[#477A71] text-white shadow-sm hover:bg-[#3a615a] transition-colors">
              <TrendingUp size={20} className="text-[#F0BB40]" />
              <span className="text-xs font-semibold">Income</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 py-6 rounded-2xl bg-[#F0BB40] text-white shadow-sm hover:bg-[#efad13] transition-colors">
              <TrendingDown size={20} className="text-[#3a615a]" />
              <span className="text-xs font-semibold">Expense</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 py-6 rounded-2xl bg-[#477A71] text-white shadow-sm hover:bg-[#3a615a] transition-colors">
              <CreditCard size={20} className="text-[#F0BB40]" />
              <span className="text-xs font-semibold">Debt</span>
            </button>
          </div>
        </section>

        {/* Recent Transactions Section */}
        <section>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4 px-2">
            Recent Transactions
          </h3>
          <div className="bg-white rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center shadow-sm border border-gray-200">
            <div className="w-16 h-16 bg-[#F0BB40]/10 rounded-full flex items-center justify-center mb-4">
              <div className="rotate-12 bg-[#477A71] p-1 rounded text-white">
                💸
              </div>
            </div>
            <h4 className="font-bold text-gray-800 mb-1">
              No transactions yet
            </h4>

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
