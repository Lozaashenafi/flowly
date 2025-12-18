import { Transaction } from "../entities/Transaction";

export interface TransactionRepository {
  add(tx: Transaction): Promise<void>;
  getAll(): Promise<Transaction[]>;
  getById(id: string): Promise<Transaction | undefined>;
  update(tx: Transaction): Promise<void>;
  remove(id: string): Promise<void>;
}
