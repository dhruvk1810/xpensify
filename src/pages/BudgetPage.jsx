import { useState, useMemo, useEffect } from 'react';
import { 
  ChevronLeft, ChevronRight, ArrowRight, RotateCcw, Wand2, 
  Home, ShoppingBasket, Zap, Film, Bus, UtensilsCrossed, 
  ShoppingCart, Heart, GraduationCap, Wallet, Download,
  TrendingUp, PiggyBank, Save, ArrowDownLeft, ArrowUpRight,
  HandCoins
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn, calculatePercentageChange } from '@/lib/utils';
import { getBudget, saveBudget, getTransactions } from '@/lib/api';
import { useMonth } from '@/context/MonthContext';
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

const categoryConfig = {
  'Groceries': { icon: ShoppingBasket, color: '#10B981' },
  'Utilities': { icon: Zap, color: '#3B82F6' },
  'Entertainment': { icon: Film, color: '#F59E0B' },
  'Transport': { icon: Bus, color: '#EF4444' },
  'Food & Drink': { icon: UtensilsCrossed, color: '#EC4899' },
  'Shopping': { icon: ShoppingCart, color: '#8B5CF6' },
  'Healthcare': { icon: Heart, color: '#6366F1' },
  'Education': { icon: GraduationCap, color: '#EAB308' },
  'Other': { icon: Wallet, color: '#6B7280' },
};

const defaultCategories = Object.keys(categoryConfig).map(name => ({
  categoryId: name.toLowerCase().replace(/\s+/g, '-'),
  name,
  allocated: 0,
  spent: 0,
  color: categoryConfig[name].color
}));

