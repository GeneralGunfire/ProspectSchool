import { motion } from 'motion/react';

interface Props {
  eyebrow: string;
  headline: string;
  sub: string;
}

// Inline SVG dashboard mockup inside a laptop frame — no external image needed.
// Matches the reference: laptop tilted slightly, dashboard UI visible inside screen.
const LaptopMockup = () => (
  <div className="relative w-full max-w-[580px] mx-auto select-none">
    {/* Glow behind laptop */}
    <div
      aria-hidden
      className="absolute inset-x-[5%] top-[10%] h-[70%] blur-3xl opacity-40 rounded-full"
      style={{ background: 'radial-gradient(ellipse, #93C5FD 0%, transparent 70%)' }}
    />

    {/* Laptop outer shell */}
    <div className="relative">
      {/* Screen bezel */}
      <div
        className="relative mx-auto rounded-[18px] overflow-hidden shadow-2xl shadow-black/40 border border-white/20"
        style={{
          background: '#0F172A',
          padding: '10px 10px 0 10px',
        }}
      >
        {/* Camera dot */}
        <div className="flex justify-center mb-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
        </div>

        {/* Screen contents — dashboard UI */}
        <div className="rounded-t-[10px] overflow-hidden bg-[#F8FAFC]" style={{ aspectRatio: '16/10' }}>
          <DashboardScreen />
        </div>
      </div>

      {/* Keyboard base */}
      <div
        className="relative mx-auto h-[22px] rounded-b-[14px]"
        style={{
          background: 'linear-gradient(to bottom, #1E293B, #0F172A)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.5)',
          width: '100%',
        }}
      />
      {/* Trackpad */}
      <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-16 h-3 rounded-md bg-white/5 border border-white/10" />

      {/* Base shadow */}
      <div className="h-2 mx-8 rounded-b-full"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.35), transparent)' }}
      />
    </div>
  </div>
);

