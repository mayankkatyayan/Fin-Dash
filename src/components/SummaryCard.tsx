import { ReactNode } from "react";

interface SummaryCardProps {
  title: string;
  amount: string;
  change: string;
  changeType: "positive" | "negative" | "neutral";
  icon: ReactNode;
}

export function SummaryCard({ title, amount, change, changeType, icon }: SummaryCardProps) {
  const changeColor =
    changeType === "positive" ? "text-income" : changeType === "negative" ? "text-expense" : "text-muted-foreground";

  return (
    <div className="bg-card rounded-lg p-6 card-shadow hover:card-shadow-hover transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
          {icon}
        </div>
      </div>
      <p className="text-2xl font-bold text-card-foreground">{amount}</p>
      <p className={`text-sm mt-1 ${changeColor}`}>{change}</p>
    </div>
  );
}
