import { useState, useMemo, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { useMonth } from '@/context/MonthContext';
import { useTheme } from '@/context/ThemeContext';

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

const cn = (...classes) => classes.filter(Boolean).join(" ");

export function CategoryChart({ transactions = [], isLoading }) {
  const [timeRange, setTimeRange] = useState("week");
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const { selectedMonth } = useMonth();
  const { darkMode } = useTheme();

  useEffect(() => {
    setIsLocalLoading(true);
    const timer = setTimeout(() => {
      setIsLocalLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [timeRange, transactions, selectedMonth]);

  const { catData, totalIncome, totalExpense } = useMemo(() => {
    if (!transactions || transactions.length === 0) {
      return { catData: [], totalIncome: 0, totalExpense: 0 };
    }

    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    let filteredTransactions = [];

    if (timeRange === 'week') {
      const daysInMonth = new Date(year, month, 0).getDate();
      const isCurrentMonth = new Date().getFullYear() === year && (new Date().getMonth() + 1) === month;
      
      const endDateObj = isCurrentMonth ? new Date() : new Date(year, month - 1, daysInMonth);
      endDateObj.setHours(23, 59, 59, 999);
      
      const startDateObj = new Date(endDateObj);
      startDateObj.setDate(startDateObj.getDate() - 6);
      startDateObj.setHours(0, 0, 0, 0);

      filteredTransactions = transactions.filter(t => {
        if (!t.date) return false;
        const d = new Date(t.date);
        return d >= startDateObj && d <= endDateObj;
      });
    } else if (timeRange === 'month') {
      filteredTransactions = transactions.filter(t => {
        if (!t.date) return false;
        const d = new Date(t.date);
        return d.getFullYear() === year && (d.getMonth() + 1) === month;
      });
    } else if (timeRange === 'year') {
      filteredTransactions = transactions.filter(t => {
        if (!t.date) return false;
        const d = new Date(t.date);
        return d.getFullYear() === year;
      });
    }

    const totals = filteredTransactions.reduce((acc, t) => {
      const amt = parseFloat(t.amount) || 0;
      if (t.type === 'income') acc.totalIncome += amt;
      else if (t.type === 'expense') acc.totalExpense += amt;
      return acc;
    }, { totalIncome: 0, totalExpense: 0 });

    const expenseTransactions = filteredTransactions.filter(t => t.type === 'expense');
    const categoriesMap = {};

    expenseTransactions.forEach(t => {
      const amt = parseFloat(t.amount) || 0;
      categoriesMap[t.category] = (categoriesMap[t.category] || 0) + amt;
    });

    const mappedCatData = Object.keys(categoriesMap).map(catName => ({
      name: catName,
      value: categoriesMap[catName],
      color: categoryColors[catName] || '#6B7280'
    })).sort((a, b) => b.value - a.value);

    return { catData: mappedCatData, ...totals };
  }, [transactions, timeRange, selectedMonth]);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  const showLoading = isLoading || isLocalLoading;

  if (showLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/80 shadow-sm h-full flex flex-col min-h-[440px]">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-3">
            <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded-lg animate-shimmer" />
            <div className="h-4 w-40 bg-gray-150 dark:bg-gray-700/85 rounded animate-shimmer" />
          </div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-shimmer" />
        </div>
        <div className="h-44 w-44 rounded-full mx-auto bg-gray-50 dark:bg-gray-700/35 border-8 border-gray-100 dark:border-gray-700/80 animate-shimmer mb-8" />
        <div className="space-y-4 flex-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                <div className="h-4 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
              </div>
              <div className="h-2 w-full bg-gray-100 dark:bg-gray-750 rounded-full animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 border border-gray-100 dark:border-gray-700/80 shadow-sm h-full flex flex-col transition-all duration-300 hover:shadow-md min-h-[440px]">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">Spending by Category</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Expense distributions</p>
          </div>
          <div className="flex items-center gap-4 bg-gray-50/80 dark:bg-gray-950/40 px-4 py-2 rounded-xl border border-gray-100/50 dark:border-gray-900/50 self-start transition-all hover:bg-gray-100/50 dark:hover:bg-gray-950/60">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold">Income</span>
              <span className="text-sm font-bold text-emerald-500 dark:text-emerald-400">
                ₹{totalIncome.toLocaleString()}
              </span>
            </div>
            <div className="h-3 w-px bg-gray-200 dark:bg-gray-800" />
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold">Expense</span>
              <span className="text-sm font-bold text-rose-500 dark:text-rose-400">
                ₹{totalExpense.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex bg-gray-100/80 dark:bg-gray-900/80 backdrop-blur-sm rounded-xl p-1 self-start border border-gray-200/20 dark:border-gray-800/40">
          {["week", "month", "year"].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                "px-4 py-2 text-xs font-bold rounded-lg transition-all capitalize",
                timeRange === range
                  ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm border border-gray-200/10"
                  : "text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>
      
      {/* Interactive Pie Chart */}
      <div className="relative h-60 w-full mb-8 flex items-center justify-center">
        {catData.length > 0 ? (
          <>
            <div className="relative h-56 w-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={catData}
                    cx="50%"
                    cy="50%"
                    innerRadius={66}
                    outerRadius={88}
                    paddingAngle={4}
                    dataKey="value"
                    onMouseEnter={onPieEnter}
                    onMouseLeave={onPieLeave}
                  >
                    {catData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color} 
                        stroke={darkMode ? "#1F2937" : "#FFFFFF"}
                        strokeWidth={activeIndex === index ? 3 : 1}
                        opacity={activeIndex === -1 || activeIndex === index ? 1 : 0.5}
                        style={{ outline: 'none', transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)' }}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              {/* Dynamic Center Typography */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                {activeIndex === -1 ? (
                  <>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 uppercase tracking-widest font-bold">Total Expense</span>
                    <span className="text-xl font-black text-gray-900 dark:text-gray-100 transition-all duration-300">
                      ₹{totalExpense.toLocaleString()}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] uppercase tracking-widest font-black truncate max-w-[120px] transition-all duration-300" style={{ color: catData[activeIndex].color }}>
                      {catData[activeIndex].name}
                    </span>
                    <span className="text-xl font-black text-gray-900 dark:text-gray-100 transition-all duration-300">
                      ₹{catData[activeIndex].value.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold mt-0.5">
                      {((catData[activeIndex].value / (totalExpense || 1)) * 100).toFixed(0)}% of total
                    </span>
                  </>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-100 dark:border-gray-800 rounded-2xl p-8 text-center select-none font-medium">
            No spending data for this period
          </div>
        )}
      </div>

      {/* Category List */}
      <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar flex-1">
        {catData.map((item, index) => {
          const pct = totalExpense > 0 ? ((item.value / totalExpense) * 100).toFixed(0) : 0;
          return (
            <div 
              key={item.name} 
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(-1)}
              className={cn(
                "p-3 rounded-2xl border border-transparent transition-all duration-250 cursor-pointer flex flex-col gap-2 hover:bg-gray-50 dark:hover:bg-gray-900/30",
                activeIndex === index && "bg-gray-50 dark:bg-gray-900/30 border-gray-100/10 dark:border-gray-800/20 shadow-sm"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-2.5 h-2.5 rounded-full shadow-sm"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                    {item.name}
                  </span>
                  <span className="text-[9px] font-extrabold text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md transition-all">
                    {pct}%
                  </span>
                </div>
                <span className="text-sm font-extrabold text-gray-950 dark:text-gray-50">
                  ₹{item.value.toLocaleString()}
                </span>
              </div>
              <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    backgroundColor: item.color, 
                    width: `${pct}%`,
                    opacity: activeIndex === -1 || activeIndex === index ? 1 : 0.5
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
