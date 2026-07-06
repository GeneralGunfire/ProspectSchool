import { motion } from 'motion/react';
import { useParallax } from './Animations';
import {
  TrendingUp, Award, CalendarDays, Bell, BookOpen, Sparkles, GraduationCap,
} from './icons';

// A believable (not real-data) preview of the student dashboard, built as a
// collage of floating glass cards at different depths — the centerpiece card
// is largest/frontmost, satellites are smaller and drift independently.
// Depth is expressed two ways at once:
//  1. CSS `animate-float` keyframe (each card gets its own duration/delay so
//     the stack never moves in lockstep — real float, not a synced loop)
//  2. Mouse parallax — the whole collage listens for mousemove and each card
//     reads --mx/--my with its own multiplier, so nearer cards (higher
//     multiplier) shift more than farther ones.

function Ring({ pct, size = 88, stroke = 8 }: { pct: number; size?: number; stroke?: number }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(28,25,23,0.08)" strokeWidth={stroke} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="var(--color-accent)" strokeWidth={stroke} strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        whileInView={{ strokeDashoffset: c * (1 - pct / 100) }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      />
    </svg>
  );
}

// Floating card wrapper: outer div = mouse-parallax (inline transform, JS),
// inner div = CSS float keyframe. Nested so the two transforms don't fight.
const Float = ({
  depth, duration, delay, className, children,
}: {
  depth: number; duration: number; delay: number; className?: string; children: React.ReactNode;
}) => (
  <div
    className={`absolute ${className}`}
    style={{ transform: `translate(calc(var(--mx, 0) * ${depth}px), calc(var(--my, 0) * ${depth}px))`, transition: 'transform 0.12s linear', willChange: 'transform' }}
  >
    <div className="animate-float" style={{ animationDuration: `${duration}s`, animationDelay: `${delay}s` }}>
      {children}
    </div>
  </div>
);

