import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

export function DashboardLayout({ children, className }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
      <Sidebar />
      <main
        className={cn(
          'flex-1 p-4 sm:p-6 lg:p-8 lg:ml-0 transition-all duration-300',
          className
        )}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
