import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Edit2, Trash2, Calendar, DollarSign, Tag, TrendingUp, TrendingDown } from 'lucide-react';
import { format } from 'date-fns';
import { TransactionForm } from '../forms/TransactionForm';
import { Transaction } from '../../types/finance';

type TransactionListProps = {
  transactions: Transaction[];
  onUpdate: (id: string, updates: Partial<Transaction>) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
};

export const TransactionList = ({ transactions, onUpdate, onDelete, loading }: TransactionListProps) => {
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleUpdateTransaction = (updates: Omit<Transaction, '_id'>) => {
    if (editingTransaction) {
      onUpdate(editingTransaction._id, updates);
      setEditingTransaction(null);
    }
  };

  const formatAmount = (amount: number, type: 'income' | 'expense') => {
    const sign = type === 'income' ? '+' : '-';
    const color = type === 'income' ? 'text-green-600' : 'text-red-600';
    return (
      <span className={`font-semibold ${color}`}>
        {sign}${amount.toFixed(2)}
      </span>
    );
  };

  const getCategoryColor = (categoryName: string) => {
    const defaultColors: Record<string, string> = {
      Food: '#FF6384',
      Travel: '#36A2EB',
      Utilities: '#FFCE56',
      Salary: '#4CAF50',
      Shopping: '#A569BD',
      Other: '#85929E',
    };
    return defaultColors[categoryName] || '#85929E';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Transaction History</h3>
          <p className="text-sm text-muted-foreground">
            {transactions?.length || 0} transaction{transactions?.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading transactions...</p>
      ) : transactions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No transactions available.</p>
      ) : (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <Card key={transaction._id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted">
                      {transaction.type === 'income' ? (
                        <TrendingUp size={20} className="text-green-600" />
                      ) : (
                        <TrendingDown size={20} className="text-red-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-foreground truncate">{transaction.description}</h4>
                        <Badge variant="secondary" className="gap-1 text-xs">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: getCategoryColor(transaction.category) }}
                          />
                          {transaction.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          {format(new Date(transaction.date), 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag size={14} />
                          {transaction.type}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="flex items-center gap-1">
                        <DollarSign size={16} className="text-muted-foreground" />
                        {formatAmount(transaction.amount, transaction.type)}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Dialog
                        open={editingTransaction?._id === transaction._id}
                        onOpenChange={(open) => {
                          if (!open) setEditingTransaction(null);
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingTransaction(transaction)}
                          >
                            <Edit2 size={16} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Transaction</DialogTitle>
                            <DialogDescription>Make changes to your transaction</DialogDescription>
                          </DialogHeader>
                          <TransactionForm
                            initialData={editingTransaction || undefined}
                            isEditing={true}
                            onSubmit={handleUpdateTransaction}
                            onCancel={() => setEditingTransaction(null)}
                          />
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this transaction? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => onDelete(transaction._id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