export const DashboardPreview = ({ standalone = true }: { standalone?: boolean }) => {
  const { ref, onMouseEnter, onMouseMove, onMouseLeave } = useParallax<HTMLDivElement>();

  return (
    <div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={standalone ? 'relative w-full max-w-135 aspect-4/5 mx-auto' : 'relative w-full h-full'}
    >
      {/* Soft yellow lighting behind the whole stack */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 blur-3xl opacity-50"
        style={{ background: 'radial-gradient(ellipse at 55% 40%, color-mix(in srgb, var(--color-accent) 55%, transparent), transparent 65%)' }}
      />

      {/* ── Centerpiece: Profile + Career Match ring + Study Progress ── */}
      <Float depth={10} duration={7} delay={0} className="left-1/2 top-[8%] -translate-x-1/2 w-72 z-20">
        <div className="glass-panel card-premium rounded-[28px] p-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-brand-dark flex items-center justify-center text-white font-black text-sm shrink-0">TM</div>
            <div className="min-w-0">
              <p className="text-[13px] font-black text-brand-dark truncate">Thandiwe M.</p>
              <p className="text-[10px] font-bold text-stone-400">Grade 11 · Greenside High</p>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-4">
            <div className="relative shrink-0">
              <Ring pct={82} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-lg font-black text-brand-dark leading-none">82%</span>
              </div>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-stone-400">Career Match Score</p>
              <p className="text-[13px] font-black text-brand-dark mt-1">Software Engineer</p>
              <p className="text-[11px] text-stone-400">Top match this term</p>
            </div>
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-[9px] font-black uppercase tracking-[0.14em] text-stone-400">Study Progress</p>
              <p className="text-[10px] font-black text-accent">68%</p>
            </div>
            <div className="h-1.5 rounded-full bg-stone-100 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-accent"
                initial={{ width: 0 }}
                whileInView={{ width: '68%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              />
            </div>
          </div>
        </div>
      </Float>

      {/* ── APS Score badge ── */}
      <Float depth={22} duration={5.5} delay={0.3} className="left-[2%] top-[2%] z-30">
        <div className="glass-panel card-premium rounded-3xl px-4 py-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-dark/5 flex items-center justify-center shrink-0">
            <GraduationCap className="w-4 h-4 text-brand-dark" />
          </div>
          <div>
            <p className="text-[9px] font-black uppercase tracking-wider text-stone-400 leading-none">APS Score</p>
            <p className="text-base font-black text-brand-dark leading-none mt-1">34 <span className="text-[9px] font-bold text-stone-400">/ 42</span></p>
          </div>
        </div>
      </Float>

      {/* ── Notification toast ── */}
      <Float depth={26} duration={6} delay={0.6} className="right-0 top-[4%] z-40">
        <div className="glass-panel card-premium rounded-2xl px-3.5 py-2.5 flex items-center gap-2 w-44">
          <Bell className="w-3.5 h-3.5 text-accent shrink-0" />
          <p className="text-[10px] font-bold text-brand-dark leading-tight">New bursary match found</p>
        </div>
      </Float>

      {/* ── Upcoming Tests ── */}
      <Float depth={16} duration={6.5} delay={0.15} className="right-[-8%] top-[32%] w-44 z-20">
        <div className="glass-panel card-premium rounded-3xl p-4">
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-stone-400 mb-2.5">Upcoming Tests</p>
          {[['Mathematics', 'Mon', '2d'], ['Physical Sciences', 'Thu', '5d']].map(([subj, day, when]) => (
            <div key={subj} className="flex items-center justify-between py-1.5 border-t border-stone-100 first:border-0">
              <div>
                <span className="text-[11px] font-bold text-brand-dark block leading-tight">{subj}</span>
                <span className="text-[9px] text-stone-400">{day}</span>
              </div>
              <span className="text-[10px] font-black text-accent shrink-0">{when}</span>
            </div>
          ))}
        </div>
      </Float>

      {/* ── Small chart ── */}
      <Float depth={14} duration={7.5} delay={0.45} className="right-[2%] top-[46%] w-32 z-10">
        <div className="glass-panel card-premium rounded-3xl p-4">
          <div className="flex items-center justify-between mb-2.5">
            <p className="text-[9px] font-black uppercase tracking-[0.14em] text-stone-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> This Term
            </p>
            <span className="text-[9px] font-black text-emerald-500">+12%</span>
          </div>
          <div className="flex items-end gap-1.5 h-12">
            {[40, 65, 50, 80, 60, 95].map((h, i) => (
              <motion.div
                key={i}
                className={`flex-1 rounded-full ${i === 5 ? 'bg-accent' : 'bg-accent/50'}`}
                initial={{ height: 0 }}
                whileInView={{ height: `${h}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 + i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              />
            ))}
          </div>
        </div>
      </Float>

      {/* ── Recommended Careers ── */}
      <Float depth={12} duration={6.2} delay={0.2} className="left-[-6%] top-[42%] w-40 z-10">
        <div className="glass-panel card-premium rounded-3xl p-4">
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-stone-400 mb-2.5 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Recommended For You
          </p>
          <div className="flex flex-wrap gap-1.5">
            {['Software Engineer', 'Data Analyst', 'UX Designer'].map(c => (
              <span key={c} className="text-[10px] font-bold text-brand-dark bg-brand-dark/5 rounded-full px-2.5 py-1">{c}</span>
            ))}
          </div>
        </div>
      </Float>

      {/* ── Scholarship Matches ── */}
      <Float depth={18} duration={5.8} delay={0.5} className="left-[4%] top-[64%] w-42 z-20">
        <div className="glass-panel card-premium rounded-3xl p-4">
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-stone-400 mb-2.5 flex items-center gap-1">
            <Award className="w-3 h-3" /> Bursary Matches
          </p>
          <p className="text-[13px] font-black text-brand-dark">12 matches found</p>
          <p className="text-[10px] text-stone-400 mt-0.5">Up to R45,000/year · closes in 18 days</p>
        </div>
      </Float>

      {/* ── Calendar ── */}
      <Float depth={20} duration={6.8} delay={0.35} className="right-[-2%] top-[70%] w-36 z-10">
        <div className="glass-panel card-premium rounded-3xl p-4">
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-stone-400 mb-2.5 flex items-center gap-1">
            <CalendarDays className="w-3 h-3" /> This Week
          </p>
          <div className="grid grid-cols-7 gap-1">
            {['M','T','W','T','F','S','S'].map((d, i) => (
              <div key={i} className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black ${i === 3 ? 'bg-accent text-accent-foreground' : 'text-stone-300'}`}>
                {d}
              </div>
            ))}
          </div>
        </div>
      </Float>

      {/* ── Recent Activity ── */}
      <Float depth={9} duration={7.2} delay={0.1} className="left-1/2 -translate-x-1/2 bottom-[0%] w-64 z-10">
        <div className="glass-panel card-premium rounded-3xl p-4">
          <p className="text-[9px] font-black uppercase tracking-[0.14em] text-stone-400 mb-2 flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> Recent Activity
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-brand-dark">Completed "Chemical Bonding" quiz</p>
              <p className="text-[10px] text-stone-400 mt-0.5">2 hours ago</p>
            </div>
            <span className="text-[11px] font-black text-emerald-500 shrink-0">88%</span>
          </div>
        </div>
      </Float>
    </div>
  );
};
