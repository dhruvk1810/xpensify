import { cn } from '@/lib/utils';

export function SkeletonCard({ className }) {
  return (
    <div
      className={cn(
        'bg-white rounded-xl p-6 border border-gray-100',
        className
      )}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-shimmer" />
          <div className="h-8 w-32 bg-gray-200 rounded animate-shimmer" />
        </div>
        <div className="h-10 w-10 bg-gray-200 rounded-lg animate-shimmer" />
      </div>
      <div className="h-4 w-28 bg-gray-200 rounded animate-shimmer" />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded animate-shimmer" />
          <div className="h-8 w-32 bg-gray-200 rounded animate-shimmer" />
        </div>
        <div className="h-10 w-10 bg-gray-200 rounded-lg animate-shimmer" />
      </div>
      <div className="h-4 w-28 bg-gray-200 rounded animate-shimmer" />
    </div>
  );
}

export function SkeletonChart() {
  return (
    <div className="bg-white rounded-xl p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-2">
          <div className="h-5 w-32 bg-gray-200 rounded animate-shimmer" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-shimmer" />
        </div>
        <div className="h-8 w-28 bg-gray-200 rounded-lg animate-shimmer" />
      </div>
      <div className="h-64 bg-gray-100 rounded-lg animate-shimmer" />
    </div>
  );
}

export function SkeletonTransaction() {
  return (
    <div className="flex items-center gap-4 p-4">
      <div className="h-10 w-10 bg-gray-200 rounded-full animate-shimmer" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 bg-gray-200 rounded animate-shimmer" />
        <div className="h-3 w-24 bg-gray-200 rounded animate-shimmer" />
      </div>
      <div className="h-5 w-20 bg-gray-200 rounded animate-shimmer" />
    </div>
  );
}

export function SkeletonAvatar({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  return (
    <div
      className={cn(
        'bg-gray-200 rounded-full animate-shimmer',
        sizeClasses[size]
      )}
    />
  );
}

export function SkeletonText({ lines = 1, width = 'full' }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-4 bg-gray-200 rounded animate-shimmer',
            width === 'full' ? 'w-full' : `w-${width}`
          )}
        />
      ))}
    </div>
  );
}
