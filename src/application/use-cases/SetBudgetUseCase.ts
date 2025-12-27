import { Budget } from "../../domain/entities/Budget";
import { getDb } from "../../infrastructure/db/indexedDb";

export class SetBudgetUseCase {
  async execute(budget: Budget): Promise<void> {
    const db = await getDb();
    // Unique ID per category/month/year to allow "put" (upsert)
    const id = `${budget.categoryId}-${budget.month}-${budget.year}`;
    await db.put("budgets", { ...budget, id });
  }
}
