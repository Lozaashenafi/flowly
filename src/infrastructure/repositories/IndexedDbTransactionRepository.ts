import { getDb } from "../db/indexedDb";
import { Transaction } from "@/src/domain/entities/Transaction";

export class IndexedDbTransactionRepository {
  async add(tx: Transaction) {
    const db = await getDb();
    await db.add("transactions", tx);
  }

  async getAll() {
    const db = await getDb();
    return db.getAll("transactions");
  }
}
