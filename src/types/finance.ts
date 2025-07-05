export type Transaction = {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  type: 'income' | 'expense';
  description?: string;
};

export type Budget = {
  _id: string;
  category: string;
  amount: number;
  month: string; // Add this line
};


export interface Category {
  id: string;
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