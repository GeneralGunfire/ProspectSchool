import type { Key } from 'react';
import { ArrowRight } from 'lucide-react';
import type { Career } from '../data/careers';
import type { CareerFull } from '../data/careersTypes';

interface CareerCardProps {
  key?: Key;
  career: Career | CareerFull;
  onCardClick?: () => void;
}

// ── Label maps ────────────────────────────────────────────────────────────────

const categoryLabels: Record<string, string> = {
  university: 'University',
  tvet:       'TVET College',
  trade:      'Trade',
  digital:    'Digital & Tech',
  creative:   'Creative',
  business:   'Business',
};

// Demand: badge text + colors + footer tint
const demandConfig: Record<string, {
  label: string;
  badgeCls: string;
  footerCls: string;
}> = {
  high:   {
    label:     'High demand',
    badgeCls:  'bg-emerald-50 text-emerald-700 border border-emerald-100',
    footerCls: 'bg-emerald-50/60',
  },
  medium: {
    label:     'Medium demand',
    badgeCls:  'bg-amber-50 text-amber-700 border border-amber-100',
    footerCls: 'bg-slate-50',
  },
  low:    {
    label:     'Low demand',
    badgeCls:  'bg-red-50 text-red-600 border border-red-100',
    footerCls: 'bg-slate-50',
  },
};

// RIASEC letter color — one letter visible always, consistent with quiz
const riasecColor: Record<string, string> = {
  R: 'text-red-500',
  I: 'text-blue-500',
  A: 'text-violet-500',
  S: 'text-green-500',
  E: 'text-amber-500',
  C: 'text-slate-500',
};

const riasecLabel: Record<string, string> = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional',
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getTopRiasec(career: Career | CareerFull): string[] {
  if ('riasecMatch' in career) {
    return Object.entries(career.riasecMatch)
      .map(([code, score]) => ({ code: code[0].toUpperCase(), score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 2)
      .map((e) => e.code);
  }
  return (career as Career).riasec.slice(0, 2);
}

function getSalary(career: Career | CareerFull): string {
  if ('salary' in career && typeof (career as CareerFull).salary === 'object') {
    const n = (career as CareerFull).salary.entryLevel;
    return `R${(n / 1000).toFixed(0)}k`;
  }
  return (career as Career).salary || '';
}

function getAPS(career: Career | CareerFull): number {
  if ('matricRequirements' in career) return (career as CareerFull).matricRequirements.minimumAps;
  return (career as Career).aps || 0;
}

function getDemand(career: Career | CareerFull): string | null {
  if ('jobDemand' in career && typeof (career as CareerFull).jobDemand === 'object') {
    return (career as CareerFull).jobDemand?.level ?? null;
  }
  return null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function CareerCard({ career, onCardClick }: CareerCardProps) {
  const topRiasec = getTopRiasec(career);
  const salary    = getSalary(career);
  const aps       = getAPS(career);
  const demand    = getDemand(career);
  const config    = demand ? demandConfig[demand] : null;
  const catLabel  = categoryLabels[career.category] ?? career.category;

  return (
    <div
      onClick={onCardClick}
      data-testid="career-card"
      className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-400 hover:shadow-sm transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* ── Card body ── */}
      <div className="p-5 flex flex-col flex-1">

        {/* Top row: category + demand badge */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 leading-none mt-0.5">
            {catLabel}
          </p>
          {config && (
            <span className={`shrink-0 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${config.badgeCls}`}>
              {config.label}
            </span>
          )}
        </div>

        {/* Title — the dominant element */}
        <h3
          className="text-[17px] font-black text-slate-900 leading-snug mb-2.5 line-clamp-2 group-hover:text-slate-700 transition-colors duration-150"
          style={{ letterSpacing: '-0.022em' }}
        >
          {career.title}
        </h3>

        {/* Description — secondary, recedes */}
        <p className="text-[13px] leading-[1.6] text-slate-500 line-clamp-2 flex-1">
          {career.description}
        </p>
      </div>

      {/* ── Footer — demand-tinted, scannable numbers ── */}
      <div className={`px-5 py-4 border-t border-slate-100 ${config?.footerCls ?? 'bg-white'}`}>
        <div className="flex items-end justify-between gap-2">

          {/* Left: salary (anchor) + APS qualifier */}
          <div>
            <p className="text-[15px] font-black text-slate-900 leading-none" style={{ letterSpacing: '-0.015em' }}>
              {salary}
              <span className="text-[11px] font-medium text-slate-400 ml-1">/ month to start</span>
            </p>
            {aps > 0 && (
              <p className="text-[11px] font-medium text-slate-400 mt-1">
                APS {aps}+ to apply
              </p>
            )}
          </div>

          {/* Right: RIASEC letters + arrow */}
          <div className="flex items-center gap-2 shrink-0">
            {topRiasec.length > 0 && (
              <div
                className="flex items-center gap-1"
                title={topRiasec.map((c) => riasecLabel[c] ?? c).join(' + ')}
                aria-label={`Personality match: ${topRiasec.map((c) => riasecLabel[c] ?? c).join(' and ')}`}
              >
                {topRiasec.map((code) => (
                  <span
                    key={code}
                    className={`text-[11px] font-black leading-none ${riasecColor[code] ?? 'text-slate-400'}`}
                  >
                    {code}
                  </span>
                ))}
              </div>
            )}
            <ArrowRight
              className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all duration-150"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
