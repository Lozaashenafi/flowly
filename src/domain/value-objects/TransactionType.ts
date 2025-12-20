export type TransactionType = "income" | "expense" | "debt";

export class TransactionTypeVO {
  private constructor(public readonly value: TransactionType) {}

  static Income = new TransactionTypeVO("income");
  static Expense = new TransactionTypeVO("expense");
  static Debt = new TransactionTypeVO("debt");

  static fromString(value: string): TransactionTypeVO {
    switch (value.toLowerCase()) {
      case "income":
        return TransactionTypeVO.Income;
      case "expense":
        return TransactionTypeVO.Expense;
      case "debt":
        return TransactionTypeVO.Debt;
      default:
        throw new Error(`Invalid transaction type: ${value}`);
    }
  }

  toString(): string {
    return this.value;
  }

  isIncome(): boolean {
    return this.value === "income";
  }

  isExpense(): boolean {
    return this.value === "expense";
  }

  isDebt(): boolean {
    return this.value === "debt";
  }
}
