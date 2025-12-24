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
  "bg-emerald-200",
  "bg-teal-200",
  "bg-blue-200",
  "bg-indigo-200",
  "bg-violet-200",
  "bg-rose-200",
  "bg-slate-200",
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
  const [editingCategory, setEditingCategory] = useState<
    | (Partial<Category> & {
        iconComponent?: React.ComponentType<any>;
        iconColor?: string;
      })
    | null
  >(null);

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
    (cat) => cat.type.value === activeTab
  );

  const openCreateModal = () => {
    setEditingCategory({
      name: "",
      iconComponent: Briefcase,
      color: "bg-[#477A71]",
      iconColor: "text-[#477A71]",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    const IconComponent = ICON_MAP[category.icon] || MoreHorizontal;
    setEditingCategory({
      ...category,
      iconComponent: IconComponent,
      iconColor: category.color.replace("bg-", "text-"),
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingCategory || !editingCategory.name?.trim()) return;
    const iconName =
      editingCategory.iconComponent?.displayName ||
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
    if (editingCategory.id) {
      await updateCategoryUseCase.execute(savedCategory);
    } else {
      await addCategoryUseCase.execute(savedCategory);
    }
    await loadCategories();
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmCategory) return;
    await deleteCategoryUseCase.execute(deleteConfirmCategory);
    await loadCategories();
    setDeleteConfirmCategory(null);
  };

  return (
    <div className="mx-auto pb-32 relative min-h-screen bg-gray-50 overflow-x-hidden">
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 pt-8 pb-4 flex justify-between items-center"
      >
        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          Categories
        </h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={openCreateModal}
          className="bg-[#477A71] hover:bg-[#3a615a] text-white p-2.5 rounded-xl transition-colors shadow-md"
        >
          <Plus size={24} />
        </motion.button>
      </motion.header>

      {/* TABS */}
      <div className="px-6 mb-8">
        <div className="bg-white p-1.5 rounded-2xl flex shadow-sm border border-slate-100 relative">
          {(["income", "expense", "debt"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`relative flex-1 py-3.5 rounded-[20px] text-[11px] font-black uppercase tracking-[0.15em] transition-colors z-10 ${
                activeTab === tab ? "text-white" : "text-gray-400"
              }`}
            >
              <span className="relative z-20">{tab}</span>
              {activeTab === tab && (
                <motion.div
                  layoutId="activeTab"
                  className={`absolute inset-0 rounded-[18px] shadow-sm ${
                    tab === "income"
                      ? "bg-[#477A71]"
                      : tab === "expense"
                      ? "bg-[#F0BB40]"
                      : "bg-[#477A71]"
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
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-3xl p-12 text-center border border-dashed border-gray-200"
            >
              <p className="text-gray-400 font-medium">No categories found.</p>
            </motion.div>
          ) : (
            filteredCategories.map((cat, idx) => {
              const IconComponent = ICON_MAP[cat.icon] || MoreHorizontal;
              return (
                <motion.div
                  key={cat.id}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between shadow-sm active:scale-[0.98] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`${cat.color} w-14 h-14 rounded-2xl flex items-center justify-center transition-colors shadow-inner`}
                    >
                      <IconComponent
                        className="text-white"
                        size={26}
                        strokeWidth={2.5}
                      />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-bold text-gray-800 text-lg leading-tight">
                        {cat.name}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-gray-400 font-black uppercase tracking-[0.15em]">
                          {cat.type.value}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-2 text-gray-300 hover:text-[#477A71] hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmCategory(cat)}
                      className="p-2 text-gray-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
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
          <div className="pb-15 fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: 100, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 100, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl shadow-2xl overflow-hidden w-full max-w-lg relative z-10"
            >
              <div className="px-6 py-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    {editingCategory.id ? "Edit" : "New"} Category
                  </h2>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                      Name
                    </label>
                    <input
                      type="text"
                      value={editingCategory.name || ""}
                      onChange={(e) =>
                        setEditingCategory({
                          ...editingCategory,
                          name: e.target.value,
                        })
                      }
                      className="w-full px-4 py-3 bg-gray-50 rounded-xl text-gray-800 font-bold focus:ring-2 focus:ring-[#477A71] outline-none border border-gray-100"
                      placeholder="Category Name"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                      Icon
                    </label>
                    <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1">
                      {ICON_OPTIONS.map((Icon, idx) => (
                        <motion.button
                          key={idx}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() =>
                            setEditingCategory({
                              ...editingCategory,
                              iconComponent: Icon,
                            })
                          }
                          className={`p-3 rounded-xl flex items-center justify-center transition-all ${
                            editingCategory.iconComponent === Icon
                              ? "bg-[#477A71] text-white"
                              : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                          }`}
                        >
                          <Icon size={20} />
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {COLOR_OPTIONS.map((color) => (
                        <motion.button
                          key={color}
                          whileHover={{ scale: 1.2 }}
                          onClick={() =>
                            setEditingCategory({
                              ...editingCategory,
                              color,
                              iconColor: color.replace("bg-", "text-"),
                            })
                          }
                          className={`${color} w-8 h-8 rounded-full flex items-center justify-center transition-transform`}
                        >
                          {editingCategory.color === color && (
                            <Check className="text-white" size={16} />
                          )}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 py-4 rounded-2xl font-bold text-gray-500 bg-gray-100 hover:bg-gray-200 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSave}
                      className="flex-1 py-4 rounded-2xl font-bold text-white bg-[#477A71] hover:bg-[#3a615a] shadow-lg transition"
                    >
                      {editingCategory.id ? "Save Changes" : "Create Category"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE CONFIRMATION */}
      <AnimatePresence>
        {deleteConfirmCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteConfirmCategory(null)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-xs w-full p-6 text-center relative z-10"
            >
              <div className="bg-rose-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 className="text-rose-500" size={28} />
              </div>
              <h3 className="font-bold text-gray-800 text-lg mb-2">
                Delete Category?
              </h3>
              <p className="text-xs text-gray-500 mb-6 uppercase tracking-widest font-bold">
                "{deleteConfirmCategory.name}"
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirmCategory(null)}
                  className="flex-1 py-3 bg-gray-100 text-gray-500 font-bold rounded-xl"
                >
                  No
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 bg-rose-500 text-white font-bold rounded-xl"
                >
                  Yes, Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
