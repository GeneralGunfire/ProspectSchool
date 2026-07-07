import { LucideIcon, Check } from 'lucide-react';

interface CodeFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: LucideIcon;
  placeholder: string;
  // Minimum length before the field is considered "valid" for the live
  // checkmark — codes vary in length per role so this isn't hardcoded.
  minLength?: number;
  // Lets password managers key saved credentials to the right field —
  // "username" for the school/role code that identifies the account.
  autoComplete?: string;
}

export const CodeField = ({ label, value, onChange, icon: Icon, placeholder, minLength = 3, autoComplete = 'username' }: CodeFieldProps) => {
  const isValid = value.trim().length >= minLength;

  return (
    <div>
      <label className="block text-[10px] sm:text-[11px] font-black uppercase tracking-[0.18em] text-brand-eyebrow mb-1.5 sm:mb-2">{label}</label>
      <div className="relative">
        <Icon className="w-4 h-4 text-brand-eyebrow/50 absolute left-3 sm:left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text" required
          value={value}
          onChange={e => onChange(e.target.value.toUpperCase())}
          className="w-full pl-10 sm:pl-11 pr-9 sm:pr-10 py-2.5 sm:py-3 bg-white/70 border border-brand-border rounded-xl text-[13.5px] sm:text-sm font-bold text-brand-dark placeholder:text-brand-eyebrow/40 focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 focus:bg-white transition-all tracking-widest"
          placeholder={placeholder}
          autoCapitalize="characters" autoCorrect="off"
          autoComplete={autoComplete}
          name={autoComplete}
        />
        {isValid && (
          <Check className="w-4 h-4 text-emerald-500 absolute right-3 sm:right-3.5 top-1/2 -translate-y-1/2" />
        )}
      </div>
    </div>
  );
};
