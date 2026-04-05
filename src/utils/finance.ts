import { Transaction, Category } from "@/types/finance";

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function getCategoryBreakdown(transactions: Transaction[]): { name: string; value: number }[] {
  const map: Record<string, number> = {};
  transactions.filter((t) => t.type === "expense").forEach((t) => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map)
    .map(([name, value]) => ({ name, value: Math.round(value * 100) / 100 }))
    .sort((a, b) => b.value - a.value);
}

export function getHighestCategory(transactions: Transaction[]): string {
  const breakdown = getCategoryBreakdown(transactions);
  return breakdown.length > 0 ? breakdown[0].name : "N/A";
}

export const categories: Category[] = [
  "Food", "Rent", "Shopping", "Travel", "Utilities", "Salary", "Freelance", "Investment", "Entertainment", "Healthcare",
];

export const CHART_COLORS = [
  "hsl(162, 63%, 41%)",
  "hsl(210, 100%, 52%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 51%)",
  "hsl(270, 60%, 55%)",
  "hsl(190, 70%, 45%)",
  "hsl(330, 65%, 50%)",
  "hsl(80, 55%, 45%)",
  "hsl(25, 80%, 50%)",
  "hsl(200, 50%, 55%)",
];

export function exportTransactionsCSV(transactions: Transaction[]) {
  const header = "Date,Description,Category,Type,Amount";
  const rows = transactions.map(
    (t) => `${t.date},"${t.description}",${t.category},${t.type},${t.amount}`
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
}
