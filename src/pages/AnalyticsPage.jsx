import { useState, useEffect } from 'react';
import { Download, ArrowDownLeft, ArrowUpRight, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useCountUp } from '@/hooks/useCountUp';
import { cn } from '@/lib/utils';
import { useMonth } from '@/context/MonthContext';
import { MonthSelector } from '@/components/shared/MonthSelector';
import { Button } from '@/components/ui/button';
import { getTransactions } from '@/lib/api';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { calculatePercentageChange } from '@/lib/utils';
import { StatCard } from '@/components/dashboard/StatCard';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu.jsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export function AnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState([]);
  const [monthTransactions, setMonthTransactions] = useState([]);
  const [stats, setStats] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    netBalance: 0,
    incomeChange: 0,
    expenseChange: 0,
    netChange: 0,
  });
  const { selectedMonth, updateAvailableMonths } = useMonth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const storedTransactions = await getTransactions();
        setAllTransactions(storedTransactions);
        updateAvailableMonths(storedTransactions);

        const [selectedYear, selectedMonthNum] = selectedMonth.split('-').map(Number);
        
        const filteredMonthTransactions = storedTransactions.filter(t => {
          if (!t.date) return false;
          const d = new Date(t.date);
          return d.getFullYear() === selectedYear && (d.getMonth() + 1) === selectedMonthNum;
        });

        setMonthTransactions(filteredMonthTransactions);

        const totalExpenses = filteredMonthTransactions
          .filter(t => t.type === 'expense')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

        const totalActualIncome = filteredMonthTransactions
          .filter(t => t.type === 'income')
          .reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0);

        const netBalance = totalActualIncome - totalExpenses;

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

        const prevNetBalance = prevTotalIncome - prevTotalExpenses;

        const incomeChange = calculatePercentageChange(totalActualIncome, prevTotalIncome);
        const expenseChange = calculatePercentageChange(totalExpenses, prevTotalExpenses);
        const netChange = calculatePercentageChange(netBalance, prevNetBalance);

        setStats({
          totalIncome: totalActualIncome,
          totalExpenses: totalExpenses,
          netBalance: netBalance,
          incomeChange,
          expenseChange,
          netChange,
        });

      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedMonth]);

  const incomeValue = useCountUp(stats.totalIncome, 1000, 2);
  const expenseValue = useCountUp(stats.totalExpenses, 1000, 2);
  const netValue = useCountUp(stats.netBalance, 1000, 2);

  function handleDownloadReport() {
    if (monthTransactions.length === 0) return;

    const summaryHeaders = ['Report Type', 'Month', 'Total Income', 'Total Expenses', 'Net Balance'];
    const summaryData = [
      'Monthly Financial Report',
      selectedMonth,
      stats.totalIncome.toFixed(2),
      stats.totalExpenses.toFixed(2),
      stats.netBalance.toFixed(2)
    ];

    const transactionHeaders = ['Date', 'Description', 'Category', 'Type', 'Amount', 'Payment Mode'];
    const transactionRows = monthTransactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      `"${t.description.replace(/"/g, '""')}"`,
      t.category,
      t.type,
      t.amount.toFixed(2),
      t.paymentMode || 'cash'
    ].join(','));

    const csvContent = [
      summaryHeaders.join(','),
      summaryData.join(','),
      '',
      'DETAILED TRANSACTIONS',
      transactionHeaders.join(','),
      ...transactionRows
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `financial_report_${selectedMonth}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleExportPDF() {
    if (monthTransactions.length === 0) return;

    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text('Financial Report', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Month: ${selectedMonth}`, 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 36);

    // Summary Table
    const summaryData = [
      ['Total Income', `Rs. ${stats.totalIncome.toLocaleString()}`],
      ['Total Expenses', `Rs. ${stats.totalExpenses.toLocaleString()}`],
      ['Net Balance', `Rs. ${stats.netBalance.toLocaleString()}`],
    ];

    autoTable(doc, {
      startY: 45,
      head: [['Summary', 'Amount']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] },
    });

    const finalY = doc.lastAutoTable?.finalY || 100;

    // Transactions Table
    const tableData = monthTransactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.description,
      t.category,
      t.type.toUpperCase(),
      `Rs. ${t.amount.toLocaleString()}`,
      t.paymentMode || 'cash'
    ]);

    autoTable(doc, {
      startY: finalY + 15,
      head: [['Date', 'Description', 'Category', 'Type', 'Amount', 'Mode']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [31, 41, 55] },
      styles: { fontSize: 9 },
    });

    doc.save(`financial_report_${selectedMonth}.pdf`);
  }

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Financial Analytics</h1>
          <p className="text-base text-gray-500 dark:text-gray-400">Overview of your income, expenses, and spending habits</p>
        </div>

        <div className="flex items-center gap-3">
          <MonthSelector />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="w-10 h-10 rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-colors"
                disabled={monthTransactions.length === 0}
              >
                <Download className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <div className="px-2 py-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Export Options
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDownloadReport}
                className="flex items-center gap-2 cursor-pointer py-2.5"
              >
                <div className="w-8 h-8 rounded bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <span className="text-[10px] font-bold">CSV</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Export as CSV</p>
                  <p className="text-[10px] text-gray-500">For spreadsheets</p>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={handleExportPDF}
                className="flex items-center gap-2 cursor-pointer py-2.5"
              >
                <div className="w-8 h-8 rounded bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-600 dark:text-red-400">
                  <span className="text-[10px] font-bold">PDF</span>
                </div>
                <div>
                  <p className="text-sm font-medium">Export as PDF</p>
                  <p className="text-[10px] text-gray-500">For printing</p>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <StatCard 
          title="Total Income" 
          value={stats.totalIncome} 
          change={stats.incomeChange}
          type="income" 
          isLoading={isLoading} 
        />

        <StatCard 
          title="Total Expenses" 
          value={stats.totalExpenses} 
          change={stats.expenseChange}
          type="expense" 
          isLoading={isLoading} 
        />

        <StatCard 
          title="Net Balance" 
          value={stats.netBalance} 
          change={stats.netChange}
          type="balance" 
          isLoading={isLoading} 
        />
      </div>

      {/* Charts Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-[2]">
          <SpendingChart transactions={allTransactions} isLoading={isLoading} />
        </div>
        <div className="flex-[1]">
          <CategoryChart transactions={allTransactions} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
