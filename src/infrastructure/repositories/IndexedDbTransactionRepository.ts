import { getDb } from "../db/indexedDb";
import { Transaction } from "../../domain/entities/Transaction";

export class IndexedDbTransactionRepository {
  async add(tx: Transaction) {
    const db = await getDb();
    if (!db) return;
    await db.add("transactions", tx);
  }

  async getAll(): Promise<Transaction[]> {
    const db = await getDb();
    if (!db) return [];
    return db.getAll("transactions");
  }

  async delete(id: string) {
    const db = await getDb();
    if (!db) return;
    await db.delete("transactions", id);
  }
  async clear() {
    const db = await getDb();
    if (!db) return;
    await db.clear("transactions");
  }
}
