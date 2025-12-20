// src/infrastructure/db/indexedDb.ts
import { openDB, IDBPDatabase } from "idb";

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDb() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB can only be used in the browser");
  }

  if (!dbPromise) {
    dbPromise = openDB("flowly-db", 2, {
      upgrade(db, oldVersion, newVersion, transaction) {
        // Only create transactions store if it doesn't exist
        if (!db.objectStoreNames.contains("transactions")) {
          db.createObjectStore("transactions", { keyPath: "id" });
        }

        // Only create categories store if it doesn't exist
        if (!db.objectStoreNames.contains("categories")) {
          db.createObjectStore("categories", { keyPath: "id" });
        }

        // Optional: Log for debugging
        console.log(`DB upgraded from ${oldVersion} to ${newVersion}`);
      },
      // Handle cases where upgrade fails (e.g., user has old version in another tab)
      blocked() {
        console.warn("DB upgrade blocked. Close other tabs using this app.");
        alert(
          "Please close all other tabs with this app open to update the database."
        );
      },
      blocking() {
        console.warn("Newer version detected. Reloading...");
        // Force reload when a newer version is available
        window.location.reload();
      },
    });
  }

  return dbPromise;
}
