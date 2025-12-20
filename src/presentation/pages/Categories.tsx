"use client";

import React, { useState } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  Receipt,
  GraduationCap,
  Gamepad2,
  UtensilsCrossed,
  HeartPulse,
  MoreHorizontal,
  ShoppingBag,
  Bus,
  DollarSign,
  Wallet,
  PiggyBank,
  Briefcase,
  HandCoins,
  CreditCard,
  X,
  Check,
  Car,
  Film,
  Banknote,
  Heart,
  Home,
  Users,
  FileText,
  Coffee,
  Plane,
  Music,
  Shirt,
  TrendingUp,
  Gift,
} from "lucide-react";

const ICON_OPTIONS = [
  Briefcase,
  Monitor,
  TrendingUp,
  Gift,
  Plus,
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Film,
  Banknote,
  Heart,
  GraduationCap,
  MoreHorizontal,
  CreditCard,
];

const COLOR_OPTIONS = [
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
];

const ALL_CATEGORIES = {
  income: [
    {
      name: "Salary",
      type: "Income",
      color: "bg-emerald-100",
      icon: Briefcase,
      iconColor: "text-emerald-600",
    },
    {
      name: "Freelance",
      type: "Income",
      color: "bg-teal-100",
      icon: Wallet,
      iconColor: "text-teal-600",
    },
    {
      name: "Investments",
      type: "Income",
      color: "bg-green-100",
      icon: DollarSign,
      iconColor: "text-green-600",
    },
    {
      name: "Gifts",
      type: "Income",
      color: "bg-lime-100",
      icon: HandCoins,
      iconColor: "text-lime-600",
    },
    {
      name: "Other Income",
      type: "Income",
      color: "bg-slate-100",
      icon: MoreHorizontal,
      iconColor: "text-slate-500",
    },
  ],
  expense: [
    {
      name: "Bills & Utilities",
      type: "Expense",
      color: "bg-blue-100",
      icon: Receipt,
      iconColor: "text-blue-500",
    },
    {
      name: "Education",
      type: "Expense",
      color: "bg-teal-100",
      icon: GraduationCap,
      iconColor: "text-teal-500",
    },
    {
      name: "Entertainment",
      type: "Expense",
      color: "bg-purple-100",
      icon: Gamepad2,
      iconColor: "text-purple-500",
    },
    {
      name: "Food & Dining",
      type: "Expense",
      color: "bg-orange-100",
      icon: UtensilsCrossed,
      iconColor: "text-orange-500",
    },
    {
      name: "Health",
      type: "Expense",
      color: "bg-rose-100",
      icon: HeartPulse,
      iconColor: "text-rose-500",
    },
    {
      name: "Other",
      type: "Expense",
      color: "bg-slate-100",
      icon: MoreHorizontal,
      iconColor: "text-slate-500",
    },
    {
      name: "Shopping",
      type: "Expense",
      color: "bg-pink-100",
      icon: ShoppingBag,
      iconColor: "text-pink-500",
    },
    {
      name: "Transport",
      type: "Expense",
      color: "bg-blue-100",
      icon: Bus,
      iconColor: "text-blue-600",
    },
  ],
  debt: [
    {
      name: "Credit Card",
      type: "Debt",
      color: "bg-red-100",
      icon: CreditCard,
      iconColor: "text-red-600",
    },
    {
      name: "Loan Repayment",
      type: "Debt",
      color: "bg-rose-100",
      icon: PiggyBank,
      iconColor: "text-rose-600",
    },
    {
      name: "Mortgage",
      type: "Debt",
      color: "bg-orange-100",
      icon: Receipt,
      iconColor: "text-orange-600",
    },
    {
      name: "Other Debt",
      type: "Debt",
      color: "bg-slate-100",
      icon: MoreHorizontal,
      iconColor: "text-slate-500",
    },
  ],
};

type TabType = "income" | "expense" | "debt";

