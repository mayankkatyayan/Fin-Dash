import { useFinance } from "@/context/FinanceContext";
import { categories } from "@/utils/finance";
import { Search, SlidersHorizontal } from "lucide-react";

export function TransactionFilters() {
  const { filters, setFilters } = useFinance();

  return (
    <div className="bg-card rounded-lg p-4 card-shadow space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-3 sm:flex-wrap">
      <div className="relative flex-1 min-w-[200px]">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => setFilters({ search: e.target.value })}
          className="w-full pl-9 pr-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal size={16} className="text-muted-foreground hidden sm:block" />

        <select
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value as any })}
          className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select
          value={filters.type}
          onChange={(e) => setFilters({ type: e.target.value as any })}
          className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="all">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split("-") as any;
            setFilters({ sortBy, sortOrder });
          }}
          className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="date-desc">Newest First</option>
          <option value="date-asc">Oldest First</option>
          <option value="amount-desc">Highest Amount</option>
          <option value="amount-asc">Lowest Amount</option>
        </select>
      </div>
    </div>
  );
}
