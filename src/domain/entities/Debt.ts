import { DebtType } from "../value-objects/DebtType";

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  dueDate?: string;
  type: DebtType;
  createdAt: number;
  isClosed: boolean;
}
