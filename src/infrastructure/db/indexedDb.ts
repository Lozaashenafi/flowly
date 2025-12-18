import { openDB, IDBPDatabase } from "idb";

let dbPromise: Promise<IDBPDatabase> | null = null;

export function getDb() {
  if (typeof window === "undefined") {
    throw new Error("IndexedDB can only be used in the browser");
  }

  if (!dbPromise) {
    dbPromise = openDB("flowly-db", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("transactions")) {
          db.createObjectStore("transactions", { keyPath: "id" });
        }
      },
    });
  }

  return dbPromise;
}
