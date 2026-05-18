import { StaticLayout } from '@/components/layout/StaticLayout';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@/lib/router';
import { Rocket, ArrowLeft } from 'lucide-react';

export function ComingSoonPage({ title = "Coming Soon" }) {
  const navigate = useNavigate();

  return (
    <StaticLayout>
      <section className="py-32 px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mx-auto mb-8 animate-bounce">
            <Rocket className="w-10 h-10 text-emerald-500" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            {title}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-10 leading-relaxed">
            We're working hard to bring this feature to life. Stay tuned for updates! 
            In the meantime, explore our existing features to track your finances better.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => navigate('/')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8"
            >
              Back to Home
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate(-1)}
              className="border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 px-8"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </section>
    </StaticLayout>
  );
}
