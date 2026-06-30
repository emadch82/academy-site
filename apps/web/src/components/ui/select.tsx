'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { FiChevronDown } from 'react-icons/fi';

interface SelectProps {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = 'انتخاب کنید',
  label,
  error,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium">{label}</label>
      )}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3 rounded-lg border bg-background text-right focus:outline-none focus:ring-2 focus:ring-primary/50',
            error && 'border-red-500',
            className
          )}
        >
          <span className={value ? '' : 'text-muted-foreground'}>
            {selectedOption?.label || placeholder}
          </span>
          <FiChevronDown
            className={cn('h-5 w-5 text-muted-foreground transition-transform', isOpen && 'rotate-180')}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-background border rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange?.(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-4 py-2 text-right hover:bg-muted transition-colors',
                  value === option.value && 'bg-primary/10 text-primary'
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
