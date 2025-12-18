export const TransactionTypes = {
  INCOME: "income",
  EXPENSE: "expense",
} as const;

export type TransactionType =
  (typeof TransactionTypes)[keyof typeof TransactionTypes];
