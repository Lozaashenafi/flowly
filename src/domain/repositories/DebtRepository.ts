import { Debt } from "../entities/Debt";

export interface DebtRepository {
  getAll(): Promise<Debt[]>;
  getById(id: string): Promise<Debt | undefined>;
  add(debt: Debt): Promise<void>;
  update(debt: Debt): Promise<void>;
  remove(id: string): Promise<void>;
}
