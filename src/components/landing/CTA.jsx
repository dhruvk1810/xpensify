import { Button } from '@/components/ui/button';
import { useNavigate } from '@/lib/router';

export function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50 transition-colors">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Ready to take control?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          Join thousands of users who are saving more and stressing less about their finances.
        </p>
        <Button
          size="lg"
          onClick={() => navigate('/signup')}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 h-12 text-base shadow-lg shadow-emerald-500/20"
        >
          Create Free Account
        </Button>
        <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
          No credit card required &bull; Free forever plan available
        </p>
      </div>
    </section>
  );
}
