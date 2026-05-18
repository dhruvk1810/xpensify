import { Sparkles, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@/lib/router';

export function Hero() {
  const navigate = useNavigate();

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-full mb-8 animate-fade-in transition-colors">
          <Sparkles className="w-4 h-4 text-emerald-500" />
          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-400">v2.0 is now live</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-tight animate-slide-up">
          Master Your Finances with
          <br />
          Confidence and Clarity
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto animate-slide-up transition-colors" style={{ animationDelay: '100ms' }}>
          Track daily expenses, visualize spending habits, and stick to your budget effortlessly. 
          Join thousands of users achieving financial freedom today.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Button
            size="lg"
            onClick={() => navigate('/signup')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 h-12 text-base"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>

        {/* Dashboard Preview */}
        <div className="relative max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden transition-colors">
            <div className="bg-gray-900 px-4 py-3 flex items-center gap-2 border-b border-gray-800">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-gray-400">expensify.com/dashboard</span>
              </div>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-950 transition-colors">
              {/* Mock Dashboard UI */}
              <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                  { label: 'Total Balance', value: '$12,450', change: '+2.5%' },
                  { label: 'Total Income', value: '$4,200', change: '+12%' },
                  { label: 'Total Expenses', value: '$1,850', change: '+4.3%' },
                  { label: 'Total Savings', value: '$2,350', change: '+8%' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-transparent dark:border-gray-800 transition-colors">
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{stat.value}</p>
                    <p className="text-xs text-emerald-500">{stat.change}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm h-48 flex items-center justify-center border border-transparent dark:border-gray-800 transition-colors">
                  <div className="text-center text-gray-400">
                    <div className="w-full h-32 bg-gradient-to-t from-emerald-100 dark:from-emerald-900/30 to-emerald-50 dark:to-emerald-900/10 rounded-lg mb-2" />
                    <span className="text-xs">Spending Analytics</span>
                  </div>
                </div>
                <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm h-48 flex items-center justify-center border border-transparent dark:border-gray-800 transition-colors">
                  <div className="text-center text-gray-400 dark:text-gray-500">
                    <div className="w-32 h-32 rounded-full border-8 border-emerald-100 dark:border-emerald-900/30 border-t-emerald-500 mx-auto mb-2" />
                    <span className="text-xs">Category Breakdown</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
