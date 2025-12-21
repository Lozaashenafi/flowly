"use client";

import React from "react";
import { useFlowlyContext } from "../../context/FlowlyContext";
import { useRouter } from "next/navigation";
import { Transaction } from "../../../domain/entities/Transaction";

const TransactionList = () => {
  const { transactions, deleteTransaction, isLoading } = useFlowlyContext();
  const router = useRouter();

  if (isLoading) {
    return <div className="text-center py-8">Loading transactions...</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        No transactions yet. Add one!
      </div>
    );
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        await deleteTransaction(id);
      } catch (error) {
        console.error("Error deleting:", error);
        alert("Failed to delete transaction");
      }
    }
  };

  return (
    <div className="bg-[#FDFCFB] font-sans p-4 space-y-4">
      <h2 className="text-xl font-bold text-slate-800">Transactions</h2>
      {transactions.map((tx: Transaction) => (
        <div
          key={tx.id}
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex justify-between items-center"
        >
          <div>
            <div className="font-bold text-[#477a71]">
              ${tx.amount.toFixed(2)}
            </div>
            <div className="text-sm text-slate-600">
              {tx.type.toUpperCase()} - {tx.category}
            </div>
            <div className="text-xs text-slate-400">
              {new Date(tx.date).toLocaleString()}
            </div>
            {tx.note && (
              <div className="text-xs text-slate-500 mt-1">{tx.note}</div>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push(`/transactions/edit/${tx.id}`)}
              className="text-blue-600 hover:underline text-sm"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(tx.id)}
              className="text-red-600 hover:underline text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
