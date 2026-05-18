import { Check } from 'lucide-react';

const insights = [
  'Category-wise breakdown',
  'Monthly vs. Yearly comparisons',
  'Income vs. Expense trends',
];

export function Insights() {
  return (
    <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="text-sm font-semibold text-emerald-500 uppercase tracking-wide">
              Deep Insights
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-3 mb-6">
              See the full picture of your financial health
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              Stop guessing where your money went. Our comprehensive reports break down 
              spending patterns so you can make informed decisions.
            </p>
            <ul className="space-y-4">
              {insights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
                    <Check className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 transition-colors">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">Financial Analytics</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Overview of your spending</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs rounded-full">Week</span>
                  <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">Month</span>
                </div>
              </div>
              {/* Mock Chart */}
              <div className="h-64 bg-gradient-to-b from-emerald-50 dark:from-emerald-900/20 to-white dark:to-gray-900 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-end justify-around p-4 transition-colors">
                {[40, 65, 45, 80, 55, 90, 70].map((height, i) => (
                  <div
                    key={i}
                    className="w-8 bg-emerald-500 rounded-t-lg shadow-[0_-4px_12px_-4px_rgba(16,185,129,0.3)]"
                    style={{ height: `${height}%` }}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs text-gray-500 dark:text-gray-400">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <span key={day}>{day}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
