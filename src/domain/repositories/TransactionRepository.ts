import { Transaction } from "../entities/Transaction";

export interface TransactionRepository {
  add(tx: Transaction): Promise<void>;
  getAll(): Promise<Transaction[]>;
}
