import { ChevronDown, Calendar, Check } from 'lucide-react';
import { useMonth } from '@/context/MonthContext';
import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export function MonthSelector() {
  const { selectedMonth, setSelectedMonth, availableMonths, getMonthLabel } = useMonth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-2 h-10 px-3 rounded-lg border text-sm transition-all outline-none',
          'bg-background text-foreground border-input hover:bg-accent hover:text-accent-foreground',
          'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
          isOpen && 'border-ring ring-ring/50 ring-[3px]'
        )}
      >
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <span>{getMonthLabel(selectedMonth)}</span>
        <ChevronDown className={cn(
          'w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200',
          isOpen && 'rotate-180'
        )} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-56 bg-popover border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 duration-150">
          {availableMonths.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">No months available</div>
          ) : (
            availableMonths.map((month) => (
              <button
                key={month}
                onClick={() => {
                  setSelectedMonth(month);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full flex items-center justify-between text-left px-3 py-2.5 text-sm transition-colors outline-none',
                  selectedMonth === month
                    ? 'bg-accent text-accent-foreground font-medium'
                    : 'text-foreground hover:bg-accent/50'
                )}
              >
                <span>{getMonthLabel(month)}</span>
                {selectedMonth === month && (
                  <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}

