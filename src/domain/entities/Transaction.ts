// src/domain/entities/Transaction.ts
import { TransactionType } from "../value-objects/TransactionType";
import { DebtType } from "../value-objects/DebtType";

export interface Transaction {
  id: string;
  type: TransactionType;
  debtType?: DebtType; // Add this optional field
  amount: number;
  category: string;
  note?: string;
  date: string;
  createdAt: number;
}
