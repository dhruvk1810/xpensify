import React, { createContext, useContext, useState, useEffect } from 'react';

const MonthContext = createContext(undefined);

export function MonthProvider({ children }) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [availableMonths, setAvailableMonths] = useState([]);

  const updateAvailableMonths = React.useCallback((transactions) => {
    const monthsMap = new Set();

    // Always include current month
    const now = new Date();
    monthsMap.add(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);

    if (transactions && Array.isArray(transactions)) {
      transactions.forEach(t => {
        if (t.date) {
          const d = new Date(t.date);
          monthsMap.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
        }
      });
    }

    const sortedMonths = Array.from(monthsMap).sort().reverse();
    setAvailableMonths(sortedMonths);
  }, []);

  useEffect(() => {
    // Graceful fallback to localStorage on initial load
    const storedTransactions = JSON.parse(localStorage.getItem('transactions')) || [];
    updateAvailableMonths(storedTransactions);
  }, [updateAvailableMonths]);

  const getMonthLabel = (monthKey) => {
    const [year, month] = monthKey.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <MonthContext.Provider
      value={{
        selectedMonth,
        setSelectedMonth,
        availableMonths,
        getMonthLabel,
        updateAvailableMonths,
      }}
    >
      {children}
    </MonthContext.Provider>
  );
}

export function useMonth() {
  const context = useContext(MonthContext);
  if (context === undefined) {
    throw new Error('useMonth must be used within a MonthProvider');
  }
  return context;
}

