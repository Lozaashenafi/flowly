// src/presentation/context/FlowlyContext.tsx
// Updated seeding with defaultCategories, added type to Category
"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { IndexedDbTransactionRepository } from "../../infrastructure/repositories/IndexedDbTransactionRepository";
import { IndexedDbCategoryRepository } from "../../infrastructure/repositories/IndexedDbCategoryRepository";
import { GetTransactions } from "../../application/use-cases/getTransactions";
import { AddTransaction } from "../../application/use-cases/AddTransaction";
import { UpdateTransaction } from "../../application/use-cases/UpdateTransaction";
import { DeleteTransaction } from "../../application/use-cases/DeleteTransaction";
import { GetTransactionById } from "../../application/use-cases/GetTransactionById";
import { GetCategoriesUseCase } from "../../application/use-cases/GetCategoriesUseCase";
import { AddCategoryUseCase } from "../../application/use-cases/AddCategoryUseCase";
import { Transaction } from "../../domain/entities/Transaction";
import { Category } from "../../domain/entities/Category";
import { defaultCategories } from "../../data/defaultCategories"; // Import the defaults

interface FlowlyContextType {
  transactions: Transaction[];
  categories: Category[];
  isLoading: boolean;
  getTransaction: (id: string) => Promise<Transaction | null>;
  addTransaction: (txData: Transaction) => Promise<void>;
  updateTransaction: (txData: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (catData: Category) => Promise<void>;
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
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const txRepo = useMemo(() => new IndexedDbTransactionRepository(), []);
  const categoryRepo = useMemo(() => new IndexedDbCategoryRepository(), []);

  const refreshTransactions = useCallback(async () => {
    try {
      const getTransactions = new GetTransactions(txRepo);
      const data = await getTransactions.execute();
      setTransactions(
        data.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
    } catch (error) {
      console.error("Error refreshing transactions:", error);
    }
  }, [txRepo]);

  const refreshCategories = useCallback(async () => {
    try {
      const getCategoriesUseCase = new GetCategoriesUseCase(categoryRepo);
      let data = await getCategoriesUseCase.execute();
      if (data.length === 0) {
        // Seed default categories
        const addCategoryUseCase = new AddCategoryUseCase(categoryRepo);
        for (const def of defaultCategories) {
          await addCategoryUseCase.execute(def);
        }
        data = await getCategoriesUseCase.execute();
      }
      setCategories(data);
    } catch (error) {
      console.error("Error refreshing categories:", error);
    }
  }, [categoryRepo]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      Promise.all([refreshTransactions(), refreshCategories()]).finally(() =>
        setIsLoading(false)
      );
    }
  }, [refreshTransactions, refreshCategories]);

  const getTransaction = useCallback(
    async (id: string) => {
      const getTransactionById = new GetTransactionById(txRepo);
      return getTransactionById.execute(id);
    },
    [txRepo]
  );

  const addTransaction = useCallback(
    async (txData: Transaction) => {
      const addTransactionUseCase = new AddTransaction(txRepo);
      await addTransactionUseCase.execute(txData);
      await refreshTransactions();
    },
    [txRepo, refreshTransactions]
  );

  const updateTransaction = useCallback(
    async (txData: Transaction) => {
      const updateTransactionUseCase = new UpdateTransaction(txRepo);
      await updateTransactionUseCase.execute(txData);
      await refreshTransactions();
    },
    [txRepo, refreshTransactions]
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      const deleteTransactionUseCase = new DeleteTransaction(txRepo);
      await deleteTransactionUseCase.execute(id);
      await refreshTransactions();
    },
    [txRepo, refreshTransactions]
  );

  const addCategory = useCallback(
    async (catData: Category) => {
      const addCategoryUseCase = new AddCategoryUseCase(categoryRepo);
      await addCategoryUseCase.execute(catData);
      await refreshCategories();
    },
    [categoryRepo, refreshCategories]
  );

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
        categories,
        isLoading,
        getTransaction,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
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
