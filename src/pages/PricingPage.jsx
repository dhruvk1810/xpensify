import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StaticLayout } from '@/components/layout/StaticLayout';
import { useNavigate } from '@/lib/router';

const plans = [
  {
    name: 'Free',
    price: '₹0',
    description: 'Perfect for getting started with personal tracking.',
    features: [
      'Unlimited expense tracking',
      'Basic analytics',
      'Standard categories',
      '1 account support',
      'Mobile app access',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '₹299',
    period: '/mo',
    description: 'Best for power users and growing families.',
    features: [
      'Advanced insights & reports',
      'Custom categories & tags',
      'Receipt scanning (OCR)',
      'Up to 5 accounts',
      'Priority support',
      'Budget alerts & notifications',
    ],
    cta: 'Go Pro',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For organizations needing deep financial control.',
    features: [
      'Multi-user collaboration',
      'Advanced security features',
      'API access & integrations',
      'Dedicated account manager',
      'Custom export formats',
      'White-labeled reports',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export function PricingPage() {
  const navigate = useNavigate();

  return (
    <StaticLayout>
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your financial journey. No hidden fees, ever.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative p-8 rounded-2xl border transition-all duration-300 ${
                  plan.popular
                    ? 'border-emerald-500 shadow-xl shadow-emerald-500/10 bg-white dark:bg-gray-900 scale-105 z-10'
                    : 'border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 hover:border-emerald-200 dark:hover:border-emerald-900/50'
                }`}
              >
                {plan.popular && (
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">{plan.price}</span>
                    {plan.period && <span className="text-gray-500 dark:text-gray-400">{plan.period}</span>}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-4 leading-relaxed">
                    {plan.description}
                  </p>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  onClick={() => navigate('/signup')}
                  className={`w-full h-12 text-base font-semibold ${
                    plan.popular
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                      : 'variant-outline border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                  variant={plan.popular ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>

          {/* FAQ Preview */}
          <div className="mt-24 max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6 text-left">
              {[
                { q: 'Can I change plans later?', a: 'Yes, you can upgrade or downgrade your plan at any time from your settings.' },
                { q: 'Is there a free trial?', a: 'Our Free plan is free forever! You can use it as long as you like without any cost.' },
              ].map((faq, i) => (
                <div key={i} className="p-6 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-gray-100 dark:border-gray-800">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{faq.q}</h4>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </StaticLayout>
  );
}
