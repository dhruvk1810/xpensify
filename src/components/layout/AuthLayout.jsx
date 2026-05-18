import { cn } from '@/lib/utils';

export function AuthLayout({ children, className }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div
        className={cn(
          'w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-100 p-8',
          'animate-fade-in',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
