import { useState } from 'react';
import { Menu, X, PieChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useNavigate } from '@/lib/router';
import { cn } from '@/lib/utils';

const navLinks = [
  { label: 'Features', href: '/features' },
  { label: 'How it Works', href: '/how-it-works' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'About', href: '/about' },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">Expensify</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/login')}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
            >
              Log In
            </Button>
            <Button
              onClick={() => navigate('/signup')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white"
            >
              Sign Up Free
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 dark:text-gray-400"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300',
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="py-4 space-y-4 border-t border-gray-100 dark:border-gray-800">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="block text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/login');
                }}
              >
                Log In
              </Button>
              <Button
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white"
                onClick={() => {
                  setIsOpen(false);
                  navigate('/signup');
                }}
              >
                Sign Up Free
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
