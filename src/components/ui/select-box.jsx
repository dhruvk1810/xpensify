import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export function SelectBox({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  label,
  error,
  className,
  disabled = false,
  dropdownPosition = "auto",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState("bottom");
  const dropdownRef = useRef(null);
  const triggerRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = 280;
      const shouldOpenTop =
        dropdownPosition === "top" ||
        (dropdownPosition === "auto" &&
          spaceBelow < dropdownHeight &&
          spaceAbove > spaceBelow);
      setPosition(shouldOpenTop ? "top" : "bottom");
    }
  }, [isOpen, dropdownPosition]);

  return (
    <div className={cn("relative", className)}>
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "w-full flex items-center justify-between h-12 px-4 rounded-lg border bg-transparent text-sm transition-all outline-none",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          error
            ? "border-destructive focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40"
            : "border-input hover:border-ring/60",
          disabled && "opacity-50 cursor-not-allowed",
          isOpen && !error && "border-ring ring-ring/50 ring-[3px]"
        )}
      >
        <span
          className={cn(
            "truncate",
            selectedOption ? "text-foreground" : "text-muted-foreground"
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-muted-foreground shrink-0 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Dropdown Panel — attached via absolute positioning */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            "absolute left-0 right-0 z-[100] bg-popover border border-border rounded-lg shadow-lg overflow-hidden animate-in fade-in-0 zoom-in-95 duration-150",
            position === "top"
              ? "bottom-[calc(100%+6px)] data-[side=top]:slide-in-from-bottom-2"
              : "top-[calc(100%+6px)] data-[side=bottom]:slide-in-from-top-2"
          )}
        >
          <div className="max-h-64 overflow-y-auto py-1">
            {options.length === 0 ? (
              <div className="px-3 py-2.5 text-sm text-muted-foreground">
                No options available
              </div>
            ) : (
              options.map((option) =>
                option.disabled ? (
                  <div
                    key={option.value || option.label}
                    className="px-3 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider"
                  >
                    {option.label}
                  </div>
                ) : (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 text-sm transition-colors outline-none",
                      value === option.value
                        ? "bg-accent text-accent-foreground font-medium"
                        : "text-foreground hover:bg-accent/50"
                    )}
                  >
                    <span className="flex items-center gap-2 truncate">
                      {option.icon && (
                        <span className="shrink-0">{option.icon}</span>
                      )}
                      {option.label}
                    </span>
                    {value === option.value && (
                      <Check className="w-4 h-4 shrink-0 text-emerald-500" />
                    )}
                  </button>
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}

