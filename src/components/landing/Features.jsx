import { BarChart2, Wallet, Zap, Shield, Smartphone, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: BarChart2,
    title: 'Visual Analytics',
    description: 'Understand where your money goes with beautiful, interactive charts. View spending by category, week, month, or year instantly.',
  },
  {
    icon: Wallet,
    title: 'Budget Management',
    description: 'Set monthly budgets for different categories. We\'ll notify you when you\'re getting close to your limits so you stay on track.',
  },
  {
    icon: Zap,
    title: 'Smart Tracking',
    description: 'Add expenses in seconds. Categorize them automatically, attach receipts, and add notes to keep your records spotless.',
  },
  {
    icon: Shield,
    title: 'Bank-Grade Security',
    description: 'Your financial data is encrypted and stored securely. We use industry-standard protocols to ensure your privacy is never compromised.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Friendly',
    description: 'Access your dashboard from any device. Our responsive design ensures a seamless experience on mobile, tablet, or desktop.',
  },
  {
    icon: Download,
    title: 'Easy Export',
    description: 'Need to do taxes? Export your complete transaction history to CSV or PDF formats with a single click.',
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950 transition-colors">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Everything you need to track smarter
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Powerful features designed to help you organize your financial life without the complexity.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={cn(
                  'group p-6 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-emerald-200 dark:hover:border-emerald-900/50 hover:shadow-lg transition-all duration-300',
                  'hover:-translate-y-1 bg-white/50 dark:bg-gray-900/50'
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-900/40 transition-colors">
                  <Icon className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