export function BudgetPage() {
  const { selectedMonth, setSelectedMonth, getMonthLabel, availableMonths, updateAvailableMonths } = useMonth();
  const [income, setIncome] = useState('0');
  const [savingsGoal, setSavingsGoal] = useState('0');
  const [categories, setCategories] = useState(defaultCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [budgetId, setBudgetId] = useState(null);

  // Parse selected month
  const [selectedYear, selectedMonthNum] = selectedMonth.split('-').map(Number);
  const monthName = new Date(selectedYear, selectedMonthNum - 1).toLocaleString('en-US', { month: 'long' });

  useEffect(() => {
    const loadBudget = async () => {
      setIsLoading(true);
      try {
        const [budgetData, transactionsData] = await Promise.all([
          getBudget(monthName, selectedYear),
          getTransactions()
        ]);

        updateAvailableMonths(transactionsData);

        const spendingMap = {};
        transactionsData.forEach(t => {
          if (!t.date || t.type !== 'expense') return;
          const d = new Date(t.date);
          if (d.getFullYear() === selectedYear && (d.getMonth() + 1) === selectedMonthNum) {
            spendingMap[t.category] = (spendingMap[t.category] || 0) + (parseFloat(t.amount) || 0);
          }
        });

        if (budgetData) {
          setBudgetId(budgetData._id);
          setIncome(budgetData.income?.toString() || '0');
          setSavingsGoal(budgetData.savingsGoal?.toString() || '0');
          
          const mergedCategories = defaultCategories.map(def => {
            const saved = budgetData.categories?.find(c => c.name === def.name);
            return {
              ...def,
              allocated: saved ? parseFloat(saved.allocated || '0') : 0,
              spent: spendingMap[def.name] || 0
            };
          });
          setCategories(mergedCategories);
        } else {
          setBudgetId(null);
          setIncome('0');
          setSavingsGoal('0');
          setCategories(defaultCategories.map(cat => ({
            ...cat,
            spent: spendingMap[cat.name] || 0
          })));
        }
      } catch (error) {
        console.error('Error loading budget:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBudget();
  }, [selectedMonth, monthName, selectedYear, selectedMonthNum]);

  const totalAvailable = Math.max(0, parseFloat(income || '0') - parseFloat(savingsGoal || '0'));
  
  const savingsRate = useMemo(() => {
    const inc = parseFloat(income || '0');
    const goal = parseFloat(savingsGoal || '0');
    return inc > 0 ? (goal / inc) * 100 : 0;
  }, [income, savingsGoal]);

  const totalPlanned = useMemo(() => {
    return categories.reduce((sum, category) => sum + parseFloat(category.allocated || '0'), 0);
  }, [categories]);

  const totalActualSpent = useMemo(() => {
    return categories.reduce((sum, category) => sum + category.spent, 0);
  }, [categories]);

  const actualSavings = useMemo(() => {
    return Math.max(0, parseFloat(income || '0') - totalActualSpent);
  }, [income, totalActualSpent]);

  const projectedSavings = useMemo(() => {
    return parseFloat(income || '0') - totalPlanned;
  }, [income, totalPlanned]);

  const savingsDiffPercent = useMemo(() => {
    return calculatePercentageChange(actualSavings, parseFloat(savingsGoal || '0'));
  }, [actualSavings, savingsGoal]);

  const spendingDiffPercent = useMemo(() => {
    return calculatePercentageChange(totalActualSpent, totalPlanned);
  }, [totalActualSpent, totalPlanned]);

  const handleReset = () => {
    setIncome('0');
    setSavingsGoal('0');
    setCategories(defaultCategories);
  };

  const handleSaveBudget = async () => {
    setIsSaving(true);
    try {
      const data = await saveBudget({
        month: monthName,
        year: selectedYear,
        income: parseFloat(income || '0'),
        savingsGoal: parseFloat(savingsGoal || '0'),
        categories: categories.map(cat => ({
          categoryId: cat.categoryId,
          name: cat.name,
          allocated: parseFloat(cat.allocated || '0'),
          spent: parseFloat(cat.spent || '0'),
          color: categoryConfig[cat.name]?.color || cat.color,
        })),
      });
      if (data._id) setBudgetId(data._id);
    } catch (error) {
      console.error('Error saving budget:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCategoryAllocationChange = (categoryId, newValue) => {
    setCategories((prevCategories) =>
      prevCategories.map((cat) =>
        cat.categoryId === categoryId
          ? { ...cat, allocated: parseFloat(newValue || '0') }
          : cat
      )
    );
  };

  const handleAutoFill = () => {
    if (totalAvailable <= 0) return;
    const weights = {
      'Groceries': 0.25, 'Utilities': 0.15, 'Food & Drink': 0.15,
      'Transport': 0.10, 'Shopping': 0.10, 'Healthcare': 0.10,
      'Education': 0.05, 'Entertainment': 0.05, 'Other': 0.05,
    };
    setCategories(prev => prev.map(cat => ({
      ...cat,
      allocated: Math.floor(totalAvailable * (weights[cat.name] || 0.05))
    })));
  };

  const handleMonthChange = (direction) => {
    const currentIndex = availableMonths.indexOf(selectedMonth);
    if (direction === 'next' && currentIndex > 0) {
      setSelectedMonth(availableMonths[currentIndex - 1]);
    } else if (direction === 'prev' && currentIndex < availableMonths.length - 1) {
      setSelectedMonth(availableMonths[currentIndex + 1]);
    }
  };

  function handleDownloadBudget() {
    const rows = [
      ['Metric', 'Value'],
      ['Report', `Budget Plan - ${getMonthLabel(selectedMonth)}`],
      ['Total Income', parseFloat(income || '0').toFixed(2)],
      ['Savings Goal', parseFloat(savingsGoal || '0').toFixed(2)],
      ['Actual Savings', actualSavings.toFixed(2)],
      ['Total Planned', totalPlanned.toFixed(2)],
      ['Total Spent', totalActualSpent.toFixed(2)],
      ['Projected Savings', projectedSavings.toFixed(2)],
      ['Savings Rate', `${savingsRate.toFixed(1)}%`],
      [],
      ['Category Name', 'Allocated Amount', 'Spent Amount', '% of Category Budget'],
      ...categories.map(cat => [
        `"${cat.name}"`,
        parseFloat(cat.allocated || '0').toFixed(2),
        parseFloat(cat.spent || '0').toFixed(2),
        `${cat.allocated > 0 ? ((cat.spent / cat.allocated) * 100).toFixed(0) : 0}%`
      ])
    ];

    const csvContent = rows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `budget_plan_${selectedMonth}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleExportPDF() {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.setTextColor(16, 185, 129); // emerald-500
    doc.text('Monthly Budget Plan', 14, 22);
    
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Month: ${getMonthLabel(selectedMonth)}`, 14, 30);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 36);

    // Summary Info
    const summaryData = [
      ['Total Income', `Rs. ${parseFloat(income || '0').toLocaleString()}`],
      ['Savings Goal', `Rs. ${parseFloat(savingsGoal || '0').toLocaleString()}`],
      ['Total Planned', `Rs. ${totalPlanned.toLocaleString()}`],
      ['Total Spent', `Rs. ${totalActualSpent.toLocaleString()}`],
      ['Actual Savings', `Rs. ${actualSavings.toLocaleString()}`],
    ];

    autoTable(doc, {
      startY: 45,
      head: [['Summary', 'Amount']],
      body: summaryData,
      theme: 'striped',
      headStyles: { fillColor: [16, 185, 129] },
    });

    const finalY = doc.lastAutoTable?.finalY || 100;

    // Categories Table
    const tableData = categories.map(cat => [
      cat.name,
      `Rs. ${cat.allocated.toLocaleString()}`,
      `Rs. ${cat.spent.toLocaleString()}`,
      `Rs. ${(cat.allocated - cat.spent).toLocaleString()}`,
      `${cat.allocated > 0 ? ((cat.spent / cat.allocated) * 100).toFixed(0) : 0}%`
    ]);

    autoTable(doc, {
      startY: finalY + 15,
      head: [['Category', 'Allocated', 'Spent', 'Remaining', '% Used']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [31, 41, 55] },
      styles: { fontSize: 9 },
    });

    doc.save(`budget_plan_${selectedMonth}.pdf`);
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse p-6">
        <div className="h-10 w-48 bg-gray-200 dark:bg-gray-700 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {[1,2,3,4,5].map(i => <div key={i} className="h-32 bg-gray-100 dark:bg-gray-700/50 rounded-xl" />)}
        </div>
        <div className="h-96 bg-gray-100 dark:bg-gray-700/50 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto animate-fade-in pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Budget Planner</h1>
          <p className="text-base text-gray-500 dark:text-gray-400">Plan and track your monthly spending</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-1 shadow-sm transition-colors">
            <button 
              onClick={() => handleMonthChange('prev')}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-30"
              disabled={availableMonths.indexOf(selectedMonth) === availableMonths.length - 1}
            >
              <ChevronLeft className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
            <span className="font-medium text-gray-900 dark:text-gray-100 px-4 min-w-[120px] text-center text-base">
              {getMonthLabel(selectedMonth)}
            </span>
            <button 
              onClick={() => handleMonthChange('next')}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors disabled:opacity-30"
              disabled={availableMonths.indexOf(selectedMonth) === 0}
            >
              <ChevronRight className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="icon" 
                className="w-10 h-10 rounded-lg border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-colors"
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
                onClick={handleDownloadBudget}
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

      {/* Stat Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <StatCard 
          title="Monthly Income" 
          value={parseFloat(income || '0')} 
          type="income" 
          isLoading={isLoading} 
          comparisonLabel={`Total for ${monthName}`}
        />
        
        <StatCard 
          title="Savings Goal" 
          value={parseFloat(savingsGoal || '0')} 
          type="savings" 
          isLoading={isLoading} 
          comparisonLabel={`${savingsRate.toFixed(1)}% target`}
        />

        <StatCard 
          title="Actual Savings" 
          value={actualSavings} 
          change={savingsDiffPercent}
          type="savings" 
          isLoading={isLoading} 
          comparisonLabel="from goal"
        />

        <StatCard 
          title="Total Planned" 
          value={totalPlanned} 
          type="balance" 
          isLoading={isLoading} 
          comparisonLabel="Budget allocations"
        />

        <StatCard 
          title="Total Spent" 
          value={totalActualSpent} 
          change={spendingDiffPercent}
          type="expense" 
          isLoading={isLoading} 
          comparisonLabel="from plan"
        />
      </div>

      {/* Main Configuration Card */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm p-6 mb-8 transition-colors">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Budget Settings</h2>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} className="gap-2 text-base dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
              <RotateCcw className="w-4 h-4" /> Reset
            </Button>
            <Button onClick={handleSaveBudget} disabled={isSaving} className="bg-emerald-500 hover:bg-emerald-600 text-white gap-2 text-base">
              {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Settings</>}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2 block">Monthly Income</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">₹</span>
              <Input
                type="number"
                value={income}
                onChange={(e) => setIncome(e.target.value)}
                className="pl-8 h-12 text-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-emerald-500"
                placeholder="0.00"
              />
            </div>
          </div>
          <div>
            <label className="text-base font-medium text-gray-700 dark:text-gray-300 mb-2 block">Savings Goal</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">₹</span>
              <Input
                type="number"
                value={savingsGoal}
                onChange={(e) => setSavingsGoal(e.target.value)}
                className="pl-8 h-12 text-lg border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 focus:ring-blue-500"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm overflow-hidden transition-colors">
        <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between bg-gray-50/30 dark:bg-gray-700/30">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Category Allocation</h2>
            <p className="text-base text-gray-500 dark:text-gray-400">Distribute your available funds across categories</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" size="sm" onClick={handleAutoFill} className="gap-2 text-base dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-700">
              <Wand2 className="w-4 h-4" /> Auto-Fill
            </Button>
            <Button size="sm" onClick={handleSaveBudget} disabled={isSaving} className="bg-emerald-500 hover:bg-emerald-600 text-white text-base">
              Confirm Changes
            </Button>
          </div>
        </div>

        <div className="divide-y divide-gray-50 dark:divide-gray-700">
          {categories.map((category) => {
            const spentPercent = category.allocated > 0 ? (category.spent / category.allocated) * 100 : 0;
            const isOver = spentPercent > 100;
            const config = categoryConfig[category.name] || categoryConfig['Other'];
            const Icon = config.icon;

            return (
              <div key={category.categoryId} className="p-6 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                  {/* Category Info */}
                  <div className="flex items-center gap-4 min-w-[240px]">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${config.color}15` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: config.color }} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">{category.name}</h3>
                      <p className="text-base text-gray-500 dark:text-gray-400">₹{category.allocated.toLocaleString()} planned</p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex-1">
                    <div className="flex justify-between mb-2">
                      <span className={cn(
                        "text-base font-medium",
                        isOver ? "text-red-600" : "text-emerald-600"
                      )}>
                        {spentPercent.toFixed(0)}% used
                      </span>
                      <span className="text-base text-gray-400 dark:text-gray-500">
                        ₹{(category.allocated - category.spent).toLocaleString()} remaining
                      </span>
                    </div>
                    <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full transition-all duration-500",
                          isOver ? "bg-red-500" : "bg-emerald-500"
                        )}
                        style={{ width: `${Math.min(spentPercent, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Allocation Input */}
                  <div className="flex items-center gap-4 lg:w-48 justify-end">
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base">₹</span>
                      <Input
                        type="number"
                        value={category.allocated}
                        onChange={(e) => handleCategoryAllocationChange(category.categoryId, e.target.value)}
                        className="w-32 pl-7 h-10 text-base font-medium border-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 text-right focus:ring-emerald-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