// Inline dashboard mockup — a simplified but believable version of the actual student dashboard
const DashboardScreen = () => (
  <div className="flex h-full text-[6px] font-sans" style={{ fontFamily: 'system-ui, sans-serif' }}>

    {/* Sidebar */}
    <div className="w-[19%] bg-white border-r border-slate-100 flex flex-col py-3 px-2 shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-1 px-1 mb-4">
        <div className="w-3.5 h-3.5 rounded bg-[#2563EB] flex items-center justify-center">
          <span className="text-white font-black text-[5px]">P</span>
        </div>
        <span className="font-black text-[#0F172A] text-[7px] tracking-tight">Prospect</span>
      </div>

      {/* Nav items */}
      {[
        { label: 'Dashboard', active: true },
        { label: 'Students', active: false },
        { label: 'Assessments', active: false },
        { label: 'Assignments', active: false },
        { label: 'Calendar', active: false },
        { label: 'Reports', active: false },
        { label: 'Resources', active: false },
      ].map(item => (
        <div
          key={item.label}
          className={`px-2 py-1 rounded-md mb-0.5 text-[6.5px] font-semibold ${
            item.active
              ? 'bg-[#EFF6FF] text-[#2563EB]'
              : 'text-slate-400'
          }`}
        >
          {item.label}
        </div>
      ))}
    </div>

    {/* Main content */}
    <div className="flex-1 flex flex-col bg-[#F8FAFC] overflow-hidden px-3 py-3">

      {/* Header */}
      <div className="flex items-start justify-between mb-2.5">
        <div>
          <div className="text-[5.5px] font-semibold text-slate-400 mb-0.5 uppercase tracking-wider">DASHBOARD</div>
          <div className="text-[10px] font-black text-[#0F172A] leading-tight">
            Good afternoon, <span className="text-[#2563EB] italic">Rajen</span>.
          </div>
          <div className="text-[5.5px] text-slate-400 mt-0.5">Greenside High School · Grade 10 · 10B</div>
        </div>
        <div className="w-6 h-6 rounded-full bg-[#0F172A] flex flex-col items-center justify-center">
          <span className="text-white font-black text-[5px] leading-none">APS</span>
          <span className="text-[#2563EB] font-black text-[6px] leading-none">20</span>
        </div>
      </div>

      {/* Focus banner */}
      <div className="rounded-lg bg-[#1E3A6E] px-2.5 py-2 mb-2 flex items-center justify-between">
        <div>
          <div className="text-[5px] font-black uppercase tracking-wider text-blue-300/80 mb-0.5">TODAY'S FOCUS</div>
          <div className="text-[7.5px] font-black text-white leading-tight">
            You're all caught up. <span className="text-[#60A5FA] italic">glen.</span>
          </div>
          <div className="text-[5px] text-blue-200/60 mt-0.5">No urgent tasks. Use this time to study ahead.</div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="bg-white/15 rounded-full px-2 py-0.5 text-[5px] font-black text-white">
            ▶ Start Studying
          </div>
          <div className="text-[5px] text-blue-200/60 text-right">HOMEWORK<br/>1/1 done</div>
        </div>
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-4 gap-1.5 mb-2">
        {[
          { label: 'UPCOMING EVENT',   value: '—',   sub: 'No upcoming events',    color: '' },
          { label: 'PENDING HOMEWORK', value: '0',   sub: 'All caught up',          color: '#2563EB' },
          { label: 'AVERAGE MARK',     value: '84%', sub: 'STRONG · 1 ASSESSMENT', color: '#10B981' },
          { label: 'ANNOUNCEMENTS',    value: '1',   sub: 'QA Test Announcement',  color: '' },
        ].map(card => (
          <div key={card.label} className="bg-white rounded-lg p-1.5 border border-slate-100">
            <div className="text-[4.5px] font-black uppercase tracking-wider text-slate-400 mb-1">{card.label}</div>
            <div className="font-black text-[9px] leading-none" style={{ color: card.color || '#0F172A' }}>{card.value}</div>
            <div className="text-[4.5px] text-slate-400 mt-0.5 leading-tight">{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-1.5 flex-1 min-h-0">
        {/* Academic Health */}
        <div className="bg-white rounded-lg p-2 border border-slate-100 overflow-hidden">
          <div className="text-[5px] font-black uppercase tracking-wider text-slate-400 mb-1.5">⚡ ACADEMIC HEALTH</div>
          {[
            { label: 'Homework Completion', pct: 100, color: '#10B981' },
            { label: 'Average Mark',        pct: 84,  color: '#2563EB' },
            { label: 'Library Progress',    pct: 50,  color: '#8B5CF6' },
            { label: 'Upcoming Assessments',pct: 0,   color: '#94A3B8' },
          ].map(row => (
            <div key={row.label} className="mb-1.5">
              <div className="flex justify-between items-center mb-0.5">
                <span className="text-[5px] text-slate-500 font-semibold">{row.label}</span>
                <span className="text-[5px] font-black" style={{ color: row.color }}>{row.pct}%</span>
              </div>
              <div className="h-0.5 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${row.pct}%`, background: row.color }} />
              </div>
            </div>
          ))}
        </div>

        {/* Calendar overview */}
        <div className="bg-white rounded-lg p-2 border border-slate-100">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-[5px] font-black uppercase tracking-wider text-slate-400">CALENDAR OVERVIEW</span>
            <span className="text-[4.5px] text-[#2563EB] font-semibold">Full Calendar ›</span>
          </div>
          <div className="grid grid-cols-7 gap-0.5 mb-1">
            {['SU','MO','TU','WE','TH','FR','SA'].map(d => (
              <div key={d} className="text-center text-[4px] font-black text-slate-300">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-0.5">
            {[5,6,7,8,9,10,11].map(n => (
              <div
                key={n}
                className="aspect-square flex items-center justify-center rounded-full text-[5px] font-black"
                style={n === 6 ? { background: '#2563EB', color: 'white' } : { color: '#64748B' }}
              >
                {n}
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-1 text-[4.5px] text-slate-400">
            <div className="w-2 h-2 rounded border border-slate-200 flex items-center justify-center">📅</div>
            No upcoming events
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const PortalSidePanel = ({ eyebrow, headline, sub }: Props) => (
  <div
    className="relative hidden lg:flex flex-col justify-between w-[52%] max-w-2xl shrink-0 overflow-hidden py-10 px-10"
    style={{ background: 'linear-gradient(145deg, #1D4ED8 0%, #2563EB 45%, #1E40AF 100%)' }}
  >
    {/* Glow blobs */}
    <div aria-hidden className="absolute -top-40 -right-20 w-[400px] h-[400px] rounded-full opacity-25 blur-3xl"
      style={{ background: 'radial-gradient(circle, #93C5FD, transparent 70%)' }}
    />
    <div aria-hidden className="absolute -bottom-32 -left-16 w-[300px] h-[300px] rounded-full opacity-20 blur-3xl"
      style={{ background: 'radial-gradient(circle, #BFDBFE, transparent 70%)' }}
    />

    {/* Logo */}
    <div className="relative flex items-center gap-2.5">
      <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
        <span className="text-white font-black text-xs">P</span>
      </div>
      <span className="text-white font-black text-base tracking-tight">Prospect</span>
    </div>

    {/* Laptop mockup — centrepiece */}
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
    >
      <LaptopMockup />
    </motion.div>

    {/* Headline */}
    <div className="relative">
      <p className="text-blue-300/80 text-[10px] font-black uppercase tracking-[0.2em] mb-3">{eyebrow}</p>
      <h2 className="text-white font-black text-[clamp(1.4rem,1.9vw,1.9rem)] leading-[1.1] mb-3" style={{ letterSpacing: '-0.03em' }}>
        {headline}
      </h2>
      <p className="text-blue-200/70 text-[13px] leading-relaxed font-medium max-w-[36ch]">{sub}</p>
    </div>
  </div>
);
