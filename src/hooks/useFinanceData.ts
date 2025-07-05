import { useState, useEffect } from 'react';
import { Transaction, Budget } from '../types/finance';
import { transactionService } from '../services/transactionService';
import { budgetService } from '../services/budgetService';

export const useFinanceData = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log("📦 Loading finance data...");

        const rawTransactions = await transactionService.getAllTransactions();
        const rawBudgets = await budgetService.getAllBudgets();

        const normalizedTransactions: Transaction[] = rawTransactions.map((t: any) => ({
          ...t,
          id: t.id ?? t._id,
        }));

        const normalizedBudgets: Budget[] = rawBudgets.map((b: any) => ({
          ...b,
          id: b.id ?? b._id,
        }));

        console.log('✅ Transactions fetched:', normalizedTransactions);
        console.log('✅ Budgets fetched:', normalizedBudgets);

        setTransactions(normalizedTransactions);
        setBudgets(normalizedBudgets);
        setError(null);
      } catch (err) {
        console.error("❌ Failed to load data:", err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: any = await transactionService.addTransaction(transaction);
    const normalized = { ...newTransaction, id: newTransaction.id ?? newTransaction._id };
    console.log("➕ New transaction added:", normalized);
    setTransactions(prev => [normalized, ...prev]);
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    const updated: any = await transactionService.updateTransaction(id, updates);
    const normalized = { ...updated, id: updated.id ?? updated._id };
    console.log(`🔄 Transaction updated [ID: ${id}]:`, normalized);
    setTransactions(prev => prev.map(t => t._id === id ? normalized : t));
  };

  const deleteTransaction = async (id: string) => {
    await transactionService.deleteTransaction(id);
    console.log(`🗑️ Transaction deleted [ID: ${id}]`);
    setTransactions(prev => prev.filter(t => t._id !== id));
  };

  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    const newBudget: any = await budgetService.addBudget(budget);
    const normalized = { ...newBudget, id: newBudget.id ?? newBudget._id };
    console.log("➕ New budget added:", normalized);
    setBudgets(prev => [normalized, ...prev]);
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    const updated: any = await budgetService.updateBudget(id, updates);
    const normalized = { ...updated, id: updated.id ?? updated._id };
    console.log(`🔄 Budget updated [ID: ${id}]:`, normalized);
    setBudgets(prev => prev.map(b => b._id === id ? normalized : b));
  };

  const deleteBudget = async (id: string) => {
    await budgetService.deleteBudget(id);
    console.log(`🗑️ Budget deleted [ID: ${id}]`);
    setBudgets(prev => prev.filter(b => b._id !== id));
  };

  return {
    transactions,
    budgets,
    loading,
    error,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBudget,
    updateBudget,
    deleteBudget,
  };
};
