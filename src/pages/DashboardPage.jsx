import { useState, useEffect } from 'react';
import { TopBar } from '@/components/layout/TopBar';
import { StatCard } from '@/components/dashboard/StatCard';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { useMonth } from '@/context/MonthContext';
import { getTransactions } from '@/lib/api';
import { calculatePercentageChange } from '@/lib/utils';

const categoryColors = {
  'Groceries': '#10B981',
  'Utilities': '#3B82F6',
  'Entertainment': '#F59E0B',
  'Transport': '#EF4444',
  'Food & Drink': '#EC4899',
  'Shopping': '#8B5CF6',
  'Healthcare': '#6366F1',
  'Education': '#EAB308',
  'Other': '#6B7280',
};

export function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpenses: 0,
    totalSavings: 0,
    balanceChange: 0,
    incomeChange: 0,
    expenseChange: 0,
    savingsChange: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [catData, setCatData] = useState([]);
  const { selectedMonth, updateAvailableMonths } = useMonth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const storedTransactions = await getTransactions();
        setAllTransactions(storedTransactions);
        updateAvailableMonths(storedTransactions);

        const [selectedYear, selectedMonthNum] = selectedMonth.split('-').map(Number);

        const monthTransactions = storedTransactions.filter(t => {
          if (!t.date) return false;
          const d = new Date(t.date);
          return d.getFullYear() === selectedYear && (d.getMonth() + 1) === selectedMonthNum;
        });

        setTransactions(monthTransactions);

        const totalExpenses = monthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

        const totalIncome = monthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

        // Chart (last 7 days)
        const last7Days = [...Array(7)].map((_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - i);
          return d.toLocaleDateString('en-US', { weekday: 'short' });
        }).reverse();

        const processedChartData = last7Days.map(day => {
          const dayTransactions = monthTransactions.filter(t => {
            const tDate = new Date(t.date).toLocaleDateString('en-US', { weekday: 'short' });
            return tDate === day;
          });

          return {
            name: day,
            income: dayTransactions
              .filter(t => t.type === 'income')
              .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
            expense: dayTransactions
              .filter(t => t.type === 'expense')
              .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
          };
        });

        setChartData(processedChartData);

        // Category chart
        const categoriesMap = {};

        monthTransactions
          .filter(t => t.type === 'expense')
          .forEach(t => {
            const amt = parseFloat(t.amount) || 0;
            categoriesMap[t.category] = (categoriesMap[t.category] || 0) + amt;
          });

        const processedCatData = Object.keys(categoriesMap).map(cat => ({
          name: cat,
          value: categoriesMap[cat],
          color: categoryColors[cat] || '#6B7280',
        }));

        setCatData(processedCatData);

        // Previous Month Data
        let prevYear = selectedYear;
        let prevMonthNum = selectedMonthNum - 1;
        if (prevMonthNum === 0) {
          prevMonthNum = 12;
          prevYear -= 1;
        }

        const prevMonthTransactions = storedTransactions.filter(t => {
          if (!t.date) return false;
          const d = new Date(t.date);
          return d.getFullYear() === prevYear && (d.getMonth() + 1) === prevMonthNum;
        });

        const prevTotalExpenses = prevMonthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

        const prevTotalIncome = prevMonthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

        const prevBalance = prevTotalIncome - prevTotalExpenses;

        // Calculate changes
        const balanceChange = calculatePercentageChange(totalIncome - totalExpenses, prevBalance);
        const incomeChange = calculatePercentageChange(totalIncome, prevTotalIncome);
        const expenseChange = calculatePercentageChange(totalExpenses, prevTotalExpenses);
        const savingsChange = calculatePercentageChange(totalIncome - totalExpenses, prevBalance);

        setStats({
          totalBalance: totalIncome - totalExpenses,
          totalIncome,
          totalExpenses,
          totalSavings: totalIncome - totalExpenses,
          balanceChange,
          incomeChange,
          expenseChange,
          savingsChange,
        });

      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in pb-20">
      <TopBar
        title="Dashboard Overview"
        subtitle="Welcome back, here's your financial summary for this month."
        showDateSelector
        showAddButton
      />

      {/* Grid of Standard Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Balance" value={stats.totalBalance} change={stats.balanceChange} type="balance" isLoading={isLoading} />
        <StatCard title="Total Income" value={stats.totalIncome} change={stats.incomeChange} type="income" isLoading={isLoading} />
        <StatCard title="Total Expenses" value={stats.totalExpenses} change={stats.expenseChange} type="expense" isLoading={isLoading} />
        <StatCard title="Total Savings" value={stats.totalSavings} change={stats.savingsChange} type="savings" isLoading={isLoading} />
      </div>

      {/* Charts Section */}
      <div className="flex flex-col lg:flex-row gap-8 mb-8">
        <div className="flex-[2]">
          <SpendingChart transactions={allTransactions} isLoading={isLoading} />
        </div>
        <div className="flex-[1]">
          <CategoryChart transactions={allTransactions} isLoading={isLoading} />
        </div>
      </div>

      <TransactionList
        transactions={transactions.slice(0, 5)}
        isLoading={isLoading}
      />
    </div>
  );
}