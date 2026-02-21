export interface User {
  email: string;
  token: string;
}

export interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense' | 'fixed-expense';
  recurrenceDay?: number;
  userId: string;
  createdAt: string;
}

export interface Balance {
  income: number;
  expense: number;
  balance: number;
}