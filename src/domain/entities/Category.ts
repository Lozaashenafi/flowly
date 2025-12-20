// src/domain/entities/Category.ts
import { TransactionTypeVO } from "../value-objects/TransactionType";

export interface Category {
  id: string;
  name: string;
  icon: string;
  type: TransactionTypeVO;
  color: string;
  createdAt: number;
}
