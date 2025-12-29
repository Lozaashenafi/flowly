"use client";

import React, { useState, useEffect } from "react";
import {
  Download,
  Trash2,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Info,
  Moon,
  Sun,
  Monitor,
} from "lucide-react";
import { useFlowlyContext } from "../context/FlowlyContext";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useTheme } from "next-themes";
import logo from "../../../app/logo.png";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function Settings() {
  const { transactions, categories, deleteTransaction } = useFlowlyContext();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const [modalType, setModalType] = useState<
    "clear" | "install" | "success" | null
  >(null);
  const [statusMsg, setStatusMsg] = useState("");

  useEffect(() => setMounted(true), []);

  const handleExport = () => {
    const data = {
      transactions,
      categories,
      exportedAt: new Date().toISOString(),
      app: "Flowly",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `flowly_backup_${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setStatusMsg("Data exported successfully!");
    setModalType("success");
  };

  const handleClearData = async () => {
    try {
      await Promise.all(transactions.map((tx) => deleteTransaction(tx.id)));
      setModalType("success");
      setStatusMsg("All data has been wiped.");
    } catch (error) {
      console.error(error);
    }
  };

  // Prevent hydration UI mismatch
  if (!mounted) return null;

  return (
    <div className="bg-gray-50 dark:bg-slate-950 min-h-screen pb-32 transition-colors duration-500">
      <motion.header
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="px-6 pt-12 pb-6"
      >
        <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          Settings
        </h1>
      </motion.header>

      <motion.main
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="px-4 space-y-6 max-w-5xl mx-auto"
      >
        {/* APP INFO CARD */}
        <motion.section
          variants={itemVariants}
          className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 text-center border-2 border-slate-50 dark:border-slate-800 shadow-sm"
        >
          <div className="w-20 h-20 mx-auto mb-4 bg-white dark:bg-slate-800 rounded-3xl flex items-center justify-center shadow-lg">
            <img src={logo.src} alt="Flowly Logo" className="w-24" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
            Flowly
          </h1>
          <div className="flex items-center justify-center gap-10 mt-4">
            <div className="text-center">
              <p className="font-black text-2xl text-slate-900 dark:text-white">
                {transactions.length}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase">
                Records
              </p>
            </div>
            <div className="w-px h-10 bg-slate-100 dark:bg-slate-800" />
            <div className="text-center">
              <p className="font-black text-2xl text-slate-900 dark:text-white">
                {categories.length}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase">
                Categories
              </p>
            </div>
          </div>
        </motion.section>

        {/* THEME SWITCHER SECTION (The Toggle Button) */}
        <motion.section variants={itemVariants} className="space-y-3">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Appearance
          </p>
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-2 flex border-2 border-slate-50 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setTheme("light")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all ${
                theme === "light"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md"
                  : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Sun size={18} /> Light
            </button>
            <button
              onClick={() => setTheme("dark")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all ${
                theme === "dark"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md"
                  : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Moon size={18} /> Dark
            </button>
            <button
              onClick={() => setTheme("system")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold transition-all ${
                theme === "system"
                  ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md"
                  : "text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              <Monitor size={18} /> Auto
            </button>
          </div>
        </motion.section>

        {/* ACTION BUTTONS */}
        <motion.section variants={containerVariants} className="space-y-4">
          <button
            onClick={() => setModalType("install")}
            className="w-full bg-white dark:bg-slate-900 rounded-3xl p-5 flex items-center justify-between border-2 border-slate-50 dark:border-slate-800"
          >
            <div className="flex items-center gap-4 text-slate-900 dark:text-white">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                <Smartphone />
              </div>
              <p className="font-bold">Install App</p>
            </div>
            <div className="bg-[#477A71] text-white p-2 rounded-xl">
              <PlusIcon size={20} />
            </div>
          </button>

          <button
            onClick={handleExport}
            className="w-full bg-white dark:bg-slate-900 rounded-3xl p-5 flex items-center justify-between border-2 border-slate-50 dark:border-slate-800"
          >
            <div className="flex items-center gap-4 text-slate-900 dark:text-white">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center">
                <Download />
              </div>
              <p className="font-bold">Export Data</p>
            </div>
            <div className="border-2 border-slate-100 dark:border-slate-700 text-slate-400 p-2 rounded-xl">
              <Download size={20} />
            </div>
          </button>

          <button
            onClick={() => setModalType("clear")}
            className="w-full bg-white dark:bg-slate-900 rounded-3xl p-5 flex items-center justify-between border-2 border-slate-50 dark:border-slate-800"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-2xl flex items-center justify-center">
                <Trash2 />
              </div>
              <p className="font-bold text-rose-600">Clear All Data</p>
            </div>
          </button>
        </motion.section>

        <footer className="text-center py-10 opacity-60">
          <p className="text-xs text-gray-500 dark:text-slate-400">
            All data is stored locally on your device.
          </p>
          <p className="text-[10px] font-medium text-slate-400 mt-2 uppercase tracking-widest">
            Made with ❤️ in Ethiopia
          </p>
        </footer>
      </motion.main>

      {/* POPUPS (Keep your existing AnimatePresence code here) */}
      <AnimatePresence>
        {modalType && (
          // ... (Your existing modal code from previous response)
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setModalType(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 w-full max-w-sm border dark:border-slate-800 shadow-2xl"
            >
              {modalType === "clear" && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                    Are you sure?
                  </h3>
                  <p className="text-sm text-slate-500 mb-8">
                    This action cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setModalType(null)}
                      className="flex-1 py-4 rounded-2xl font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearData}
                      className="flex-1 py-4 rounded-2xl font-bold bg-rose-500 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
              {modalType === "install" && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                    Install App
                  </h3>
                  <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                    Select{" "}
                    <span className="font-bold text-slate-900 dark:text-white">
                      "Add to Home Screen"
                    </span>{" "}
                    from your browser menu.
                  </p>
                  <button
                    onClick={() => setModalType(null)}
                    className="w-full py-4 rounded-2xl font-bold bg-slate-900 dark:bg-white dark:text-slate-900 text-white"
                  >
                    Got it
                  </button>
                </div>
              )}
              {modalType === "success" && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">
                    Success!
                  </h3>
                  <p className="text-sm text-slate-500 mb-8">{statusMsg}</p>
                  <button
                    onClick={() => setModalType(null)}
                    className="w-full py-4 rounded-2xl font-bold bg-[#477A71] text-white"
                  >
                    Close
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const PlusIcon = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
