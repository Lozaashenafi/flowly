// src/infrastructure/db/indexedDb.ts
import { openDB, IDBPDatabase } from "idb";

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDb() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB can only be used in the browser");
  }

  if (!dbPromise) {
    // CHANGE THIS FROM 2 TO 3
    dbPromise = openDB("flowly-db", 3, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // 1. Transactions
        if (!db.objectStoreNames.contains("transactions")) {
          db.createObjectStore("transactions", { keyPath: "id" });
        }
        // 2. Categories
        if (!db.objectStoreNames.contains("categories")) {
          db.createObjectStore("categories", { keyPath: "id" });
        }
        // 3. Budgets (This is what was missing in the browser)
        if (!db.objectStoreNames.contains("budgets")) {
          db.createObjectStore("budgets", { keyPath: "id" });
        }
        // 4. Debts (This is what was missing in the browser)
        if (!db.objectStoreNames.contains("debts")) {
          db.createObjectStore("debts", { keyPath: "id" });
        }

        console.log(`DB upgraded from ${oldVersion} to ${newVersion}`);
      },
      blocked() {
        console.warn("DB upgrade blocked. Close other tabs using this app.");
        alert(
          "Please close all other tabs with this app open to update the database."
        );
      },
      blocking() {
        console.warn("Newer version detected. Reloading...");
        window.location.reload();
      },
    });
  }

  return dbPromise;
}
