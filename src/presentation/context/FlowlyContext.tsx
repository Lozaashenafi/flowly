"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
// Import Repositories (Assumes you've created these following your existing pattern)
import { IndexedDbTransactionRepository } from "../../infrastructure/repositories/IndexedDbTransactionRepository";
import { IndexedDbCategoryRepository } from "../../infrastructure/repositories/IndexedDbCategoryRepository";
// Add these new suggested repositories or use a generic one
import { getDb } from "../../infrastructure/db/indexedDb";

import { Transaction } from "../../domain/entities/Transaction";
import { Category } from "../../domain/entities/Category";
import { Budget } from "../../domain/entities/Budget";
import { Debt } from "../../domain/entities/Debt";
import { defaultCategories } from "../../data/defaultCategories";
import { toEthiopian } from "../../infrastructure/utils/ethiopianDate";

interface FlowlyContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  debts: Debt[];
  isLoading: boolean;
  // Transactions
  getTransaction: (id: string) => Promise<Transaction | null>;
  addTransaction: (txData: Transaction) => Promise<void>;
  updateTransaction: (txData: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  // Categories
  addCategory: (catData: Category) => Promise<void>;
  // Budgets
  addBudget: (budgetData: Budget) => Promise<void>;
  updateBudget: (budgetData: Budget) => Promise<void>;
  getWeeklyBudgetProgress: () => any[];
  // Debts (Individual Ledger)
  addDebt: (debtData: Debt) => Promise<void>;
  updateDebt: (debtData: Debt) => Promise<void>;
  deleteDebt: (id: string) => Promise<void>;
  addDebtPayment: (
    debtId: string,
    amount: number,
    note?: string,
  ) => Promise<void>;
  // Stats
  getMonthlyStats: (
    year: number,
    month: number,
  ) => {
    totalIncome: number;
    totalExpenses: number;
    balance: number;
    totalDebtOwed: number;
    totalDebtOwesMe: number;
  };
}

export const FlowlyContext = createContext<FlowlyContextType | undefined>(
  undefined,
);

