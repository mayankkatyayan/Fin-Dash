export type TransactionType = "income" | "expense";
export type Category = "Food" | "Rent" | "Shopping" | "Travel" | "Utilities" | "Salary" | "Freelance" | "Investment" | "Entertainment" | "Healthcare";
export type Role = "viewer" | "admin";

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: Category;
  type: TransactionType;
  amount: number;
}

export interface MonthlyData {
  month: string;
  balance: number;
  income: number;
  expenses: number;
}
