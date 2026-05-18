import { Navbar } from '@/components/landing/Navbar';
import { Footer } from '@/components/landing/Footer';

export function StaticLayout({ children }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors duration-300">
      <Navbar />
      <main className="pt-8">
        {children}
      </main>
      <Footer />
    </div>
  );
}