export function FlowlyProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const txRepo = useMemo(() => new IndexedDbTransactionRepository(), []);
  const categoryRepo = useMemo(() => new IndexedDbCategoryRepository(), []);

  // --- REFRESH LOGIC ---

  const refreshAll = useCallback(async () => {
    const db = await getDb();

    // Refresh Transactions
    const txs = await db.getAll("transactions");
    setTransactions(
      txs.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    );

    // Refresh Categories
    let cats = await db.getAll("categories");
    if (cats.length === 0) {
      for (const def of defaultCategories) {
        await db.add("categories", def);
      }
      cats = await db.getAll("categories");
    }
    setCategories(cats);

    // Refresh Budgets
    const bgs = await db.getAll("budgets");
    setBudgets(bgs);

    // Refresh Debts
    const dts = await db.getAll("debts");
    setDebts(dts);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      refreshAll().finally(() => setIsLoading(false));
    }
  }, [refreshAll]);

  // --- TRANSACTION ACTIONS ---

  const addTransaction = useCallback(
    async (txData: Transaction) => {
      const db = await getDb();
      const newTx = {
        ...txData,
        id: txData.id || crypto.randomUUID(),
        createdAt: Date.now(),
      };
      await db.add("transactions", newTx);
      await refreshAll();
    },
    [refreshAll],
  );

  const updateTransaction = useCallback(
    async (txData: Transaction) => {
      const db = await getDb();
      await db.put("transactions", txData);
      await refreshAll();
    },
    [refreshAll],
  );

  const deleteTransaction = useCallback(
    async (id: string) => {
      const db = await getDb();
      await db.delete("transactions", id);
      await refreshAll();
    },
    [refreshAll],
  );

  const getTransaction = useCallback(async (id: string) => {
    const db = await getDb();
    return db.get("transactions", id);
  }, []);

  // --- CATEGORY ACTIONS ---

  const addCategory = useCallback(
    async (catData: Category) => {
      const db = await getDb();
      await db.add("categories", catData);
      await refreshAll();
    },
    [refreshAll],
  );

  // --- BUDGET ACTIONS ---
  const addBudget = useCallback(
    async (budgetData: Budget) => {
      const db = await getDb();
      // We use a composite key or just check if one exists for this category/month/year
      const id = `${budgetData.categoryId}-${budgetData.month}-${budgetData.year}`;
      await db.put("budgets", { ...budgetData, id });
      await refreshAll();
    },
    [refreshAll],
  );

  const updateBudget = useCallback(
    async (budgetData: Budget) => {
      const db = await getDb();
      await db.put("budgets", budgetData);
      await refreshAll();
    },
    [refreshAll],
  );

  const getWeeklyBudgetProgress = useCallback(() => {
    const now = new Date();
    const startOfWk = new Date(now.setDate(now.getDate() - now.getDay())); // Sunday
    startOfWk.setHours(0, 0, 0, 0);

    return categories
      .map((cat) => {
        const budget = budgets.find((b) => b.categoryId === cat.id);
        if (!budget) return null;

        const spentThisWeek = transactions
          .filter((t) => {
            const txDate = new Date(t.date);
            const txType =
              typeof t.type === "string" ? t.type : (t.type as any).value;
            return (
              t.category === cat.name &&
              txDate >= startOfWk &&
              txType === "expense"
            );
          })
          .reduce((sum, t) => sum + t.amount, 0);

        const weeklyTarget = budget.amount / 4;

        return {
          category: cat.name,
          color: cat.color,
          spent: spentThisWeek,
          target: weeklyTarget,
          percentage: Math.min((spentThisWeek / weeklyTarget) * 100, 100),
          isOver: spentThisWeek > weeklyTarget,
        };
      })
      .filter(Boolean);
  }, [transactions, budgets, categories]);

  // --- DEBT LEDGER ACTIONS ---

  const addDebt = useCallback(
    async (debtData: Debt) => {
      const db = await getDb();
      await db.add("debts", {
        ...debtData,
        id: crypto.randomUUID(),
        createdAt: Date.now(),
      });
      await refreshAll();
    },
    [refreshAll],
  );

  const updateDebt = useCallback(
    async (debtData: Debt) => {
      const db = await getDb();
      await db.put("debts", debtData);
      await refreshAll();
    },
    [refreshAll],
  );

  const deleteDebt = useCallback(
    async (id: string) => {
      const db = await getDb();
      await db.delete("debts", id);
      await refreshAll();
    },
    [refreshAll],
  );

  const addDebtPayment = useCallback(
    async (debtId: string, amount: number, note?: string) => {
      const db = await getDb();
      const debt = await db.get("debts", debtId);
      if (!debt) return;

      const newRemaining = debt.remainingAmount - amount;

      // 1. Update the Debt Ledger entry
      await db.put("debts", {
        ...debt,
        remainingAmount: newRemaining,
        isClosed: newRemaining <= 0,
      });

      // 2. Automatically create a transaction record so the balance/history updates
      const paymentTx: Transaction = {
        id: crypto.randomUUID(),
        amount: amount,
        category: debt.name,
        type: debt.type === "owed" ? "expense" : "income", // If I owe, paying is an expense
        note: note || `Payment for debt: ${debt.name}`,
        date: new Date().toISOString(),
        createdAt: Date.now(),
      };

      await db.add("transactions", paymentTx);
      await refreshAll();
    },
    [refreshAll],
  );

  // --- STATS ---
  const getMonthlyStats = useCallback(
    (ethYear: number, ethMonth: number) => {
      const filtered = transactions.filter((t) => {
        const ethTx = toEthiopian(t.date); // Use the helper
        return ethTx.year === ethYear && ethTx.month === ethMonth;
      });

      const getTypeValue = (t: Transaction) =>
        typeof t.type === "string" ? t.type : (t.type as any).value;

      let income = 0;
      let expenses = 0;
      let balance = 0;
      let debtOwed = 0;
      let debtOwesMe = 0;

      filtered.forEach((t) => {
        const type = getTypeValue(t);
        const amt = t.amount;

        if (type === "income") {
          income += amt;
          balance += amt;
        } else if (type === "expense") {
          expenses += amt;
          balance -= amt;
        } else if (type === "debt") {
          if ((t as any).debtType === "owed") {
            balance += amt;
            debtOwed += amt;
          } else {
            balance -= amt;
            debtOwesMe += amt;
          }
        }
      });

      return {
        totalIncome: income,
        totalExpenses: expenses,
        balance,
        totalDebtOwed: debtOwed,
        totalDebtOwesMe: debtOwesMe,
      };
    },
    [transactions],
  );

  return (
    <FlowlyContext.Provider
      value={{
        transactions,
        categories,
        budgets,
        debts,
        isLoading,
        getTransaction,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        addBudget,
        updateBudget,
        getWeeklyBudgetProgress,
        addDebt,
        updateDebt,
        deleteDebt,
        addDebtPayment,
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
