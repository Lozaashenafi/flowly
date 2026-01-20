"use client";

import React, { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Plus,
  MoreHorizontal,
  X,
  Check,
  Briefcase,
  Wallet,
  DollarSign,
  HandCoins,
  Receipt,
  GraduationCap,
  Gamepad2,
  UtensilsCrossed,
  HeartPulse,
  ShoppingBag,
  Bus,
  CreditCard,
  PiggyBank,
  Car,
  Film,
  Banknote,
  Heart,
  Home,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { IndexedDbCategoryRepository } from "../../infrastructure/repositories/IndexedDbCategoryRepository";
import { GetCategoriesUseCase } from "../../application/use-cases/GetCategoriesUseCase";
import { AddCategoryUseCase } from "../../application/use-cases/AddCategoryUseCase";
import { UpdateCategoryUseCase } from "../../application/use-cases/UpdateCategoryUseCase";
import { DeleteCategoryUseCase } from "../../application/use-cases/DeleteCategoryUseCase";
import { TransactionTypeVO } from "../../domain/value-objects/TransactionType";
import { Category } from "../../domain/entities/Category";
import { defaultCategories } from "../../data/defaultCategories";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  Briefcase,
  Wallet,
  DollarSign,
  HandCoins,
  Receipt,
  GraduationCap,
  Gamepad2,
  UtensilsCrossed,
  HeartPulse,
  ShoppingBag,
  Bus,
  CreditCard,
  PiggyBank,
  MoreHorizontal,
  Car,
  Film,
  Banknote,
  Heart,
  Home,
};

const ICON_OPTIONS = Object.values(ICON_MAP);

const COLOR_OPTIONS = [
  "bg-[#477A71]",
  "bg-[#F0BB40]",
  "bg-emerald-400",
  "bg-teal-400",
  "bg-blue-400",
  "bg-indigo-400",
  "bg-violet-400",
  "bg-rose-400",
  "bg-slate-400",
];

type TabType = "income" | "expense" | "debt";

