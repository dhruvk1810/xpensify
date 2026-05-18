import { Check } from 'lucide-react';

const features = [
  'Quick-add widgets',
  'Custom categories & tags',
  'Recurring transactions support',
];

export function SmartEntry() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-800 p-6 max-w-md mx-auto transition-colors">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">Add Expense</h3>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">&times;</button>
              </div>
              {/* Mock Form */}
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block transition-colors">Amount</label>
                  <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors">
                    <span className="text-gray-500 dark:text-gray-400">₹</span>
                    <span className="text-gray-400 dark:text-gray-500">0.00</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block transition-colors">Date</label>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 text-sm transition-colors">
                      Today
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block transition-colors">Category</label>
                    <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 text-sm transition-colors">
                      Select...
                    </div>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block transition-colors">Description</label>
                  <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 text-sm transition-colors">
                    Enter description...
                  </div>
                </div>
                <button className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-medium shadow-lg shadow-emerald-500/20 transition-all">
                  Save Expense
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            <span className="text-sm font-semibold text-emerald-500 uppercase tracking-wide">
              Smart Entry
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mt-3 mb-6">
              Adding expenses has never been this fast
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
              We know you&apos;re busy. That&apos;s why we optimized the expense entry process 
              to be lightning fast, so you can log it and forget it.
            </p>
            <ul className="space-y-4">
              {features.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0 transition-colors">
                    <Check className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
