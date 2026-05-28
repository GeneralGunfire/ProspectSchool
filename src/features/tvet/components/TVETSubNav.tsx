import { useRef, useEffect } from 'react';
import { usePillVisible } from '../../../shared/hooks/usePillVisible';

interface TVETSubNavProps {
  currentPage: 'overview' | 'careers' | 'colleges' | 'funding' | 'requirements';
  onNavigate: (page: string) => void;
}

const LINKS = [
  { label: 'Overview',     page: 'tvet',              key: 'overview'     },
  { label: 'Careers',      page: 'tvet-careers',      key: 'careers'      },
  { label: 'Colleges',     page: 'tvet-colleges',     key: 'colleges'     },
  { label: 'Funding',      page: 'tvet-funding',      key: 'funding'      },
  { label: 'Requirements', page: 'tvet-requirements', key: 'requirements' },
];

const PILL_HEIGHT = 72; // top-6 (24px) + h-12 (48px)

export function TVETSubNav({ currentPage, onNavigate }: TVETSubNavProps) {
  const activeRef = useRef<HTMLButtonElement>(null);
  const pillVisible = usePillVisible();

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [currentPage]);

  return (
    <div
      className="sticky z-30 bg-white border-b border-slate-200 transition-[top] duration-300"
      style={{ top: pillVisible ? PILL_HEIGHT : 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div
          className="flex overflow-x-auto sm:justify-center"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {LINKS.map((link) => {
            const isActive = currentPage === link.key;
            return (
              <button
                key={link.key}
                ref={isActive ? activeRef : undefined}
                onClick={() => onNavigate(link.page)}
                className={`relative px-5 py-4 text-[12px] font-black uppercase tracking-[0.14em] whitespace-nowrap shrink-0 transition-colors ${
                  isActive ? 'text-slate-900' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
