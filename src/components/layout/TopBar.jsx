import { Plus, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@/lib/router';
import { useTheme } from '@/context/ThemeContext';
import { MonthSelector } from '@/components/shared/MonthSelector';

export function TopBar({
  title,
  subtitle,
  showDateSelector = false,
  showAddButton = false,
}) {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{title}</h1>
        {subtitle && <p className="text-gray-500 dark:text-gray-400 text-base mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={toggleDarkMode}
          className="flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {showDateSelector && <MonthSelector />}

        {showAddButton && (
          <Button
            onClick={() => navigate('/add-expense')}
            className="bg-emerald-500 hover:bg-emerald-600 text-white"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Add Expense
          </Button>
        )}
      </div>
    </header>
  );
}

