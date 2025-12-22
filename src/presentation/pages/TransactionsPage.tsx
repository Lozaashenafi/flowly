"use client";
import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Trash2,
  Edit3,
  Search,
  Filter,
} from "lucide-react";
import { useFlowlyContext } from "../context/FlowlyContext";
import { useRouter } from "next/navigation";
import { format, addMonths, subMonths } from "date-fns";

const TransactionsPage = () => {
  const router = useRouter();
  const { transactions, deleteTransaction, isLoading } = useFlowlyContext();

  // 1. Navigation State
  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // 2. Filter Logic
  const filteredTransactions = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return transactions.filter((t) => {
      const d = new Date(t.date);
      return d.getFullYear() === year && d.getMonth() === month;
    });
  }, [transactions, currentDate]);

  // 3. Totals for the selected month
  const monthTotals = useMemo(() => {
    return filteredTransactions.reduce(
      (acc, t) => {
        const type =
          typeof t.type === "string" ? t.type : (t.type as any).value;
        if (type === "income") acc.income += t.amount;
        if (type === "expense") acc.expense += t.amount;
        return acc;
      },
      { income: 0, expense: 0 }
    );
  }, [filteredTransactions]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      await deleteTransaction(id);
    }
  };

  if (isLoading)
    return <div className="p-10 text-center text-slate-400">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#FDFCFB] pb-32">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 flex items-center justify-between">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Transactions
        </h1>
        <button
          onClick={() => router.push("/add")}
          className="bg-[#477A71] text-white p-2.5 rounded-2xl shadow-lg"
        >
          <Filter size={20} />
        </button>
      </header>

      {/* Month Selector */}
      <div className="px-6 mb-6">
        <div className="bg-white border-2 border-slate-50 rounded-3xl p-2 flex items-center justify-between shadow-sm">
          <button
            onClick={prevMonth}
            className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="text-center">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
              Viewing Period
            </p>
            <span className="text-base font-bold text-slate-800">
              {format(currentDate, "MMMM yyyy")}
            </span>
          </div>
          <button
            onClick={nextMonth}
            className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Monthly Summary Bar */}
      <div className="px-6 mb-8 grid grid-cols-2 gap-4">
        <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-2xl">
          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1">
            Monthly Income
          </p>
          <p className="text-lg font-black text-emerald-700">
            +${monthTotals.income.toLocaleString()}
          </p>
        </div>
        <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl">
          <p className="text-[9px] font-black text-rose-600 uppercase tracking-widest mb-1">
            Monthly Expense
          </p>
          <p className="text-lg font-black text-rose-700">
            -${monthTotals.expense.toLocaleString()}
          </p>
        </div>
      </div>

      <main className="px-4 space-y-4">
        {filteredTransactions.length === 0 ? (
          <div className="py-20 text-center">
            <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">
              🗓️
            </div>
            <h3 className="text-lg font-bold text-slate-800">
              No records found
            </h3>
            <p className="text-sm text-slate-400">
              No transactions for {format(currentDate, "MMMM")}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((tx) => {
              const txType =
                typeof tx.type === "string" ? tx.type : (tx.type as any).value;
              const isIncome =
                txType === "income" ||
                (txType === "debt" && (tx as any).debtType === "owed");

              return (
                <div
                  key={tx.id}
                  className="bg-white p-5 rounded-2xl border-2 border-slate-50 shadow-sm flex flex-col gap-4 group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`p-3 rounded-2xl ${
                          txType === "income"
                            ? "bg-emerald-500 text-white"
                            : txType === "debt"
                            ? "bg-slate-800 text-white"
                            : "bg-rose-500 text-white"
                        } shadow-lg`}
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
                              {(tx as any).debtType === "owed"
                                ? "Owed"
                                : "Owes Me"}
                            </span>
                          )}
                        </h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                          {format(new Date(tx.date), "EEEE, MMM dd")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p
                        className={`text-lg font-black ${
                          isIncome ? "text-emerald-500" : "text-rose-500"
                        }`}
                      >
                        {isIncome ? "+" : "-"}${tx.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {tx.note && (
                    <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-500 font-medium italic">
                        "{tx.note}"
                      </p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-50">
                    <button
                      onClick={() => router.push(`/transactions/edit/${tx.id}`)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 rounded-xl text-slate-600 text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-colors"
                    >
                      <Edit3 size={14} /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-rose-50 rounded-xl text-rose-600 text-[10px] font-black uppercase tracking-widest hover:bg-rose-100 transition-colors"
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default TransactionsPage;
