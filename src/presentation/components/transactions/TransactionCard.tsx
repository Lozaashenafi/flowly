// components/transactions/TransactionCard.tsx
import { motion } from "framer-motion";
import { format } from "date-fns";

export function TransactionCard({ transaction, index, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group flex items-center justify-between p-4 bg-white rounded-[1.8rem] border border-slate-50 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-4">
        <div
          className={`h-12 w-12 rounded-2xl flex items-center justify-center ${
            transaction.type === "income"
              ? "bg-[#477A71]/10 text-[#477A71]"
              : "bg-[#F0BB40]/10 text-[#F0BB40]"
          }`}
        >
          {/* Icon here */}
        </div>
        <div>
          <h4 className="font-bold text-slate-800 text-sm">
            {transaction.notes || "Unnamed"}
          </h4>
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            {format(new Date(transaction.date), "MMM dd")}
          </p>
        </div>
      </div>
      <div className="text-right">
        <p
          className={`font-extrabold text-base ${
            transaction.type === "income" ? "text-[#477A71]" : "text-[#F0BB40]"
          }`}
        >
          {transaction.type === "income" ? "+" : "-"}$
          {transaction.amount.toLocaleString()}
        </p>
      </div>
    </motion.div>
  );
}
