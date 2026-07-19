// ── Scratchpad — freehand canvas for working out problems by hand ────────────
// Carried forward from the old implementation (Part C). Persisted per-question
// via localStorage, keyed by a caller-supplied storageKey. Supports pen/eraser/undo.

import { useRef, useState, useEffect, useCallback } from 'react';
import { Eraser, Undo2, Pencil, Trash2 } from 'lucide-react';

const LS_PREFIX = 'prospect_scratchpad_';

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

export function Scratchpad({ storageKey }: { storageKey: string }) {
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

  return (
    <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden my-5">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-100 bg-stone-50/60">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400">Scratchpad</p>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMode('pen')}
            className={`p-1.5 rounded-lg transition-colors ${mode === 'pen' ? 'bg-[#1e293b] text-white' : 'text-stone-400 hover:text-stone-700'}`}
            aria-label="Pen"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setMode('eraser')}
            className={`p-1.5 rounded-lg transition-colors ${mode === 'eraser' ? 'bg-[#1e293b] text-white' : 'text-stone-400 hover:text-stone-700'}`}
            aria-label="Eraser"
          >
            <Eraser className="w-3.5 h-3.5" />
          </button>
          <button onClick={undo} className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 transition-colors" aria-label="Undo">
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={clear} className="p-1.5 rounded-lg text-stone-400 hover:text-red-500 transition-colors" aria-label="Clear">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
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
