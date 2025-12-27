import { Transaction } from "../../domain/entities/Transaction";
import { getDb } from "../../infrastructure/db/indexedDb";

export class RecordDebtPaymentUseCase {
  async execute(debtId: string, amount: number): Promise<void> {
    const db = await getDb();
    const debt = await db.get("debts", debtId);
    if (!debt) throw new Error("Debt not found");

    const newRemaining = debt.remainingAmount - amount;

    // 1. Update Debt Record
    await db.put("debts", {
      ...debt,
      remainingAmount: newRemaining,
      isClosed: newRemaining <= 0,
    });

    // 2. Add Transaction to history
    const paymentTx: Transaction = {
      id: crypto.randomUUID(),
      amount: amount,
      category: debt.name,
      // Logic: Paying what I owe = Expense. Getting paid back = Income.
      type: debt.type === "owed" ? "expense" : "income",
      note: `Repayment for ${debt.name}`,
      date: new Date().toISOString(),
      createdAt: Date.now(),
    };
    await db.add("transactions", paymentTx);
  }
}
