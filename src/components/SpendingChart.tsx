import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useFinance } from "@/context/FinanceContext";
import { getCategoryBreakdown, CHART_COLORS, formatCurrency } from "@/utils/finance";

export function SpendingChart() {
  const { transactions } = useFinance();
  const data = getCategoryBreakdown(transactions);

  if (data.length === 0) {
    return (
      <div className="bg-card rounded-lg p-6 card-shadow flex items-center justify-center h-96">
        <p className="text-muted-foreground">No expense data available</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 card-shadow">
      <h3 className="text-lg font-semibold text-card-foreground mb-4">Spending by Category</h3>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} innerRadius={50} paddingAngle={3}>
              {data.map((_, i) => (
                <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                color: "hsl(var(--card-foreground))",
              }}
              formatter={(value: number) => [formatCurrency(value)]}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
