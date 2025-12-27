import { Debt } from "../../domain/entities/Debt";
import { getDb } from "../../infrastructure/db/indexedDb";

export class AddDebtUseCase {
  async execute(debt: Debt): Promise<void> {
    const db = await getDb();
    await db.add("debts", {
      ...debt,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    });
  }
}
