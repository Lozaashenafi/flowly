import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { v4 as uuidv4 } from "uuid";
import {
  Transaction,
  Category,
  TransactionType,
  getAllTransactions,
  getAllCategories,
  addTransaction as dbAddTransaction,
  updateTransaction as dbUpdateTransaction,
  deleteTransaction as dbDeleteTransaction,
  addCategory as dbAddCategory,
  updateCategory as dbUpdateCategory,
  deleteCategory as dbDeleteCategory,
  initializeDefaultCategories,
} from "/lib/db";

interface FlowlyContextType {
  transactions: Transaction[];
  categories: Category[];
  isLoading: boolean;
  addTransaction: (
    data: Omit<Transaction, "id" | "createdAt">
  ) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (data: Omit<Category, "id">) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  getCategoriesByType: (type: TransactionType) => Category[];
  getCategoryById: (id: string) => Category | undefined;
  getMonthlyStats: (year: number, month: number) => MonthlyStats;
  refreshData: () => Promise<void>;
}

export interface MonthlyStats {
  totalIncome: number;
  totalExpenses: number;
  totalDebt: number;
  balance: number;
  incomeByCategory: { categoryId: string; amount: number }[];
  expensesByCategory: { categoryId: string; amount: number }[];
  debtByCategory: { categoryId: string; amount: number }[];
  transactionCount: number;
}

const FlowlyContext = createContext<FlowlyContextType | undefined>(undefined);

export function FlowlyProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const refreshData = useCallback(async () => {
    try {
      const [txs, cats] = await Promise.all([
        getAllTransactions(),
        getAllCategories(),
      ]);
      setTransactions(
        txs.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
      );
      setCategories(cats);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await initializeDefaultCategories();
        await refreshData();
      } catch (error) {
        console.error("Failed to initialize:", error);
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, [refreshData]);

  const addTransaction = async (
    data: Omit<Transaction, "id" | "createdAt">
  ) => {
    const transaction: Transaction = {
      ...data,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
    };
    await dbAddTransaction(transaction);
    await refreshData();
  };

  const updateTransaction = async (transaction: Transaction) => {
    await dbUpdateTransaction(transaction);
    await refreshData();
  };

  const deleteTransaction = async (id: string) => {
    await dbDeleteTransaction(id);
    await refreshData();
  };

  const addCategory = async (data: Omit<Category, "id">) => {
    const category: Category = {
      ...data,
      id: uuidv4(),
    };
    await dbAddCategory(category);
    await refreshData();
  };

  const updateCategory = async (category: Category) => {
    await dbUpdateCategory(category);
    await refreshData();
  };

  const deleteCategory = async (id: string) => {
    await dbDeleteCategory(id);
    await refreshData();
  };

  const getCategoriesByType = (type: TransactionType) => {
    return categories.filter((c) => c.type === type);
  };

  const getCategoryById = (id: string) => {
    return categories.find((c) => c.id === id);
  };

  const getMonthlyStats = (year: number, month: number): MonthlyStats => {
    const monthTransactions = transactions.filter((tx) => {
      const date = new Date(tx.date);
      return date.getFullYear() === year && date.getMonth() === month;
    });

    const incomeByCategory: Record<string, number> = {};
    const expensesByCategory: Record<string, number> = {};
    const debtByCategory: Record<string, number> = {};

    let totalIncome = 0;
    let totalExpenses = 0;
    let totalDebt = 0;

    monthTransactions.forEach((tx) => {
      if (tx.type === "income") {
        totalIncome += tx.amount;
        incomeByCategory[tx.categoryId] =
          (incomeByCategory[tx.categoryId] || 0) + tx.amount;
      } else if (tx.type === "expense") {
        totalExpenses += tx.amount;
        expensesByCategory[tx.categoryId] =
          (expensesByCategory[tx.categoryId] || 0) + tx.amount;
      } else {
        totalDebt += tx.amount;
        debtByCategory[tx.categoryId] =
          (debtByCategory[tx.categoryId] || 0) + tx.amount;
      }
    });

    return {
      totalIncome,
      totalExpenses,
      totalDebt,
      balance: totalIncome - totalExpenses,
      incomeByCategory: Object.entries(incomeByCategory).map(
        ([categoryId, amount]) => ({ categoryId, amount })
      ),
      expensesByCategory: Object.entries(expensesByCategory).map(
        ([categoryId, amount]) => ({ categoryId, amount })
      ),
      debtByCategory: Object.entries(debtByCategory).map(
        ([categoryId, amount]) => ({ categoryId, amount })
      ),
      transactionCount: monthTransactions.length,
    };
  };

  return (
    <FlowlyContext.Provider
      value={{
        transactions,
        categories,
        isLoading,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoriesByType,
        getCategoryById,
        getMonthlyStats,
        refreshData,
      }}
    >
      {children}
    </FlowlyContext.Provider>
  );
}

export function useFlowly() {
  const context = useContext(FlowlyContext);
  if (!context) {
    throw new Error("useFlowly must be used within a FlowlyProvider");
  }
  return context;
}