export default function Categories() {
  const [activeTab, setActiveTab] = useState<TabType>("expense");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const currentCategories = ALL_CATEGORIES[activeTab];

  const handleEditClick = (cat: any) => {
    setEditingItem({ ...cat });
    setIsEditOpen(true);
  };

  return (
    <div className="mx-auto pb-32 relative min-h-screen">
      <header className="px-6 pt-8 pb-4  flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          Categories
        </h1>
        <button className="bg-[#14b8a6] hover:bg-[#0d9488] text-white p-2 rounded-xl transition-colors shadow-sm">
          <Plus size={24} />
        </button>
      </header>

      {/* Segment Control */}
      <div className="px-6 mb-8">
        <div className="bg-[#f1f5f9] p-1.5 rounded-2xl flex gap-1">
          {["income", "expense", "debt"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as TabType)}
              className={`flex-1 py-2.5 font-semibold text-sm transition-all rounded-xl capitalize ${
                activeTab === tab
                  ? `${
                      tab === "income"
                        ? "bg-[#14b8a6]"
                        : tab === "expense"
                        ? "bg-[#f43f5e]"
                        : "bg-[#dc2626]"
                    } text-white shadow-sm`
                  : "text-slate-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Categories List */}
      <div className="px-6 space-y-4">
        {currentCategories.map((cat, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div
                className={`${cat.color} p-3.5 rounded-2xl flex items-center justify-center`}
              >
                <cat.icon className={`${cat.iconColor}`} size={24} />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">
                  {cat.name}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div
                    className={`w-2.5 h-2.5 rounded-full ${cat.iconColor.replace(
                      "text",
                      "bg"
                    )}`}
                  />
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    {cat.type}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-5 text-slate-300 mr-2">
              <Pencil
                size={20}
                className="cursor-pointer hover:text-slate-500 transition-colors"
                onClick={() => handleEditClick(cat)}
              />
              <Trash2
                size={20}
                className="cursor-pointer hover:text-rose-500 transition-colors"
              />
            </div>
          </div>
        ))}
      </div>
      {isEditOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/40 backdrop-blur-sm p-2 pb-10">
          {/* Modal Container - Compact on all screens */}
          <div
            className="
      bg-white   lg:max-w-3xl 
      rounded-t-3xl lg:rounded-3xl 
      shadow-2xl overflow-hidden 
      animate-in 
      slide-in-from-bottom lg:fade-in-zoom 
      duration-300  pb-10
    "
          >
            {/* Mobile Pull Indicator */}
            <div className="py-3 flex justify-center lg:hidden">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            <div className="px-5 py-6 lg:p-8">
              {/* Header */}
              <div className="flex justify-between items-center mb-5 lg:mb-6">
                <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
                  Edit Category
                </h2>
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="size-6" />
                </button>
              </div>

              {/* Responsive Grid: 1 col mobile → 2 col desktop (compact) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Inputs */}
                <div className="space-y-5">
                  {/* Name */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editingItem.name}
                      onChange={(e) =>
                        setEditingItem({ ...editingItem, name: e.target.value })
                      }
                      placeholder="e.g. Groceries"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-[#14b8a6] outline-none"
                    />
                  </div>

                  {/* Icon Picker */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                      Icon
                    </label>
                    <div className="grid grid-cols-7 gap-2.5 bg-slate-50 rounded-xl p-3 max-h-48 overflow-y-auto">
                      {ICON_OPTIONS.map((Icon, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            setEditingItem({ ...editingItem, icon: Icon })
                          }
                          className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                            editingItem.icon === Icon
                              ? "bg-[#14b8a6] text-white shadow-md"
                              : "bg-white text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <Icon className="size-5" size={10} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Picker - Mobile Only */}
                  <div className="lg:hidden">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {COLOR_OPTIONS.map((colorClass) => (
                        <button
                          key={colorClass}
                          onClick={() =>
                            setEditingItem({
                              ...editingItem,
                              color: colorClass.replace("500", "100"),
                              iconColor: colorClass.replace("bg", "text"),
                            })
                          }
                          className={`${colorClass} w-10 h-10 rounded-full shadow-sm hover:scale-110 active:scale-95 transition-transform`}
                        >
                          {editingItem.iconColor ===
                            colorClass.replace("bg", "text") && (
                            <Check className="size-5 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Color + Preview (Desktop Only) */}
                <div className="hidden lg:flex lg:flex-col lg:space-y-6">
                  {/* Color Picker */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {COLOR_OPTIONS.map((colorClass) => (
                        <button
                          key={colorClass}
                          onClick={() =>
                            setEditingItem({
                              ...editingItem,
                              color: colorClass.replace("500", "100"),
                              iconColor: colorClass.replace("bg", "text"),
                            })
                          }
                          className={`${colorClass} w-11 h-11 rounded-full shadow hover:scale-110 active:scale-95 transition-transform`}
                        >
                          {editingItem.iconColor ===
                            colorClass.replace("bg", "text") && (
                            <Check className="size-6 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
                      Preview
                    </label>
                    <div className="bg-slate-50 rounded-xl p-5 flex items-center gap-5">
                      <div
                        className={`${editingItem.color} p-4 rounded-xl shadow-sm`}
                      >
                        <editingItem.icon
                          className={`${editingItem.iconColor} size-8`}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-lg text-slate-800">
                          {editingItem.name || "Untitled"}
                        </div>
                        <div className="text-sm text-slate-500 uppercase font-bold tracking-wider">
                          {editingItem.type}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Preview */}
              <div className="lg:hidden mt-6 mb-7">
                <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-4">
                  <div
                    className={`${editingItem.color} p-3.5 rounded-xl shadow-sm`}
                  >
                    <editingItem.icon
                      className={`${editingItem.iconColor} size-7`}
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">
                      {editingItem.name || "Untitled"}
                    </div>
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                      {editingItem.type}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    // Save logic
                    setIsEditOpen(false);
                  }}
                  className="flex-1 py-3.5 rounded-xl font-bold text-white bg-[#14b8a6] hover:bg-[#0d9488] shadow-md transition"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helpers
function Landmark({ size, className }: { size: number; className: string }) {
  return (
    <div className={className}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="3" y1="21" x2="21" y2="21" />
        <line x1="3" y1="7" x2="21" y2="7" />
        <polyline points="3 7 12 2 21 7" />
        <line x1="5" y1="21" x2="5" y2="7" />
        <line x1="9" y1="21" x2="9" y2="7" />
        <line x1="15" y1="21" x2="15" y2="7" />
        <line x1="19" y1="21" x2="19" y2="7" />
      </svg>
    </div>
  );
}

function Monitor({ size, className }: { size: number; className: string }) {
  return (
    <div className={className}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    </div>
  );
}
