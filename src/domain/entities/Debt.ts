import { DebtType } from "../value-objects/DebtType";

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  dueDate?: string;
  type: DebtType;
  note?: string;
  createdAt: number;
  isClosed: boolean;
}