const categoryRepo = new IndexedDbCategoryRepository();
const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepo);
const addCategoryUseCase = new AddCategoryUseCase(categoryRepo);
const updateCategoryUseCase = new UpdateCategoryUseCase(categoryRepo);
const deleteCategoryUseCase = new DeleteCategoryUseCase(categoryRepo);

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>("expense");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deleteConfirmCategory, setDeleteConfirmCategory] =
    useState<Category | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const cats = await getCategoriesUseCase.execute();
        if (cats.length === 0) {
          for (const cat of defaultCategories) {
            await addCategoryUseCase.execute(cat);
          }
        }
        const updatedCats = await getCategoriesUseCase.execute();
        setCategories(updatedCats);
      } catch (error) {
        console.error("Failed to initialize categories:", error);
      }
    };
    initializeApp();
  }, []);

  const loadCategories = async () => {
    const cats = await getCategoriesUseCase.execute();
    setCategories(cats);
  };

  const filteredCategories = categories.filter(
    (cat) => cat.type.value === activeTab,
  );

  const openCreateModal = () => {
    setEditingCategory({
      name: "",
      iconComponent: Briefcase,
      color: "bg-[#477A71]",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    const IconComponent = ICON_MAP[category.icon] || MoreHorizontal;
    setEditingCategory({
      ...category,
      iconComponent: IconComponent,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingCategory || !editingCategory.name?.trim()) return;

    const iconName =
      (editingCategory.iconComponent as any)?.displayName ||
      editingCategory.icon ||
      "MoreHorizontal";

    const savedCategory: Category = {
      id: editingCategory.id || crypto.randomUUID(),
      name: editingCategory.name.trim(),
      icon: iconName,
      type: TransactionTypeVO.fromString(activeTab),
      color: editingCategory.color || "bg-slate-500",
      createdAt: editingCategory.createdAt || Date.now(),
    };

    try {
      if (editingCategory.id) {
        // UPDATE DB
        await updateCategoryUseCase.execute(savedCategory);
        // UPDATE LOCAL STATE IMMEDIATELY
        setCategories((prev) =>
          prev.map((c) => (c.id === savedCategory.id ? savedCategory : c)),
        );
      } else {
        // ADD DB
        await addCategoryUseCase.execute(savedCategory);
        // UPDATE LOCAL STATE IMMEDIATELY
        setCategories((prev) => [...prev, savedCategory]);
      }

      setIsModalOpen(false);
      setEditingCategory(null);
    } catch (err) {
      console.error("Save failed", err);
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirmCategory) return;
    try {
      // DELETE DB
      await deleteCategoryUseCase.execute(deleteConfirmCategory);
      // UPDATE LOCAL STATE IMMEDIATELY
      setCategories((prev) =>
        prev.filter((c) => c.id !== deleteConfirmCategory.id),
      );
      setDeleteConfirmCategory(null);
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="mx-auto pb-32 relative min-h-screen bg-gray-50 dark:bg-slate-950 transition-colors duration-500 overflow-x-hidden">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-12 pb-6 flex justify-between items-center"
      >
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Categories
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openCreateModal}
          className="bg-[#477A71] text-white p-3 rounded-2xl shadow-lg"
        >
          <Plus size={24} strokeWidth={3} />
        </motion.button>
      </motion.header>

      {/* TABS */}
      <div className="px-6 mb-8">
        <div className="bg-white dark:bg-slate-900 p-1.5 rounded-2xl flex shadow-sm border border-slate-100 dark:border-slate-800">
          {(["income", "expense", "debt"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 py-3.5 rounded-[18px] text-[11px] font-black uppercase tracking-widest transition-colors z-10 ${
                activeTab === tab
                  ? "text-white"
                  : "text-gray-400 dark:text-slate-500"
              }`}
            >
              <span className="relative z-20">{tab}</span>
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 rounded-[18px] ${
                    tab === "income"
                      ? "bg-[#477A71]"
                      : tab === "expense"
                        ? "bg-[#F0BB40]"
                        : "bg-slate-800"
                  }`}
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* CATEGORY LIST */}
      <div className="px-6 space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredCategories.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border-2 border-dashed border-gray-100 dark:border-slate-800"
            >
              <p className="text-gray-400 dark:text-slate-600 font-bold uppercase text-[10px] tracking-widest">
                No Categories
              </p>
            </motion.div>
          ) : (
            filteredCategories.map((cat) => {
              const IconComponent = ICON_MAP[cat.icon] || MoreHorizontal;
              return (
                <motion.div
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-gray-100 dark:border-slate-800 flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`${cat.color} w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-inner`}
                    >
                      <IconComponent size={26} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-lg">
                        {cat.name}
                      </h4>
                      <p className="text-[10px] text-gray-400 dark:text-slate-500 font-black uppercase tracking-widest">
                        {cat.type.value}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-2 text-gray-300 dark:text-slate-600 hover:text-[#477A71]"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmCategory(cat)}
                      className="p-2 text-gray-300 dark:text-slate-600 hover:text-rose-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* MODAL */}
      <AnimatePresence>
        {isModalOpen && editingCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl w-full max-w-lg relative z-10 overflow-hidden border dark:border-slate-800"
            >
              <div className="px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">
                    {editingCategory.id ? "Edit" : "New"} Category
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                      Name
                    </label>
                    <input
                      autoFocus
                      type="text"
                      value={editingCategory.name || ""}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-6 py-4 bg-gray-50 dark:bg-slate-800 rounded-2xl text-slate-900 dark:text-white font-bold outline-none focus:ring-2 focus:ring-[#477A71] transition-all"
                      placeholder="e.g. Shopping"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                      Icon
                    </label>
                    <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1 scrollbar-hide">
                      {ICON_OPTIONS.map((Icon, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            setEditingCategory({
                              ...editingCategory,
                              iconComponent: Icon,
                            })
                          }
                          className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                            editingCategory.iconComponent === Icon
                              ? "bg-[#477A71] text-white shadow-lg"
                              : "bg-gray-50 dark:bg-slate-800 text-gray-400"
                          }`}
                        >
                          <Icon size={20} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            setEditingCategory({ ...editingCategory, color })
                          }
                          className={`${color} w-9 h-9 rounded-full flex items-center justify-center transition-transform hover:scale-110`}
                        >
                          {editingCategory.color === color && (
                            <Check
                              className="text-white"
                              size={18}
                              strokeWidth={4}
                            />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-4 rounded-2xl font-bold bg-gray-100 dark:bg-slate-800 text-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 py-4 rounded-2xl font-bold text-white bg-[#477A71] shadow-lg"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE MODAL */}
      <AnimatePresence>
        {deleteConfirmCategory && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmCategory(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-xs w-full p-8 text-center relative z-10 border dark:border-slate-800"
            >
              <div className="bg-rose-50 dark:bg-rose-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-rose-500" size={28} />
              </div>
              <h3 className="font-black text-slate-900 dark:text-white text-xl mb-2">
                Delete?
              </h3>
              <p className="text-xs text-gray-500 dark:text-slate-500 mb-6 font-bold uppercase tracking-widest">
                "{deleteConfirmCategory.name}"
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmCategory(null)}
                  className="flex-1 py-3 bg-gray-100 dark:bg-slate-800 text-gray-500 font-bold rounded-xl"
                >
                  No
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-rose-500 text-white font-bold rounded-xl shadow-lg"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
