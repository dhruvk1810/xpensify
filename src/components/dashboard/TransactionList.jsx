import { ShoppingCart, Zap, Film, Car, Coffee, Briefcase, Laptop, RefreshCw, Bus, UtensilsCrossed, Heart, GraduationCap, Wallet, ShoppingBasket, Receipt, ChevronRight, Coins, TrendingUp, Gift } from 'lucide-react';
import { useNavigate } from '@/lib/router';
import { cn } from '@/lib/utils';

const iconMap = {
  'shopping-cart': ShoppingCart,
  'shopping-basket': ShoppingBasket,
  'receipt': Receipt,
  'zap': Zap,
  'film': Film,
  'car': Car,
  'coffee': Coffee,
  'briefcase': Briefcase,
  'laptop': Laptop,
  'refresh-cw': RefreshCw,
  'bus': Bus,
  'utensils': UtensilsCrossed,
  'heart': Heart,
  'graduation-cap': GraduationCap,
  'wallet': Wallet,
  'coins': Coins,
  'trending-up': TrendingUp,
  'gift': Gift,
};

const categoryIconMap = {
  'Groceries': 'shopping-basket',
  'Utilities': 'receipt',
  'Entertainment': 'film',
  'Transport': 'bus',
  'Food & Drink': 'utensils',
  'Shopping': 'shopping-cart',
  'Healthcare': 'heart',
  'Education': 'graduation-cap',
  'Other': 'wallet',
  'Salary': 'briefcase',
  'Side Income': 'coins',
  'Freelance': 'trending-up',
  'Investment': 'wallet',
  'Gift': 'gift',
  'Refund': 'refresh-cw',
};

const categoryColors = {
  'Groceries': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Utilities': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'Entertainment': 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  'Transport': 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
  'Food & Drink': 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
  'Salary': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'Side Income': 'bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-400',
  'Freelance': 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  'Investment': 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  'Gift': 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  'Refund': 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  'Shopping': 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
  'Healthcare': 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Education': 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Other': 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
};

export function TransactionList({
  transactions,
  isLoading,
  showViewAll = true,
}) {
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
        <div className="p-6 border-b border-gray-50 dark:border-gray-700 bg-gray-50/30 dark:bg-gray-700/30">
          <div className="h-5 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
        </div>
        <div className="divide-y divide-gray-50 dark:divide-gray-700">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-6">
              <div className="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-shimmer" />
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
                <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
              </div>
              <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-shimmer" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <div className="p-6 border-b border-gray-50 dark:border-gray-700 flex items-center justify-between bg-gray-50/30 dark:bg-gray-700/30">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Transactions</h3>
        {showViewAll && (
          <button
            onClick={() => navigate('/transactions')}
            className="text-base text-emerald-500 hover:text-emerald-600 font-medium flex items-center gap-1 transition-colors"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="divide-y divide-gray-100 dark:divide-gray-700">
        {transactions.map((transaction) => {
          const iconName = categoryIconMap[transaction.category] || transaction.icon || 'shopping-cart';
          const Icon = iconMap[iconName] || ShoppingCart;
          const isIncome = transaction.type === 'income';

          return (
            <div
              key={transaction._id}
              className="flex items-center gap-4 p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
              onClick={() => navigate('/transactions')}
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center transition-colors',
                  categoryColors[transaction.category] || 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                )}
              >
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                  {transaction.description}
                </p>
                <p className="text-base text-gray-500 dark:text-gray-400">
                  {new Date(transaction.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              <span
                className={cn(
                  'font-medium',
                  isIncome ? 'text-emerald-500' : 'text-red-500'
                )}
              >
                {isIncome ? '+' : '-'}₹{transaction.amount.toFixed(2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

