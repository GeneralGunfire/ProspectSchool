import { motion } from 'motion/react';
import { ArrowRight, Zap, Clock, TrendingUp, DollarSign, BookOpen, Wrench } from 'lucide-react';

const reasons = [
  {
    icon: Clock,
    title: 'Faster to qualify',
    stat: '2–3 years',
    desc: 'Enter the workforce sooner. Start earning while peers are still studying.',
  },
  {
    icon: Wrench,
    title: 'Job-ready from day one',
    stat: 'Hands-on training',
    desc: 'Practical skills employers actually need — not years of theory first.',
  },
  {
    icon: BookOpen,
    title: 'Low entry bar',
    stat: 'Any matric pass',
    desc: 'No minimum APS required for most programs. Motivation matters more than marks.',
  },
  {
    icon: DollarSign,
    title: 'High-demand trades',
    stat: 'R20k–R60k+/mo',
    desc: 'Electricians, plumbers, and welders are among the highest earners in SA.',
  },
  {
    icon: Zap,
    title: 'Earn while you learn',
    stat: 'R8–15k/mo during training',
    desc: 'Apprenticeships pay you a monthly salary throughout your qualification.',
  },
  {
    icon: TrendingUp,
    title: 'Growing industry',
    stat: 'Thousands of new roles/year',
    desc: 'Infrastructure, energy, and construction create consistent demand for skilled trades.',
  },
];

const comparison = [
  { aspect: 'Duration',        tvet: '2–3 years',              uni: '4–6 years' },
  { aspect: 'Entry',           tvet: 'Any matric pass',         uni: 'APS 24–30+ required' },
  { aspect: 'Annual cost',     tvet: 'R0–10k (NSFAS covers)',   uni: 'R30–80k/year' },
  { aspect: 'Training style',  tvet: 'Hands-on, practical',     uni: 'Theory-heavy' },
  { aspect: 'Time to earn',    tvet: '2–3 years',               uni: '4–6 years minimum' },
  { aspect: 'Starting salary', tvet: 'R15–25k/month',           uni: 'R18–35k/month' },
];

function TVETPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>

      {/* Hero */}
      <div className="pt-24 bg-[#0f172a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.26em] text-white/30 mb-6">
              Vocational Education — South Africa
            </p>
            <h1
              className="text-5xl sm:text-6xl font-black text-white mb-6 leading-[1.0]"
              style={{ letterSpacing: '-0.03em' }}
            >
              Real skills.<br />Real income.
            </h1>
            <p className="text-[16px] text-white/50 leading-[1.75] mb-10 max-w-md">
              TVET trades are high-demand, well-paying, and faster to qualify for than a university degree.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('tvet-careers')}
                className="px-6 py-3 bg-white text-slate-900 rounded-lg font-black text-[11px] uppercase tracking-widest hover:bg-slate-100 transition-colors"
              >
                Browse Careers
              </button>
              <button
                onClick={() => onNavigate('tvet-colleges')}
                className="px-6 py-3 rounded-lg font-black text-[11px] uppercase tracking-widest border border-white/20 text-white/70 hover:border-white/40 hover:text-white transition-colors"
              >
                Find a College
              </button>
            </div>
          </motion.div>

          {/* Key stats row */}
          <div className="mt-16 pt-12 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {[
              { value: '50+',     label: 'Public colleges' },
              { value: 'R0–10k', label: 'Annual cost with NSFAS' },
              { value: '2–3yr',  label: 'To qualify' },
              { value: 'R60k+',  label: 'Senior trade salary' },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-black text-white mb-1" style={{ letterSpacing: '-0.03em' }}>{stat.value}</p>
                <p className="text-[11px] text-white/35 uppercase tracking-[0.14em] font-bold">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why TVET */}
      <div className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-12">
          Why Choose TVET
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-slate-100 border border-slate-100 rounded-xl overflow-hidden">
          {reasons.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(idx * 0.06, 0.3), ease: 'easeOut' }}
                className="bg-white p-8"
              >
                <Icon className="w-5 h-5 text-slate-400 mb-5" strokeWidth={1.5} />
                <p
                  className="text-[22px] font-black text-slate-900 mb-1 leading-tight"
                  style={{ letterSpacing: '-0.02em' }}
                >
                  {item.stat}
                </p>
                <p className="text-[12px] font-black text-slate-900 uppercase tracking-[0.12em] mb-3">{item.title}</p>
                <p className="text-[15px] text-slate-500 leading-[1.65]">{item.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* TVET vs University */}
      <div className="px-4 sm:px-6 pb-20 max-w-7xl mx-auto">
        <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-8">
          TVET vs University
        </p>

        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-100">
            <div className="px-6 py-4">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Aspect</p>
            </div>
            <div className="px-6 py-4 border-l border-slate-100">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-600">TVET</p>
            </div>
            <div className="px-6 py-4 border-l border-slate-100">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">University</p>
            </div>
          </div>
          {comparison.map((row, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.04 }}
              className={`grid grid-cols-3 border-b border-slate-100 last:border-b-0 ${idx % 2 === 1 ? 'bg-slate-50/50' : ''}`}
            >
              <div className="px-6 py-4">
                <p className="text-[12px] font-black text-slate-500">{row.aspect}</p>
              </div>
              <div className="px-6 py-4 border-l border-slate-100">
                <p className="text-[14px] font-bold text-slate-900">{row.tvet}</p>
              </div>
              <div className="px-6 py-4 border-l border-slate-100">
                <p className="text-[14px] text-slate-400">{row.uni}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-6 items-center">
          <button
            onClick={() => onNavigate('tvet-careers')}
            className="flex items-center gap-2 text-[12px] font-black text-slate-900 hover:text-slate-500 transition-colors uppercase tracking-widest"
          >
            Browse careers <ArrowRight size={13} />
          </button>
          <button
            onClick={() => onNavigate('tvet-funding')}
            className="flex items-center gap-2 text-[12px] font-black text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-widest"
          >
            Funding options <ArrowRight size={13} />
          </button>
          <button
            onClick={() => onNavigate('tvet-requirements')}
            className="flex items-center gap-2 text-[12px] font-black text-slate-400 hover:text-slate-700 transition-colors uppercase tracking-widest"
          >
            Entry requirements <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TVETPage;
