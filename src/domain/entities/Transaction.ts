import { TransactionType } from "../value-objects/TransactionType";

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  note?: string;
  date: string;
  createdAt: number;
}
