import { createContext, useContext, useState, useEffect } from 'react';

const TransactionsContext = createContext();

export function useTransactions() {
  return useContext(TransactionsContext);
}

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Add a new transaction (expense or income)
  const addTransaction = (transaction) => {
    setTransactions([...transactions, { ...transaction, id: Date.now() }]);
  };

  // Delete a transaction
  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  // Get transactions by date range
  const getTransactionsByDateRange = (startDate, endDate) => {
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  };

  // Get daily summary
  const getDailySummary = (date) => {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);
    
    return getTransactionsByDateRange(start, end);
  };

  // Get weekly summary
  const getWeeklySummary = (date) => {
    const start = new Date(date);
    start.setDate(start.getDate() - start.getDay());
    start.setHours(0, 0, 0, 0);
    
    const end = new Date(start);
    end.setDate(end.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    
    return getTransactionsByDateRange(start, end);
  };

  // Get monthly summary
  const getMonthlySummary = (date) => {
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
    
    return getTransactionsByDateRange(start, end);
  };

  // Calculate balance
  const calculateBalance = (transactions) => {
    return transactions.reduce((total, transaction) => {
      return transaction.type === 'income' 
        ? total + transaction.amount 
        : total - transaction.amount;
    }, 0);
  };

  const value = {
    transactions,
    addTransaction,
    deleteTransaction,
    getDailySummary,
    getWeeklySummary,
    getMonthlySummary,
    calculateBalance
  };

  return (
    <TransactionsContext.Provider value={value}>
      {children}
    </TransactionsContext.Provider>
  );
}