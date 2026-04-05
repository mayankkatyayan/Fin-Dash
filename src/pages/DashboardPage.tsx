import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { SummaryCard } from "@/components/SummaryCard";
import { BalanceChart } from "@/components/BalanceChart";
import { SpendingChart } from "@/components/SpendingChart";
import { InsightsPanel } from "@/components/InsightsPanel";
import { TransactionFilters } from "@/components/TransactionFilters";
import { TransactionTable } from "@/components/TransactionTable";
import { TransactionForm } from "@/components/TransactionForm";
import { Header } from "@/components/Header";
import { formatCurrency, exportTransactionsCSV } from "@/utils/finance";
import { Wallet, TrendingUp, TrendingDown, Plus, Download } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
  const { totalBalance, totalIncome, totalExpenses, role, transactions } = useFinance();
  const [page, setPage] = useState("dashboard");
  const [showAddForm, setShowAddForm] = useState(false);
  const isAdmin = role === "admin";

  return (
    <div className="min-h-screen bg-background">
      <Header currentPage={page} onNavigate={setPage} />

      <main className="container mx-auto px-4 sm:px-6 py-6 space-y-6">
        {page === "dashboard" && (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">Your financial overview</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                {role}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <SummaryCard
                title="Total Balance"
                amount={formatCurrency(totalBalance)}
                change="+12.5% from last month"
                changeType="positive"
                icon={<Wallet size={20} />}
              />
              <SummaryCard
                title="Total Income"
                amount={formatCurrency(totalIncome)}
                change="+8.2% from last month"
                changeType="positive"
                icon={<TrendingUp size={20} />}
              />
              <SummaryCard
                title="Total Expenses"
                amount={formatCurrency(totalExpenses)}
                change="+3.1% from last month"
                changeType="negative"
                icon={<TrendingDown size={20} />}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <BalanceChart />
              <SpendingChart />
            </div>
          </>
        )}

        {page === "transactions" && (
          <>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
                <p className="text-sm text-muted-foreground mt-1">Manage your financial records</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    exportTransactionsCSV(transactions);
                    toast.success("CSV exported");
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm hover:bg-secondary transition-colors"
                >
                  <Download size={14} /> Export
                </button>
                {isAdmin && (
                  <button
                    onClick={() => setShowAddForm((v) => !v)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    <Plus size={14} /> Add
                  </button>
                )}
              </div>
            </div>

            {showAddForm && isAdmin && (
              <div className="bg-card rounded-lg p-4 card-shadow">
                <TransactionForm onClose={() => setShowAddForm(false)} />
              </div>
            )}

            <TransactionFilters />
            <TransactionTable />
          </>
        )}

        {page === "insights" && (
          <>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Insights</h1>
              <p className="text-sm text-muted-foreground mt-1">Understand your spending patterns</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <InsightsPanel />
              <SpendingChart />
            </div>
            <BalanceChart />
          </>
        )}
      </main>
    </div>
  );
}
