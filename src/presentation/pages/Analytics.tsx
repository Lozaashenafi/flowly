import React from "react";
import {
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart2,
  Layers,
  Settings,
  Plus,
  BarChart,
} from "lucide-react";

const Analytics = () => {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-800 font-sans pb-32">
      {/* Header */}
      <header className="px-6 pt-8 pb-4">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          Analytics
        </h1>
      </header>

      {/* Date Selector */}
      <div className="flex items-center justify-between px-6 py-4">
        <button className="p-1 hover:bg-gray-100 rounded-full transition">
          <ChevronLeft className="w-5 h-5 text-gray-400" />
        </button>
        <span className="text-lg font-semibold">December 2025</span>
        <button className="p-1 hover:bg-gray-100 rounded-full transition">
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      {/* Stats Grid */}
      <main className="flex-1 px-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Total Income Card */}
          <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 shadow-sm">
            <p className="text-emerald-600 font-medium text-sm mb-1">
              Total Income
            </p>
            <p className="text-3xl font-bold text-emerald-500">$0.00</p>
          </div>

          {/* Total Expenses Card */}
          <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100 shadow-sm">
            <p className="text-rose-600 font-medium text-sm mb-1">
              Total Expenses
            </p>
            <p className="text-3xl font-bold text-rose-500">$0.00</p>
          </div>

          {/* Balance Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium text-sm mb-1">Balance</p>
            <p className="text-3xl font-bold text-emerald-500">+$0.00</p>
          </div>

          {/* Total Debt Card */}
          <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100 shadow-sm">
            <p className="text-purple-600 font-medium text-sm mb-1">
              Total Debt
            </p>
            <p className="text-3xl font-bold text-purple-500">$0.00</p>
          </div>
        </div>

        {/* Empty State Section */}
        <div className="flex flex-col items-center justify-center py-16 space-y-4">
          <div className="bg-gray-50 p-4 rounded-2xl">
            <BarChart className="w-12 h-12 text-gray-300" />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg">No data for this month</h3>
            <p className="text-gray-400 text-sm">
              Add transactions to see your analytics
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

// Sub-component for Navigation Items
const NavItem = ({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) => (
  <button
    className={`flex flex-col items-center space-y-1 transition ${
      active ? "text-teal-500" : "text-gray-400 hover:text-gray-600"
    }`}
  >
    {icon}
    <span className="text-[10px] font-medium">{label}</span>
  </button>
);

export default Analytics;
