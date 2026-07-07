import { useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const LENGTH = 10;

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
}

// Ten individual digit boxes standing in for a single 10-digit PIN string —
// every school-issued PIN in this app is exactly 10 digits (enforced in
// src/lib/auth.ts's `/^\d{10}$/` check), so a fixed-length segmented input
// is a real fit here, not just decoration.
export const PinInput = ({ value, onChange, visible, onToggleVisible }: PinInputProps) => {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(LENGTH, ' ').split('').slice(0, LENGTH);

  const setDigit = (index: number, char: string) => {
    const next = digits.slice();
    next[index] = char;
    onChange(next.join('').replace(/\s/g, ''));
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    if (!digit) { setDigit(index, ''); return; }
    setDigit(index, digit);
    if (index < LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !digits[index].trim() && index > 0) {
      refs.current[index - 1]?.focus();
    }
    if (e.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus();
    if (e.key === 'ArrowRight' && index < LENGTH - 1) refs.current[index + 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    if (pasted) onChange(pasted);
  };

  // Password managers and browser autofill only ever write into the first
  // input of a segmented group like this — autoComplete="one-time-code" on
  // that box is what tells them a full multi-digit code belongs there, and
  // handleChange below already splits any autofilled value across the rest
  // of the boxes exactly like a manual paste does.
  const handleAutofill = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, '').slice(0, LENGTH);
    if (digits.length > 1) { onChange(digits); return; }
    handleChange(0, e.target.value);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="block text-[11px] font-black uppercase tracking-[0.18em] text-brand-eyebrow">PIN</label>
        <button
          type="button"
          onClick={onToggleVisible}
          className="flex items-center gap-1 text-[10px] font-bold text-brand-eyebrow/60 hover:text-brand-dark transition-colors cursor-pointer"
        >
          {visible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5" onPaste={handlePaste}>
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={el => { refs.current[i] = el; }}
            type={visible ? 'text' : 'password'}
            inputMode="numeric"
            maxLength={i === 0 ? LENGTH : 1}
            value={digit.trim()}
            onChange={e => (i === 0 ? handleAutofill(e) : handleChange(i, e.target.value))}
            onKeyDown={e => handleKeyDown(i, e)}
            autoComplete={i === 0 ? 'one-time-code' : 'off'}
            name={i === 0 ? 'pin' : undefined}
            className="w-full aspect-square text-center bg-white/70 border border-brand-border rounded-lg text-[15px] font-black text-brand-dark focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/15 focus:bg-white transition-all"
          />
        ))}
      </div>
    </div>
  );
};
