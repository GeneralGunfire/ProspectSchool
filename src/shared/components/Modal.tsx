import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  titleExtra?: React.ReactNode; // extra header action(s) rendered before the close button, e.g. an edit-pencil
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string; // e.g. 'max-w-md', 'max-w-lg' — defaults to max-w-md
}

const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

// Shared modal shell used for every Add/Edit/Delete-confirm popup across the
// portals. On mobile it behaves like a native bottom sheet (slides up,
// pinned to the bottom, rounded top corners only, capped height with
// internal scroll) instead of a cramped centered box that's easy to
// mis-tap on a phone. On desktop it's the familiar centered card.
export default function Modal({ open, onClose, title, titleExtra, children, footer, maxWidth = 'max-w-md' }: ModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
              transition={{ duration: 0.25, ease }}
              className={`pointer-events-auto bg-white w-full ${maxWidth} sm:rounded-2xl rounded-t-2xl shadow-2xl flex flex-col max-h-[88vh] sm:max-h-[85vh]`}
              onClick={(e) => e.stopPropagation()}
              style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
              {/* Mobile drag handle */}
              <div className="sm:hidden flex justify-center pt-2.5 pb-1 shrink-0">
                <span className="w-9 h-1 rounded-full bg-stone-200" />
              </div>

              {title && (
                <div className="flex items-center justify-between px-6 pt-3 sm:pt-6 pb-4 border-b border-brand-border/60 shrink-0">
                  <h2 className="text-lg font-black text-brand-dark">{title}</h2>
                  <div className="flex items-center gap-1">
                    {titleExtra}
                    <button onClick={onClose} aria-label="Close" className="p-2 -mr-2 rounded hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="px-6 py-4 overflow-y-auto">
                {children}
              </div>

              {footer && (
                <div className="flex items-center gap-6 px-6 py-4 border-t border-brand-border/60 shrink-0">
                  {footer}
                </div>
              )}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
