import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Search, X, ExternalLink, FolderOpen } from 'lucide-react';
import {
  fetchAllPastPapers, getPastPaperDownloadUrl, type PastPaper,
} from '../../../lib/pastPapers';
import { fetchSubjects, type Subject } from '../../../lib/students';
import type { StudentSession } from '../../../lib/auth';

const GRADES = [8, 9, 10, 11, 12];
const TERMS  = [1, 2, 3, 4];

interface StudentPastPapersPageProps { session: StudentSession; }

export default function StudentPastPapersPage({ session }: StudentPastPapersPageProps) {
  const [papers, setPapers]       = useState<PastPaper[]>([]);
  const [subjects, setSubjects]   = useState<Subject[]>([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterGrade, setFilterGrade]     = useState('');
  const [filterYear, setFilterYear]       = useState('');
  const [filterTerm, setFilterTerm]       = useState('');
  const [downloading, setDownloading]     = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      fetchAllPastPapers(session.school_id),
      fetchSubjects(),
    ]).then(([p, s]) => {
      setPapers(p);
      setSubjects(s);
      setLoading(false);
    });
  }, []);

  // Derive unique years from papers
  const yearOptions = useMemo(() => {
    return [...new Set(papers.map(p => p.year))].sort((a, b) => b - a);
  }, [papers]);

  // Filter
  const filtered = useMemo(() => {
    return papers.filter(p => {
      if (filterSubject && String(p.subject_id) !== filterSubject) return false;
      if (filterGrade   && String(p.grade) !== filterGrade)         return false;
      if (filterYear    && String(p.year) !== filterYear)            return false;
      if (filterTerm    && String(p.term) !== filterTerm)            return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.subject_label?.toLowerCase().includes(q) ||
          String(p.year).includes(q)
        );
      }
      return true;
    });
  }, [papers, search, filterSubject, filterGrade, filterYear, filterTerm]);

  const hasFilters = search || filterSubject || filterGrade || filterYear || filterTerm;

  async function handleOpen(p: PastPaper) {
    setDownloading(p.id);
    const url = await getPastPaperDownloadUrl(p.file_url);
    setDownloading(null);
    if (url) window.open(url, '_blank');
  }

  return (
    <div className="px-6 py-8 sm:px-8 max-w-4xl">

      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Past Papers</p>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Past Papers</h1>
        <p className="text-sm text-slate-400 mt-0.5">All past exam papers from your school.</p>
      </div>

      {/* Search + filters */}
      {!loading && papers.length > 0 && (
        <div className="space-y-3 mb-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by title or subject…"
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900" />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="w-3.5 h-3.5 text-slate-400" />
              </button>
            )}
          </div>

          {/* Filter pills row */}
          <div className="flex flex-wrap items-center gap-2">
            <select value={filterSubject} onChange={e => setFilterSubject(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-black text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white">
              <option value="">All subjects</option>
              {subjects.filter(s => papers.some(p => p.subject_id === s.id)).map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>

            <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-black text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white">
              <option value="">All grades</option>
              {GRADES.filter(g => papers.some(p => p.grade === g)).map(g => (
                <option key={g} value={g}>Grade {g}</option>
              ))}
            </select>

            <select value={filterYear} onChange={e => setFilterYear(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-black text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white">
              <option value="">All years</option>
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            <select value={filterTerm} onChange={e => setFilterTerm(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-black text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white">
              <option value="">All terms</option>
              {TERMS.filter(t => papers.some(p => p.term === t)).map(t => (
                <option key={t} value={t}>Term {t}</option>
              ))}
            </select>

            {hasFilters && (
              <button
                onClick={() => { setSearch(''); setFilterSubject(''); setFilterGrade(''); setFilterYear(''); setFilterTerm(''); }}
                className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-black text-slate-500 hover:bg-slate-100 transition-colors">
                Clear
              </button>
            )}

            <p className="text-xs font-bold text-slate-400 ml-auto">
              {filtered.length} paper{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full" />
        </div>
      ) : papers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FolderOpen className="w-10 h-10 text-slate-200 mb-4" />
          <p className="text-sm font-bold text-slate-400">No past papers yet.</p>
          <p className="text-xs text-slate-300 mt-1">Papers uploaded by your teachers will appear here.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Search className="w-10 h-10 text-slate-200 mb-4" />
          <p className="text-sm font-bold text-slate-400">No papers match your filters.</p>
          <button onClick={() => { setSearch(''); setFilterSubject(''); setFilterGrade(''); setFilterYear(''); setFilterTerm(''); }}
            className="mt-3 text-xs font-black text-slate-500 hover:text-slate-800 transition-colors">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p, i) => (
            <motion.div key={p.id}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.02, duration: 0.18 }}
              className="bg-white rounded-2xl border border-slate-200 px-5 py-4 flex items-center gap-4">

              <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900">{p.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  {p.subject_label && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-blue-600">
                      {p.subject_label}
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    Grade {p.grade}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                    {p.year}
                  </span>
                  {p.term && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      Term {p.term}
                    </span>
                  )}
                  {p.paper_number > 1 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                      Paper {p.paper_number}
                    </span>
                  )}
                </div>
              </div>

              <button onClick={() => handleOpen(p)} disabled={downloading === p.id}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 text-white text-xs font-black hover:bg-slate-700 transition-colors disabled:opacity-40 shrink-0">
                <ExternalLink className="w-3.5 h-3.5" />
                {downloading === p.id ? 'Opening…' : 'Open'}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
