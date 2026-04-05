import { useState, useEffect } from "react";
import { useFinance } from "@/context/FinanceContext";
import { categories } from "@/utils/finance";
import { Transaction, TransactionType, Category } from "@/types/finance";
import { toast } from "sonner";
import { X } from "lucide-react";

interface TransactionFormProps {
  editId?: string;
  onClose: () => void;
}

export function TransactionForm({ editId, onClose }: TransactionFormProps) {
  const { transactions, addTransaction, editTransaction } = useFinance();
  const existing = editId ? transactions.find((t) => t.id === editId) : null;

  const [form, setForm] = useState({
    date: existing?.date || new Date().toISOString().slice(0, 10),
    description: existing?.description || "",
    category: (existing?.category || "Food") as Category,
    type: (existing?.type || "expense") as TransactionType,
    amount: existing?.amount?.toString() || "",
  });

  useEffect(() => {
    if (existing) {
      setForm({
        date: existing.date,
        description: existing.description,
        category: existing.category,
        type: existing.type,
        amount: existing.amount.toString(),
      });
    }
  }, [existing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.date) {
      toast.error("Please fill all fields");
      return;
    }
    const data = { ...form, amount: parseFloat(form.amount) };
    if (editId) {
      editTransaction(editId, data);
      toast.success("Transaction updated");
    } else {
      addTransaction(data);
      toast.success("Transaction added");
    }
    onClose();
  };

  const inputClass = "w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-card-foreground">{editId ? "Edit" : "Add"} Transaction</h3>
        <button type="button" onClick={onClose} className="p-1 rounded hover:bg-secondary text-muted-foreground">
          <X size={18} />
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className={inputClass} />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className={inputClass} />
        <input type="number" step="0.01" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className={inputClass} />
        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value as Category })} className={inputClass}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as TransactionType })} className={inputClass}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <button type="submit" className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity">
          {editId ? "Update" : "Add"} Transaction
        </button>
      </div>
    </form>
  );
}
