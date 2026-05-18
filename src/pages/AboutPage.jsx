import { StaticLayout } from '@/components/layout/StaticLayout';
import { Target, Users, Heart, ShieldCheck } from 'lucide-react';

export function AboutPage() {
  return (
    <StaticLayout>
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-20">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              Our Mission is to Simplify <br /> <span className="text-emerald-500">Financial Freedom</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
              Expensify was built with a single goal: to help people take control of their finances without the stress. 
              We believe that financial clarity should be accessible to everyone, everywhere.
            </p>
          </div>

          {/* Core Values */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
            {[
              { icon: Target, title: 'Precision', text: 'Accurate tracking for every rupee, ensuring nothing slips through the cracks.' },
              { icon: Users, title: 'User-First', text: 'Designed around your daily habits to make tracking feel like second nature.' },
              { icon: Heart, title: 'Passion', text: 'We are passionate about financial education and empowering our users.' },
              { icon: ShieldCheck, title: 'Trust', text: 'Your data security is our top priority. We use bank-grade encryption.' },
            ].map((value, i) => (
              <div key={i} className="text-center p-8 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm transition-all hover:shadow-md">
                <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="w-6 h-6 text-emerald-500" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">{value.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{value.text}</p>
              </div>
            ))}
          </div>

          {/* Story Section */}
          <div className="bg-emerald-500 rounded-3xl p-8 sm:p-12 lg:p-16 text-white overflow-hidden relative">
            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">The Expensify Story</h2>
              <p className="text-emerald-50 text-lg mb-6 leading-relaxed">
                Started in 2025, Expensify began as a simple internal tool for a small group of friends 
                trying to manage their shared expenses. What began as a spreadsheet quickly evolved 
                into the comprehensive platform you see today.
              </p>
              <p className="text-emerald-50 text-lg leading-relaxed">
                Today, we serve thousands of users across the country, helping them save more, 
                invest smarter, and live better lives through financial awareness.
              </p>
            </div>
            {/* Abstract Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-48 h-48 bg-emerald-400/20 rounded-full translate-y-1/2 blur-2xl" />
          </div>
        </div>
      </section>
    </StaticLayout>
  );
}
