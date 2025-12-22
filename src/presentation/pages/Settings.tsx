"use client";

import React, { useState } from "react";
import {
  Download,
  Trash2,
  Smartphone,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useFlowlyContext } from "../context/FlowlyContext";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../../app/logo.png";

export default function Settings() {
  const { transactions, categories, deleteTransaction } = useFlowlyContext();

  // Modal States
  const [modalType, setModalType] = useState<
    "clear" | "install" | "success" | null
  >(null);
  const [statusMsg, setStatusMsg] = useState("");

  // Logic for Exporting Data
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

  // Logic for Clearing Data
  const handleClearData = async () => {
    try {
      // Loop through and delete (Ideally your repo should have a clearAll method)
      await Promise.all(transactions.map((tx) => deleteTransaction(tx.id)));
      setModalType("success");
      setStatusMsg("All data has been wiped.");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      <header className="px-6 pt-12 pb-6">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          Settings
        </h1>
      </header>

      <main className="px-4 space-y-6 max-w-5xl mx-auto">
        {/* App Info Card */}
        <section className="bg-white rounded-[2.5rem] p-8 text-center border-2 border-slate-50 shadow-sm">
          <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-3xl flex items-center justify-center shadow-lg shadow-[#477A71]/20">
            <img src={logo.src} alt="Flowly Logo" className="w-24" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 mb-1">Flowly</h1>

          <div className="flex items-center justify-center gap-10">
            <div className="text-center">
              <p className="font-black text-2xl text-slate-900">
                {transactions.length}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                Records
              </p>
            </div>
            <div className="w-px h-10 bg-slate-100" />
            <div className="text-center">
              <p className="font-black text-2xl text-slate-900">
                {categories.length}
              </p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                Categories
              </p>
            </div>
          </div>
        </section>

        {/* Action Buttons */}
        <section className="space-y-4">
          {/* Install App */}
          <button
            onClick={() => setModalType("install")}
            className="w-full bg-white rounded-3xl p-5 flex items-center justify-between border-2 border-slate-50 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600">
                <Smartphone size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900">Install App</p>
                <p className="text-xs font-medium text-slate-400">
                  Use Flowly as a native app
                </p>
              </div>
            </div>
            <div className="bg-[#477A71] text-white p-2 rounded-xl">
              <PlusIcon size={20} />
            </div>
          </button>

          {/* Export Data */}
          <button
            onClick={handleExport}
            className="w-full bg-white rounded-3xl p-5 flex items-center justify-between border-2 border-slate-50 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600">
                <Download size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold text-slate-900">Export Data</p>
                <p className="text-xs font-medium text-slate-400">
                  Save data to JSON file
                </p>
              </div>
            </div>
            <div className="border-2 border-slate-100 text-slate-400 p-2 rounded-xl">
              <Download size={20} />
            </div>
          </button>

          {/* Clear All Data */}
          <button
            onClick={() => setModalType("clear")}
            className="w-full bg-white rounded-3xl p-5 flex items-center justify-between border-2 border-slate-50 shadow-sm active:scale-[0.98] transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500">
                <Trash2 size={24} />
              </div>
              <div className="text-left">
                <p className="font-bold text-rose-600">Clear All Data</p>
                <p className="text-xs font-medium text-slate-400">
                  Wipe all transactions
                </p>
              </div>
            </div>
          </button>
        </section>

        <section className="text-center py-10 opacity-40">
          <p className="text-xs text-gray-500 mt-2">
            All data is stored locally on your device.
          </p>

          <p className="text-[10px] font-medium text-slate-400 mt-2">
            Made with ❤️ in Ethiopa
          </p>
        </section>
      </main>

      {/* CUSTOM POPUPS */}
      <AnimatePresence>
        {modalType && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setModalType(null)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100]"
            />
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-6 inset-x-4 bg-white rounded-[2.5rem] p-8 z-[101] shadow-2xl max-w-md mx-auto"
            >
              {/* CLEAR DATA MODAL */}
              {modalType === "clear" && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">
                    Are you sure?
                  </h3>
                  <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                    This will permanently delete all transactions. This action
                    cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setModalType(null)}
                      className="flex-1 py-4 rounded-2xl font-bold bg-slate-100 text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleClearData}
                      className="flex-1 py-4 rounded-2xl font-bold bg-rose-500 text-white shadow-lg shadow-rose-200"
                    >
                      Delete All
                    </button>
                  </div>
                </div>
              )}

              {/* INSTALL MODAL */}
              {modalType === "install" && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Info size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">
                    Install App
                  </h3>
                  <p className="text-sm text-slate-500 mb-8 leading-relaxed">
                    To use Flowly like a native app, please select{" "}
                    <span className="font-bold text-slate-900">
                      "Add to Home Screen"
                    </span>{" "}
                    from your browser menu.
                  </p>
                  <button
                    onClick={() => setModalType(null)}
                    className="w-full py-4 rounded-2xl font-bold bg-slate-900 text-white"
                  >
                    Got it
                  </button>
                </div>
              )}

              {/* SUCCESS MODAL */}
              {modalType === "success" && (
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">
                    Done!
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
          </>
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
