import type { Key } from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import type { CareerFull } from '../data/careersTypes';

interface TVETCareerCardProps {
  key?: Key;
  career: CareerFull;
  onCardClick?: () => void;
}

const demandConfig: Record<string, {
  label: string;
  badgeCls: string;
  footerCls: string;
}> = {
  high:   {
    label:    'High demand',
    badgeCls: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    footerCls: 'bg-emerald-50/60',
  },
  medium: {
    label:    'Medium demand',
    badgeCls: 'bg-amber-50 text-amber-700 border border-amber-100',
    footerCls: 'bg-slate-50',
  },
  low:    {
    label:    'Low demand',
    badgeCls: 'bg-red-50 text-red-600 border border-red-100',
    footerCls: 'bg-slate-50',
  },
};

export function TVETCareerCard({ career, onCardClick }: TVETCareerCardProps) {
  const config   = demandConfig[career.jobDemand.level];
  const salary   = `R${(career.salary.entryLevel / 1000).toFixed(0)}k`;
  const duration = career.studyPath.timeToQualify;

  return (
    <div
      onClick={onCardClick}
      data-testid="career-card"
      className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-400 hover:shadow-sm transition-all duration-200 flex flex-col cursor-pointer"
    >
      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        {/* Top row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 leading-none mt-0.5">
            TVET Career
          </p>
          {config && (
            <span className={`shrink-0 text-[9px] font-black uppercase tracking-wider px-2 py-1 rounded-full ${config.badgeCls}`}>
              {config.label}
            </span>
          )}
        </div>

        {/* Title */}
        <h3
          className="text-[17px] font-black text-slate-900 leading-snug mb-2.5 line-clamp-2 group-hover:text-slate-700 transition-colors duration-150"
          style={{ letterSpacing: '-0.022em' }}
        >
          {career.title}
        </h3>

        {/* Description */}
        <p className="text-[13px] leading-[1.6] text-slate-500 line-clamp-2 flex-1">
          {career.description}
        </p>
      </div>

      {/* Footer — demand-tinted */}
      <div className={`px-5 py-4 border-t border-slate-100 ${config?.footerCls ?? 'bg-white'}`}>
        <div className="flex items-end justify-between gap-2">
          <div>
            <p className="text-[15px] font-black text-slate-900 leading-none" style={{ letterSpacing: '-0.015em' }}>
              {salary}
              <span className="text-[11px] font-medium text-slate-400 ml-1">/ month to start</span>
            </p>
            <div className="flex items-center gap-1.5 mt-1 text-slate-400">
              <Clock size={10} />
              <span className="text-[11px] font-medium">{duration}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] font-black text-slate-400">
              {career.jobDemand.growthPercentage}% growth
            </span>
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
