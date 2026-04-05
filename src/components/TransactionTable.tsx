import { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, formatDate } from "@/utils/finance";
import { Pencil, Trash2, FileText } from "lucide-react";
import { TransactionForm } from "./TransactionForm";
import { toast } from "sonner";

export function TransactionTable() {
  const { filteredTransactions, role, deleteTransaction } = useFinance();
  const [editingId, setEditingId] = useState<string | null>(null);
  const isAdmin = role === "admin";

  if (filteredTransactions.length === 0) {
    return (
      <div className="bg-card rounded-lg p-12 card-shadow text-center">
        <FileText size={48} className="mx-auto text-muted-foreground/40 mb-4" />
        <p className="text-muted-foreground font-medium">No transactions found</p>
        <p className="text-sm text-muted-foreground/70 mt-1">Try adjusting your filters</p>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    toast.success("Transaction deleted");
  };

  return (
    <div className="bg-card rounded-lg card-shadow overflow-hidden">
      {editingId && (
        <div className="p-4 border-b border-border">
          <TransactionForm
            editId={editingId}
            onClose={() => setEditingId(null)}
          />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-secondary/30">
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Date</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Description</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden sm:table-cell">Category</th>
              <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
              <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amount</th>
              {isAdmin && <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((t) => (
              <tr key={t.id} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                <td className="py-3 px-4 text-card-foreground">{formatDate(t.date)}</td>
                <td className="py-3 px-4 text-card-foreground font-medium">{t.description}</td>
                <td className="py-3 px-4 hidden sm:table-cell">
                  <span className="px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">{t.category}</span>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    t.type === "income" ? "bg-income/10 text-income" : "bg-expense/10 text-expense"
                  }`}>
                    {t.type === "income" ? "Income" : "Expense"}
                  </span>
                </td>
                <td className={`py-3 px-4 text-right font-semibold ${
                  t.type === "income" ? "text-income" : "text-expense"
                }`}>
                  {t.type === "income" ? "+" : "-"}{formatCurrency(t.amount)}
                </td>
                {isAdmin && (
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditingId(t.id)} className="p-1.5 rounded-md hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-md hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
