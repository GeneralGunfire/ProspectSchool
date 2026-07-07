import { useRef } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const LENGTH = 10;

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggleVisible: () => void;
}

// A single real <input> drives everything — typing, paste, and browser/
// password-manager autofill all land here via autoComplete="one-time-code".
// The ten boxes underneath are pure display, re-rendered from that input's
// value; clicking any box just focuses the real input, positioning the
// caret to match. A visually segmented *group of separate inputs* (the
// previous approach) is what mobile Safari/Chrome autofill can't reliably
// fill — the OS has no way to know a single saved code should be split
// across many fields, so autofill would only ever land in the first box.
export const PinInput = ({ value, onChange, visible, onToggleVisible }: PinInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const digits = value.padEnd(LENGTH, ' ').split('').slice(0, LENGTH);

  const handleChange = (raw: string) => {
    onChange(raw.replace(/\D/g, '').slice(0, LENGTH));
  };

  const focusAt = (index: number) => {
    const el = inputRef.current;
    if (!el) return;
    el.focus();
    // Defer the selection range set until after focus has landed — some
    // mobile browsers reset the caret to the end on focus, so setting the
    // range synchronously would get overwritten.
    requestAnimationFrame(() => {
      const pos = Math.min(index, value.length);
      el.setSelectionRange(pos, pos);
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
        <label htmlFor="pin-input" className="block text-[10px] sm:text-[11px] font-black uppercase tracking-[0.18em] text-brand-eyebrow">PIN</label>
        <button
          type="button"
          onClick={onToggleVisible}
          className="flex items-center gap-1 text-[10px] font-bold text-brand-eyebrow/60 hover:text-brand-dark transition-colors cursor-pointer"
        >
          {visible ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          {visible ? 'Hide' : 'Show'}
        </button>
      </div>

      <div className="relative">
        {/* Real input — receives all typing, paste, and autofill. Kept
            visually on top (not display:none) so iOS/Android autofill
            heuristics, which can skip hidden/off-screen inputs, still
            recognize it as a fillable field; it's just made transparent
            with the caret hidden so only the boxes below show visibly. */}
        <input
          id="pin-input"
          ref={inputRef}
          type="text"
          inputMode="numeric"
          maxLength={LENGTH}
          value={value}
          onChange={e => handleChange(e.target.value)}
          autoComplete="one-time-code"
          name="pin"
          className="absolute inset-0 w-full h-full opacity-0 caret-transparent text-transparent selection:bg-transparent"
        />

        {/* Display boxes — purely visual, mirror the real input's value */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-1 sm:gap-1.5 pointer-events-none">
          {digits.map((digit, i) => (
            <div
              key={i}
              onClick={() => focusAt(i)}
              className="aspect-square flex items-center justify-center bg-white/70 border border-brand-border rounded-md sm:rounded-lg text-[13px] sm:text-[15px] font-black text-brand-dark pointer-events-auto cursor-text"
            >
              {digit.trim() ? (visible ? digit : '•') : ''}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
