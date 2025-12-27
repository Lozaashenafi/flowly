// src/presentation/components/analytics/WeeklyBudgetProgress.tsx
import { useFlowlyContext } from "../../context/FlowlyContext";
import { motion } from "framer-motion";

export const WeeklyBudgetProgress = () => {
  const { getWeeklyBudgetProgress } = useFlowlyContext();
  const progress = getWeeklyBudgetProgress();

  if (progress.length === 0) return null;

  return (
    <div className="px-2 space-y-4">
      <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
        Weekly Budget Analysis
      </h3>
      <div className="bg-white rounded-[2.5rem] p-6 border-2 border-slate-50 shadow-sm space-y-6">
        {progress.map((item: any) => (
          <div key={item.category} className="space-y-2">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-slate-800">
                {item.category}
              </span>
              <span
                className={`text-[10px] font-black ${
                  item.isOver ? "text-rose-500" : "text-[#477A71]"
                }`}
              >
                {item.spent.toLocaleString()} /{" "}
                {Math.round(item.target).toLocaleString()} ETB
              </span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${item.percentage}%` }}
                className={`h-full ${
                  item.isOver ? "bg-rose-500" : "bg-[#477A71]"
                }`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
