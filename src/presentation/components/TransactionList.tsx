import { Transaction } from "../../domain/entities/Transaction";

type Props = {
  transactions: Transaction[];
};

export default function TransactionList({ transactions }: Props) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-xl bg-white p-4 text-center text-sm text-gray-500 shadow">
        No transactions yet
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {transactions.map((tx) => {
        const isIncome = tx.type === "income";

        return (
          <li
            key={tx.id}
            className="flex items-center justify-between rounded-xl bg-white p-4 shadow"
          >
            <div>
              <p className="font-medium text-gray-900">{tx.category}</p>
              <p className="text-xs text-gray-500">
                {new Date(tx.date).toLocaleDateString()}
              </p>
            </div>

            <p
              className={`font-semibold ${
                isIncome ? "text-green-600" : "text-red-600"
              }`}
            >
              {isIncome ? "+" : "-"}
              {tx.amount}
            </p>
          </li>
        );
      })}
    </ul>
  );
}
