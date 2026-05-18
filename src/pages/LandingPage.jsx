import { useEffect } from 'react';
import { useNavigate } from '@/lib/router';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/landing/Navbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { Insights } from '@/components/landing/Insights';
import { SmartEntry } from '@/components/landing/SmartEntry';
import { CTA } from '@/components/landing/CTA';
import { Footer } from '@/components/landing/Footer';

export function LandingPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Insights />
        <SmartEntry />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
