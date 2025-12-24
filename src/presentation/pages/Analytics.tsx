"use client";
import React, { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, BarChart } from "lucide-react";
import { useFlowlyContext } from "../context/FlowlyContext";
import { format, addMonths, subMonths } from "date-fns";

const Analytics = () => {
  const { transactions, isLoading } = useFlowlyContext();

  // 1. State for the currently viewed month
  const [currentDate, setCurrentDate] = useState(new Date());

  // 2. Navigation handlers
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  // 3. Dynamic Calculations (Untouched logic)
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

  if (isLoading)
    return (
      <div className="p-10 text-center font-bold text-[#477A71]">
        Loading Analytics...
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-slate-800 font-sans pb-32">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          Analytics
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

      <main className="flex-1 px-4 space-y-4">
        {!stats.hasData ? (
          /* Empty State Section */
          <div className="flex flex-col items-center justify-center py-16 space-y-4">
            <div className="bg-[#F0BB40]/10 p-4 rounded-2xl">
              <BarChart className="w-12 h-12 text-[#477A71]" />
            </div>
            <div className="text-center">
              <h3 className="font-bold text-lg text-gray-800">
                No data for this month
              </h3>
              <p className="text-gray-500 text-sm">
                Add transactions to see your analytics
              </p>
            </div>
          </div>
        ) : (
          /* Stats Grid - Using your color theme and rounded-2xl */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-500">
            {/* Total Income Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-[#477A71] font-bold text-xs uppercase tracking-widest mb-1">
                Total Income
              </p>
              <p className="text-3xl font-bold text-[#477A71]">
                ${stats.income.toLocaleString()}
              </p>
            </div>

            {/* Total Expenses Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-[#F0BB40] font-bold text-xs uppercase tracking-widest mb-1">
                Total Expenses
              </p>
              <p className="text-3xl font-bold text-[#F0BB40]">
                ${stats.expense.toLocaleString()}
              </p>
            </div>

            {/* Balance Card */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-gray-500 font-bold text-xs uppercase tracking-widest mb-1">
                Monthly Balance
              </p>
              <p
                className={`text-3xl font-bold ${
                  stats.balance >= 0 ? "text-[#477A71]" : "text-[#F0BB40]"
                }`}
              >
                {stats.balance >= 0 ? "+" : "-"}$
                {Math.abs(stats.balance).toLocaleString()}
              </p>
            </div>

            {/* Debt: I Owe (Liabilities) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">
                Debt (I Owe)
              </p>
              <p className="text-3xl font-bold text-[#F0BB40]">
                ${stats.debtOwed.toLocaleString()}
              </p>
            </div>

            {/* Debt: Owes Me (Assets) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <p className="text-[#477A71] font-bold text-xs uppercase tracking-widest mb-1">
                Debt (Owes Me)
              </p>
              <p className="text-3xl font-bold text-[#477A71]">
                ${stats.debtOwesMe.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Analytics;
