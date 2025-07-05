export interface Transaction {
  _id: string;
  amount: number;
  date: string;
  description: string;
  category: string;
  type: 'income' | 'expense';
}

export interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: string;
}

export interface Category {
  _id: string;
  name: string;
  color: string;
  icon: string;
}

export interface MonthlyExpense {
  month: string;
  total: number;
}

export interface CategoryExpense {
  category: string;
  amount: number;
  color: string;
}

export interface BudgetComparison {
  category: string;
  budget: number;
  actual: number;
  status: 'over' | 'under' | 'on-track';
}