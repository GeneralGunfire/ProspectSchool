import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, ChevronDown } from 'lucide-react';

export interface DropdownOption<T extends string | number> {
  value: T;
  label: string;
  disabled?: boolean;
  group?: string;
}

interface DropdownProps<T extends string | number> {
  options: DropdownOption<T>[];
  value: T | null;
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  disabled?: boolean;
  align?: 'left' | 'right';
}

// macOS-style translucent popover select — replaces native <select> so the
// dropdown matches the app's own visual language instead of the OS picker.
export default function Dropdown<T extends string | number>({
  options,
  value,
  onChange,
  placeholder = 'Select…',
  className = '',
  buttonClassName = '',
  disabled = false,
  align = 'left',
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState<number>(-1);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = options.find(o => o.value === value) ?? null;

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    if (open) document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [open]);

  useEffect(() => {
    if (open) {
      const idx = options.findIndex(o => o.value === value);
      setHighlighted(idx >= 0 ? idx : 0);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  function commit(idx: number) {
    const opt = options[idx];
    if (!opt || opt.disabled) return;
    onChange(opt.value);
    setOpen(false);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
    if (e.key === 'Enter') { e.preventDefault(); commit(highlighted); return; }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted(h => Math.min(options.length - 1, h + 1));
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted(h => Math.max(0, h - 1));
    }
  }

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(o => !o)}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={
          buttonClassName ||
          'w-full flex items-center justify-between gap-2 px-3 py-2.5 bg-white border border-brand-border rounded-lg text-sm font-medium text-stone-800 text-left disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-dark/20 focus:border-stone-400 transition-all'
        }
      >
        <span className={`truncate ${!selected ? 'text-stone-400' : ''}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={listRef}
            role="listbox"
            initial={{ opacity: 0, scale: 0.96, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -6 }}
            transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
            className={`glass-panel absolute z-50 mt-1.5 min-w-full max-h-64 overflow-y-auto rounded-xl shadow-xl p-1.5 ${
              align === 'right' ? 'right-0' : 'left-0'
            }`}
            style={{ transformOrigin: 'top' }}
          >
            {options.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isHighlighted = idx === highlighted;
              const showGroupHeader = opt.group && opt.group !== options[idx - 1]?.group;
              return (
                <div key={opt.value}>
                  {showGroupHeader && (
                    <p className={`px-3 pt-2.5 pb-1 text-[10px] font-black uppercase tracking-widest text-stone-400 ${idx === 0 ? '' : 'mt-0.5 border-t border-stone-900/[0.06]'}`}>
                      {opt.group}
                    </p>
                  )}
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    disabled={opt.disabled}
                    onMouseEnter={() => setHighlighted(idx)}
                    onClick={() => commit(idx)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium text-left transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                      isHighlighted ? 'bg-stone-900/[0.06]' : ''
                    } ${isSelected ? 'text-brand-dark font-bold' : 'text-stone-700'}`}
                  >
                    <span className="truncate">{opt.label}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-brand-dark shrink-0" />}
                  </button>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
