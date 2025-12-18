import { TransactionType } from "../value-objects/TransactionType";

export interface Category {
  id: string;
  name: string;
  /**
   * Which transaction type this category applies to.
   * 'income' | 'expense' | 'both'
   */
  type: TransactionType | "both";
  color?: string;
  createdAt: number;
}
