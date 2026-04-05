import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { Transaction, TransactionType, Category, Role } from "@/types/finance";
import { mockTransactions } from "@/data/mockData";

interface Filters {
  search: string;
  category: Category | "all";
  type: TransactionType | "all";
  sortBy: "date" | "amount";
  sortOrder: "asc" | "desc";
}

interface FinanceContextType {
  transactions: Transaction[];
  role: Role;
  filters: Filters;
  darkMode: boolean;
  setRole: (role: Role) => void;
  setFilters: (filters: Partial<Filters>) => void;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  editTransaction: (id: string, t: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  toggleDarkMode: () => void;
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  filteredTransactions: Transaction[];
}

const FinanceContext = createContext<FinanceContextType | null>(null);

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
}

export function FinanceProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(() =>
    loadFromStorage("finance_transactions", mockTransactions)
  );
  const [role, setRole] = useState<Role>(() => loadFromStorage("finance_role", "admin" as Role));
  const [darkMode, setDarkMode] = useState(() => loadFromStorage("finance_dark", false));
  const [filters, setFiltersState] = useState<Filters>({
    search: "",
    category: "all",
    type: "all",
    sortBy: "date",
    sortOrder: "desc",
  });

  useEffect(() => {
    localStorage.setItem("finance_transactions", JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem("finance_role", JSON.stringify(role));
  }, [role]);

  useEffect(() => {
    localStorage.setItem("finance_dark", JSON.stringify(darkMode));
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const setFilters = useCallback((partial: Partial<Filters>) => {
    setFiltersState((prev) => ({ ...prev, ...partial }));
  }, []);

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    setTransactions((prev) => [{ ...t, id: crypto.randomUUID() }, ...prev]);
  }, []);

  const editTransaction = useCallback((id: string, updates: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), []);

  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalBalance = totalIncome - totalExpenses;

  const filteredTransactions = transactions
    .filter((t) => {
      if (filters.search && !t.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.category !== "all" && t.category !== filters.category) return false;
      if (filters.type !== "all" && t.type !== filters.type) return false;
      return true;
    })
    .sort((a, b) => {
      const mult = filters.sortOrder === "asc" ? 1 : -1;
      if (filters.sortBy === "date") return mult * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return mult * (a.amount - b.amount);
    });

  return (
    <FinanceContext.Provider
      value={{
        transactions, role, filters, darkMode,
        setRole, setFilters, addTransaction, editTransaction, deleteTransaction, toggleDarkMode,
        totalBalance, totalIncome, totalExpenses, filteredTransactions,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}
