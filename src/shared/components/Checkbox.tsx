import { Check } from 'lucide-react';

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  sublabel?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

// Custom checkbox — replaces the native <input type="checkbox"> so it
// matches the app's visual language and gives a full-row 44px+ touch target
// on mobile instead of a tiny native box.
export default function Checkbox({ checked, onChange, label, sublabel, disabled = false, className = '' }: CheckboxProps) {
  return (
    <label
      className={`flex items-center gap-2.5 cursor-pointer select-none ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <span
        className="w-[18px] h-[18px] rounded-[5px] border shrink-0 flex items-center justify-center transition-colors"
        style={{
          borderColor: checked ? 'var(--color-navy)' : 'var(--color-brand-border)',
          background: checked ? 'var(--color-navy)' : 'white',
        }}
      >
        {checked && <Check className="w-3 h-3 text-white" strokeWidth={3} />}
      </span>
      {(label || sublabel) && (
        <span className="min-w-0">
          {label && <span className="block text-sm font-medium text-brand-dark leading-tight">{label}</span>}
          {sublabel && <span className="block text-xs text-stone-500 leading-tight mt-0.5">{sublabel}</span>}
        </span>
      )}
    </label>
  );
}
