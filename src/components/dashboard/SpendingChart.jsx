import { useState, useMemo, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useMonth } from "@/context/MonthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const cn = (...classes) => classes.filter(Boolean).join(" ");

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const income = payload.find(p => p.dataKey === 'income')?.value || 0;
    const expense = payload.find(p => p.dataKey === 'expense')?.value || 0;
    const savings = income - expense;
    const savingsRate = income > 0 ? ((savings / income) * 100).toFixed(0) : null;

    return (
      <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border border-gray-100 dark:border-gray-800 p-4 rounded-2xl shadow-xl space-y-3 min-w-[200px] transition-all">
        <div className="text-xs font-semibold text-gray-400 dark:text-gray-500 tracking-wider uppercase">
          {label}
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Income
            </span>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              ₹{income.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              Expense
            </span>
            <span className="font-bold text-gray-900 dark:text-gray-100">
              ₹{expense.toLocaleString()}
            </span>
          </div>
        </div>
        {income > 0 && (
          <div className="border-t border-gray-100 dark:border-gray-800 pt-2 flex items-center justify-between text-xs">
            <span className="text-gray-400">Savings Rate</span>
            <span className={cn(
              "font-semibold px-2 py-0.5 rounded-full",
              savings >= 0 
                ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/30" 
                : "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/30"
            )}>
              {savings >= 0 ? "+" : ""}{savingsRate}%
            </span>
          </div>
        )}
      </div>
    );
  }
  return null;
};

export function SpendingChart({ transactions = [], isLoading }) {
  const [timeRange, setTimeRange] = useState("week");
  const [isLocalLoading, setIsLocalLoading] = useState(false);
  const { darkMode } = useTheme();
  const { selectedMonth } = useMonth();

  useEffect(() => {
    setIsLocalLoading(true);
    const timer = setTimeout(() => {
      setIsLocalLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [timeRange, transactions, selectedMonth]);

  const processedData = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    
    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10);

    if (timeRange === 'week') {
      const daysInMonth = new Date(year, month, 0).getDate();
      const isCurrentMonth = new Date().getFullYear() === year && (new Date().getMonth() + 1) === month;
      
      const endDate = isCurrentMonth ? new Date() : new Date(year, month - 1, daysInMonth);
      
      const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date(endDate);
        d.setDate(d.getDate() - i);
        return d;
      }).reverse();

      return last7Days.map(dateObj => {
        const dayStr = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        const dayTransactions = transactions.filter(t => {
          if (!t.date) return false;
          const d = new Date(t.date);
          return d.getDate() === dateObj.getDate() && 
                 d.getMonth() === dateObj.getMonth() && 
                 d.getFullYear() === dateObj.getFullYear();
        });

        return {
          name: dayStr,
          income: dayTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
          expense: dayTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + (parseFloat(t.amount) || 0), 0),
        };
      });
    }

    if (timeRange === 'month') {
      const data = [
        { name: 'Week 1', income: 0, expense: 0 },
        { name: 'Week 2', income: 0, expense: 0 },
        { name: 'Week 3', income: 0, expense: 0 },
        { name: 'Week 4', income: 0, expense: 0 },
      ];

      transactions.forEach(t => {
        if (!t.date) return;
        const d = new Date(t.date);
        if (d.getFullYear() === year && (d.getMonth() + 1) === month) {
          const dateNum = d.getDate();
          let weekIndex = Math.floor((dateNum - 1) / 7);
          if (weekIndex > 3) weekIndex = 3; 
          
          const amt = parseFloat(t.amount) || 0;
          if (t.type === 'income') data[weekIndex].income += amt;
          else if (t.type === 'expense') data[weekIndex].expense += amt;
        }
      });
      return data;
    }

    if (timeRange === 'year') {
      const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const data = months.map(m => ({ name: m, income: 0, expense: 0 }));

      transactions.forEach(t => {
        if (!t.date) return;
        const d = new Date(t.date);
        if (d.getFullYear() === year) {
          const mIndex = d.getMonth();
          const amt = parseFloat(t.amount) || 0;
          if (t.type === 'income') data[mIndex].income += amt;
          else if (t.type === 'expense') data[mIndex].expense += amt;
        }
      });
      return data;
    }

    return [];
  }, [transactions, timeRange, selectedMonth]);

  const { totalIncome, totalExpense } = useMemo(() => {
    return processedData.reduce(
      (acc, curr) => ({
        totalIncome: acc.totalIncome + curr.income,
        totalExpense: acc.totalExpense + curr.expense,
      }),
      { totalIncome: 0, totalExpense: 0 }
    );
  }, [processedData]);

  const showLoading = isLoading || isLocalLoading;

  if (showLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700/80 shadow-sm h-full flex flex-col min-h-[440px]">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-3">
            <div className="h-6 w-36 bg-gray-200 dark:bg-gray-700 rounded-lg animate-shimmer" />
            <div className="h-8 w-60 bg-gray-150 dark:bg-gray-700/80 rounded-xl animate-shimmer" />
          </div>
          <div className="h-10 w-32 bg-gray-200 dark:bg-gray-700 rounded-xl animate-shimmer" />
        </div>
        <div className="flex-1 bg-gray-50/50 dark:bg-gray-750/30 rounded-2xl animate-shimmer border border-dashed border-gray-100 dark:border-gray-700" />
      </div>
    );
  }

  const formatYAxis = (value) => {
    if (value >= 1000) return `₹${(value / 1000).toFixed(0)}k`;
    return `₹${value?.toString() || "0"}`;
  };

  return (
    <div className="bg-white dark:bg-gray-800/90 backdrop-blur-md rounded-2xl p-6 border border-gray-100 dark:border-gray-700/80 shadow-sm h-full flex flex-col transition-all duration-300 hover:shadow-md min-h-[440px]">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 tracking-tight">Spending Trends</h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 font-medium">Income vs Expense analysis</p>
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

      {/* Recharts section */}
      <div className="flex-1 h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={processedData} barGap={8} margin={{ left: -10, right: 10 }}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity={1} />
                <stop offset="100%" stopColor="#059669" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F43F5E" stopOpacity={1} />
                <stop offset="100%" stopColor="#E11D48" stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke={darkMode ? "#374151" : "#F3F4F6"}
              vertical={false}
            />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: darkMode ? "#6B7280" : "#9CA3AF", fontSize: 11, fontWeight: "600" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: darkMode ? "#6B7280" : "#9CA3AF", fontSize: 11, fontWeight: "600" }}
              tickFormatter={formatYAxis}
              dx={-5}
            />
            <Tooltip 
              cursor={{ fill: darkMode ? "rgba(55, 65, 81, 0.2)" : "rgba(243, 244, 246, 0.5)", radius: 8 }}
              content={<CustomTooltip />}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ paddingBottom: '24px', fontSize: '11px', fontWeight: 'bold' }}
            />
            <Bar
              dataKey="income"
              name="Income"
              fill="url(#incomeGrad)"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
              animationDuration={800}
            />
            <Bar
              dataKey="expense"
              name="Expense"
              fill="url(#expenseGrad)"
              radius={[6, 6, 0, 0]}
              maxBarSize={32}
              animationDuration={800}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
