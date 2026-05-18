import { TrendingUp, TrendingDown, Wallet, ArrowDownLeft, ArrowUpRight, PiggyBank } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCountUp } from '@/hooks/useCountUp';

const icons = {
  balance: Wallet,
  income: ArrowDownLeft,
  expense: ArrowUpRight,
  savings: PiggyBank,
};

const iconColors = {
  balance: 'bg-gray-100 text-gray-600',
  income: 'bg-emerald-100 text-emerald-600',
  expense: 'bg-red-100 text-red-600',
  savings: 'bg-blue-100 text-blue-600',
};

export function StatCard({ title, value, change, type, isLoading, comparisonLabel = "from last month" }) {
  const Icon = icons[type];
  const isTrendPositive = type === 'expense' ? change <= 0 : change >= 0;
  const isPositive = change >= 0;
  const isValuePositive = value >= 0;
  const animatedValue = useCountUp(value, 1000, 2);

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="space-y-2">
            <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
            <div className="h-8 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
          </div>
          <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg animate-shimmer" />
        </div>
        <div className="h-4 w-28 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-7 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center">
      <div className={cn('p-3.5 rounded-2xl mb-4', iconColors[type])}>
        <Icon className="w-6 h-6" />
      </div>
      
      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">{title}</p>
      
      <p className={cn(
        "text-3xl font-bold mb-4",
        type === 'expense' ? "text-red-600" : isValuePositive ? "text-emerald-600" : "text-red-600"
      )}>
        ₹{animatedValue}
      </p>

      <div className="flex items-center justify-center gap-1.5 py-1.5 px-3 bg-gray-50 dark:bg-gray-700/50 rounded-full border border-gray-100 dark:border-gray-700">
        {(change !== undefined && change !== null) ? (
          <>
            {isPositive ? (
              <TrendingUp className={cn("w-4 h-4", isTrendPositive ? "text-emerald-500" : "text-red-500")} />
            ) : (
              <TrendingDown className={cn("w-4 h-4", isTrendPositive ? "text-emerald-500" : "text-red-500")} />
            )}
            <span
              className={cn(
                'text-sm font-bold',
                isTrendPositive ? 'text-emerald-500' : 'text-red-500'
              )}
            >
              {isPositive ? '+' : ''}{change}%
            </span>
            <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{comparisonLabel}</span>
          </>
        ) : (
          <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{comparisonLabel}</span>
        )}
      </div>
    </div>
  );
}
