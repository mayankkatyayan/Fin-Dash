import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, getHighestCategory } from "@/utils/finance";
import { TrendingUp, TrendingDown, PiggyBank, BarChart3 } from "lucide-react";

export function InsightsPanel() {
  const { transactions, totalIncome, totalExpenses } = useFinance();

  const savings = totalIncome - totalExpenses;
  const savingsRate = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : "0";
  const highestCategory = getHighestCategory(transactions);

  const currentMonth = new Date().toISOString().slice(0, 7);
  const monthExpenses = transactions
    .filter((t) => t.type === "expense" && t.date.startsWith(currentMonth))
    .reduce((s, t) => s + t.amount, 0);

  const insights = [
    {
      icon: <BarChart3 size={20} />,
      label: "Highest Spending",
      value: highestCategory,
      sub: "Top category",
    },
    {
      icon: <TrendingDown size={20} />,
      label: "This Month's Expenses",
      value: formatCurrency(monthExpenses),
      sub: "Current month",
    },
    {
      icon: <TrendingUp size={20} />,
      label: "Income vs Expense",
      value: `${formatCurrency(totalIncome)} / ${formatCurrency(totalExpenses)}`,
      sub: "All time",
    },
    {
      icon: <PiggyBank size={20} />,
      label: "Savings Rate",
      value: `${savingsRate}%`,
      sub: formatCurrency(savings) + " saved",
    },
  ];

  return (
    <div className="bg-card rounded-lg p-6 card-shadow">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Financial Insights</h3>
      <div className="space-y-4">
        {insights.map((item, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
              {item.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">{item.label}</p>
              <p className="font-semibold text-card-foreground truncate">{item.value}</p>
            </div>
            <span className="text-xs text-muted-foreground">{item.sub}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
