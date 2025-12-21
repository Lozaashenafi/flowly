import { getDb } from "../db/indexedDb";
import { Transaction } from "../../domain/entities/Transaction";
import { TransactionRepository } from "../../domain/repositories/TransactionRepository";
import { v4 as uuidv4 } from "uuid"; // npm i uuid @types/uuid

export class IndexedDbTransactionRepository implements TransactionRepository {
  remove(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  private storeName = "transactions";

  async getAll(): Promise<Transaction[]> {
    const db = await getDb();
    return db.getAll(this.storeName);
  }

  async getById(id: string): Promise<Transaction | null> {
    const db = await getDb();
    return db.get(this.storeName, id);
  }

  async add(transaction: Transaction): Promise<void> {
    const db = await getDb();
    const tx = db.transaction(this.storeName, "readwrite");
    const store = tx.objectStore(this.storeName);

    const newTx = {
      ...transaction,
      id: transaction.id || uuidv4(),
      createdAt: transaction.createdAt || Date.now(),
    };

    await store.add(newTx);
    await tx.done;
  }

  async update(transaction: Transaction): Promise<void> {
    const db = await getDb();
    const tx = db.transaction(this.storeName, "readwrite");
    const store = tx.objectStore(this.storeName);

    if (!transaction.id) {
      throw new Error("Transaction ID is required for update");
    }

    await store.put(transaction);
    await tx.done;
  }

  async delete(id: string): Promise<void> {
    const db = await getDb();
    await db.delete(this.storeName, id);
  }

  async clear(): Promise<void> {
    const db = await getDb();
    await db.clear(this.storeName);
  }
}
