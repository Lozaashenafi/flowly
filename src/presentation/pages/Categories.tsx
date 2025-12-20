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
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
  "bg-red-500",
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

  // New state for delete confirmation popup
  const [deleteConfirmCategory, setDeleteConfirmCategory] =
    useState<Category | null>(null);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const cats = await getCategoriesUseCase.execute();

        if (cats.length === 0) {
          console.log("Seeding default categories...");
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
      color: "bg-emerald-500",
      iconColor: "text-emerald-600",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    const IconComponent = ICON_MAP[category.icon] || MoreHorizontal;
    setEditingCategory({
      ...category,
      iconComponent: IconComponent,
      iconColor: category.color.replace("bg-", "text-").replace("100", "600"),
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!editingCategory || !editingCategory.name.trim()) return;

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

  // Updated delete handler with custom popup
  const handleDelete = (category: Category) => {
    setDeleteConfirmCategory(category);
  };

  const confirmDelete = async () => {
    if (!deleteConfirmCategory) return;

    await deleteCategoryUseCase.execute(deleteConfirmCategory);
    await loadCategories();
    setDeleteConfirmCategory(null);
  };

  const cancelDelete = () => {
    setDeleteConfirmCategory(null);
  };

  return (
    <div className="mx-auto pb-32 relative min-h-screen">
      {/* ... rest of your header, tabs, and list remain exactly the same ... */}

      <header className="px-6 pt-8 pb-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          Categories
        </h1>
        <button
          onClick={openCreateModal}
          className="bg-[#477A71] hover:bg-[#0d9488] text-white p-2 rounded-xl transition-colors shadow-sm"
        >
          <Plus size={24} />
        </button>
      </header>

      <div className="px-6 mb-8">
        <div className="bg-[#f1f5f9] p-1.5 rounded-2xl flex gap-1">
          {(["income", "expense", "debt"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 font-semibold text-sm transition-all rounded-xl capitalize ${
                activeTab === tab
                  ? tab === "income"
                    ? "bg-[#477A71] text-white"
                    : tab === "expense"
                    ? "bg-[#f43f5e] text-white"
                    : "bg-[#F0BB40] text-white"
                  : "text-slate-500"
              } shadow-sm`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-6 space-y-4">
        {filteredCategories.length === 0 ? (
          <p className="text-center text-slate-500 py-8">
            No categories yet. Create one!
          </p>
        ) : (
          filteredCategories.map((cat) => {
            const IconComponent = ICON_MAP[cat.icon] || MoreHorizontal;
            const bgColor = cat.color.replace("500", "100");
            const textColor = cat.color.replace("bg-", "text-");

            return (
              <div
                key={cat.id}
                className="bg-white p-4 rounded-2xl border border-slate-100 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-4">
                  <div className={`${bgColor} p-3.5 rounded-2xl`}>
                    <IconComponent className={`${textColor}`} size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-base">
                      {cat.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <div
                        className={`w-2.5 h-2.5 rounded-full ${textColor}`}
                      />
                      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                        {cat.type.value}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-5 text-slate-300">
                  <button
                    onClick={() => openEditModal(cat)}
                    className="hover:text-slate-600 transition-colors"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(cat)}
                    className="hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/40 backdrop-blur-sm p-2 pb-10">
          <div className="bg-white lg:max-w-3xl rounded-t-3xl lg:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom lg:fade-in-zoom duration-300 pb-10 w-full">
            <div className="py-3 flex justify-center lg:hidden">
              <div className="w-12 h-1.5 bg-slate-300 rounded-full" />
            </div>

            <div className="px-5 py-6 lg:p-8">
              <div className="flex justify-between items-center mb-5 lg:mb-6">
                <h2 className="text-xl lg:text-2xl font-bold text-slate-900">
                  {editingCategory.id ? "Edit" : "Create"} Category
                </h2>
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCategory(null);
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 transition"
                >
                  <X className="size-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left: Inputs */}
                <div className="space-y-5">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
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
                      placeholder="e.g. Groceries"
                      className="w-full px-4 py-3 bg-slate-50 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-[#14b8a6] outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                      Icon
                    </label>
                    <div className="grid grid-cols-7 gap-2.5 bg-slate-50 rounded-xl p-3 max-h-48 overflow-y-auto">
                      {ICON_OPTIONS.map((Icon, idx) => (
                        <button
                          key={idx}
                          onClick={() =>
                            setEditingCategory({
                              ...editingCategory,
                              iconComponent: Icon,
                            })
                          }
                          className={`aspect-square rounded-lg flex items-center justify-center transition-all ${
                            editingCategory.iconComponent === Icon
                              ? "bg-[#14b8a6] text-white shadow-md"
                              : "bg-white text-slate-600 hover:bg-slate-100"
                          }`}
                        >
                          <Icon size={20} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Color Picker - Mobile */}
                  <div className="lg:hidden">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 block">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            setEditingCategory({
                              ...editingCategory,
                              color,
                              iconColor: color
                                .replace("bg-", "text-")
                                .replace("500", "600"),
                            })
                          }
                          className={`${color} w-10 h-10 rounded-full shadow-sm hover:scale-110 active:scale-95 transition-transform`}
                        >
                          {editingCategory.color === color && (
                            <Check className="size-5 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Color + Preview (Desktop) */}
                <div className="hidden lg:flex lg:flex-col lg:space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {COLOR_OPTIONS.map((color) => (
                        <button
                          key={color}
                          onClick={() =>
                            setEditingCategory({
                              ...editingCategory,
                              color,
                              iconColor: color
                                .replace("bg-", "text-")
                                .replace("500", "600"),
                            })
                          }
                          className={`${color} w-11 h-11 rounded-full shadow hover:scale-110 active:scale-95 transition-transform`}
                        >
                          {editingCategory.color === color && (
                            <Check className="size-6 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block">
                      Preview
                    </label>
                    <div className="bg-slate-50 rounded-xl p-5 flex items-center gap-5">
                      <div
                        className={`${
                          editingCategory.color?.replace("500", "100") ||
                          "bg-slate-100"
                        } p-4 rounded-xl shadow-sm`}
                      >
                        <editingCategory.iconComponent
                          className={`${
                            editingCategory.iconColor || "text-slate-600"
                          } size-7`}
                        />
                      </div>
                      <div>
                        <div className="font-bold text-lg text-slate-800">
                          {editingCategory.name || "Untitled"}
                        </div>
                        <div className="text-sm text-slate-500 uppercase font-bold tracking-wider">
                          {activeTab}
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
                    className={`${
                      editingCategory.color?.replace("500", "100") ||
                      "bg-slate-100"
                    } p-3.5 rounded-xl shadow-sm`}
                  >
                    <editingCategory.iconComponent
                      className={`${
                        editingCategory.iconColor || "text-slate-600"
                      } size-7`}
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-slate-800">
                      {editingCategory.name || "Untitled"}
                    </div>
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">
                      {activeTab}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingCategory(null);
                  }}
                  className="flex-1 py-3.5 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 py-3.5 rounded-xl font-bold text-white bg-[#14b8a6] hover:bg-[#0d9488] shadow-md transition"
                >
                  {editingCategory.id ? "Update" : "Create"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* New Delete Confirmation Popup */}
      {deleteConfirmCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="bg-rose-100 p-4 rounded-full mb-4">
                <Trash2 className="text-rose-600" size={32} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Delete Category?
              </h3>
              <p className="text-sm text-slate-600 mb-6">
                Are you sure you want to delete "
                <strong>{deleteConfirmCategory.name}</strong>"? This action
                cannot be undone.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={cancelDelete}
                  className="flex-1 py-3 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-3 rounded-xl font-semibold text-white bg-rose-600 hover:bg-rose-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
