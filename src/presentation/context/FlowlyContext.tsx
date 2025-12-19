"use client"; // Mandatory for Next.js context

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { IndexedDbTransactionRepository } from "../../infrastructure/repositories/IndexedDbTransactionRepository";
import { Transaction } from "../../domain/entities/Transaction";

interface FlowlyContextType {
  transactions: Transaction[];
  isLoading: boolean;
  addTransaction: (txData: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  getMonthlyStats: (
    year: number,
    month: number
  ) => { totalIncome: number; totalExpenses: number; balance: number };
}

export const FlowlyContext = createContext<FlowlyContextType | undefined>(
  undefined
);

export function FlowlyProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // FIX: Only instantiate the repo on the client side
  const txRepo = useMemo(() => {
    if (typeof window !== "undefined") {
      return new IndexedDbTransactionRepository();
    }
    return null;
  }, []);

  const refreshData = useCallback(async () => {
    if (!txRepo) return;
    const data = await txRepo.getAll();
    setTransactions(
      data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
    );
  }, [txRepo]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      refreshData().finally(() => setIsLoading(false));
    }
  }, [refreshData]);

  const addTransaction = async (txData: Transaction) => {
    if (txRepo) {
      await txRepo.add(txData);
      await refreshData();
    }
  };

  const deleteTransaction = async (id: string) => {
    if (txRepo) {
      await txRepo.delete(id);
      await refreshData();
    }
  };

  const getMonthlyStats = useCallback(
    (year: number, month: number) => {
      const filtered = transactions.filter((t) => {
        const d = new Date(t.date);
        return d.getFullYear() === year && d.getMonth() === month;
      });

      const income = filtered
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + t.amount, 0);
      const expenses = filtered
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        totalIncome: income,
        totalExpenses: expenses,
        balance: income - expenses,
      };
    },
    [transactions]
  );

  return (
    <FlowlyContext.Provider
      value={{
        transactions,
        isLoading,
        addTransaction,
        deleteTransaction,
        getMonthlyStats,
      }}
    >
      {children}
    </FlowlyContext.Provider>
  );
}

export function useFlowlyContext() {
  const ctx = useContext(FlowlyContext);
  if (!ctx)
    throw new Error("useFlowlyContext must be used within FlowlyProvider");
  return ctx;
}
