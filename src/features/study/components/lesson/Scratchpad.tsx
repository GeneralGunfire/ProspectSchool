// ── Scratchpad — freehand canvas for working out problems by hand ────────────
// Carried forward from the old implementation (Part C). Persisted per-question
// via localStorage, keyed by a caller-supplied storageKey. Supports pen/eraser/undo.
//
// Two presentations share the same drawing engine (useScratchpadCanvas):
// - Scratchpad: inline card, used in the Apply phase for general working-out.
// - ScratchpadModal: full-screen popup showing the question text alongside a
//   larger canvas, triggered from an MCQ question so a learner can work the
//   problem out before committing to an answer (mobile-friendly — the modal
//   gives far more drawing room than a cramped inline canvas would on a phone).

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Eraser, Undo2, Pencil, Trash2, X } from 'lucide-react';

const LS_PREFIX = 'prospect_scratchpad_';
const EASE = [0.23, 1, 0.32, 1] as const;

type Point = { x: number; y: number };
type Stroke = { points: Point[]; erase: boolean };

function loadStrokes(key: string): Stroke[] {
  try {
    const raw = localStorage.getItem(LS_PREFIX + key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveStrokes(key: string, strokes: Stroke[]) {
  try { localStorage.setItem(LS_PREFIX + key, JSON.stringify(strokes)); } catch { /* ignore quota errors */ }
}

function useScratchpadCanvas(storageKey: string) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>(() => loadStrokes(storageKey));
  const [mode, setMode] = useState<'pen' | 'eraser'>('pen');
  const drawing = useRef(false);
  const current = useRef<Point[]>([]);

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const stroke of strokes) {
      if (stroke.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = stroke.erase ? '#ffffff' : '#1e293b';
      ctx.lineWidth = stroke.erase ? 18 : 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (const p of stroke.points.slice(1)) ctx.lineTo(p.x, p.y);
      ctx.stroke();
    }
  }, [strokes]);

  useEffect(() => { redraw(); }, [redraw]);
  useEffect(() => { saveStrokes(storageKey, strokes); }, [storageKey, strokes]);

  const getPos = (e: React.PointerEvent<HTMLCanvasElement>): Point => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true;
    current.current = [getPos(e)];
  };
  const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return;
    current.current.push(getPos(e));
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx || current.current.length < 2) return;
    const pts = current.current;
    ctx.beginPath();
    ctx.strokeStyle = mode === 'eraser' ? '#ffffff' : '#1e293b';
    ctx.lineWidth = mode === 'eraser' ? 18 : 2.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(pts[pts.length - 2].x, pts[pts.length - 2].y);
    ctx.lineTo(pts[pts.length - 1].x, pts[pts.length - 1].y);
    ctx.stroke();
  };
  const onPointerUp = () => {
    if (!drawing.current) return;
    drawing.current = false;
    if (current.current.length > 1) {
      setStrokes(s => [...s, { points: current.current, erase: mode === 'eraser' }]);
    }
    current.current = [];
  };

  const undo = () => setStrokes(s => s.slice(0, -1));
  const clear = () => setStrokes([]);

  return { canvasRef, mode, setMode, undo, clear, onPointerDown, onPointerMove, onPointerUp };
}

function ScratchpadToolbar({
  mode, setMode, undo, clear,
}: {
  mode: 'pen' | 'eraser'; setMode: (m: 'pen' | 'eraser') => void; undo: () => void; clear: () => void;
}) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => setMode('pen')}
        className={`p-2 rounded-lg transition-colors ${mode === 'pen' ? 'bg-[#1e293b] text-white' : 'text-stone-400 hover:text-stone-700'}`}
        aria-label="Pen"
      >
        <Pencil className="w-4 h-4" />
      </button>
      <button
        onClick={() => setMode('eraser')}
        className={`p-2 rounded-lg transition-colors ${mode === 'eraser' ? 'bg-[#1e293b] text-white' : 'text-stone-400 hover:text-stone-700'}`}
        aria-label="Eraser"
      >
        <Eraser className="w-4 h-4" />
      </button>
      <button onClick={undo} className="p-2 rounded-lg text-stone-400 hover:text-stone-700 transition-colors" aria-label="Undo">
        <Undo2 className="w-4 h-4" />
      </button>
      <button onClick={clear} className="p-2 rounded-lg text-stone-400 hover:text-red-500 transition-colors" aria-label="Clear">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

// ── Inline card (Apply phase general working-out) ─────────────────────────────

export function Scratchpad({ storageKey }: { storageKey: string }) {
  const { canvasRef, mode, setMode, undo, clear, onPointerDown, onPointerMove, onPointerUp } = useScratchpadCanvas(storageKey);

  return (
    <div className="paper-card rounded overflow-hidden my-5">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100 bg-stone-50/60">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Scratchpad</p>
        <ScratchpadToolbar mode={mode} setMode={setMode} undo={undo} clear={clear} />
      </div>
      <canvas
        ref={canvasRef}
        width={640}
        height={220}
        className="w-full touch-none cursor-crosshair"
        style={{ maxWidth: '100%' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      />
    </div>
  );
}

// ── Full-screen popup — question text + larger canvas, opened from an MCQ ─────

export function ScratchpadModal({
  storageKey,
  question,
  open,
  onClose,
}: {
  storageKey: string;
  question: string;
  open: boolean;
  onClose: () => void;
}) {
  const { canvasRef, mode, setMode, undo, clear, onPointerDown, onPointerMove, onPointerUp } = useScratchpadCanvas(storageKey);

  // Canvas internal resolution matches its rendered box (set on open) so
  // strokes stay crisp instead of stretching a small canvas to fill the modal.
  useEffect(() => {
    if (!open) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const parent = canvas.parentElement;
    if (!parent) return;
    canvas.width = parent.clientWidth;
    canvas.height = parent.clientHeight;
  }, [open, canvasRef]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.25, ease: EASE }}
            className="fixed inset-x-3 bottom-3 top-3 sm:inset-x-0 sm:top-auto sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-lg z-[61] flex flex-col rounded-2xl bg-white border border-stone-200 shadow-2xl overflow-hidden"
          >
            <div className="flex items-start justify-between gap-3 px-4 sm:px-5 py-3.5 border-b border-stone-100 shrink-0">
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-1">Work it out</p>
                <p className="text-[13.5px] font-bold text-[#1e293b] leading-snug">{question}</p>
              </div>
              <button
                onClick={onClose}
                className="shrink-0 p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                aria-label="Close scratchpad"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 p-3">
              <canvas
                ref={canvasRef}
                className="w-full h-full rounded-xl border border-stone-200 touch-none cursor-crosshair bg-stone-50/30"
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerLeave={onPointerUp}
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5 px-4 sm:px-5 py-3 border-t border-stone-100 shrink-0"
              style={{ paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom))' }}>
              <div className="flex justify-center sm:justify-start">
                <ScratchpadToolbar mode={mode} setMode={setMode} undo={undo} clear={clear} />
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-[13px] font-black text-white bg-[#1e293b] active:scale-[0.97] transition-all"
              >
                Done — back to answers
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
