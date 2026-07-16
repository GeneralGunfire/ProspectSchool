import { useEffect, useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FileText, Search, X, ExternalLink, FolderOpen, SlidersHorizontal, CheckCircle2, Timer, ChevronLeft, ChevronDown } from 'lucide-react';
import { Shimmer } from './StudentHomePage';
import {
  fetchAllPastPapers, getPastPaperDownloadUrl, type PastPaper,
} from '../../../lib/pastPapers';
import { fetchSubjects, type Subject } from '../../../lib/students';
import type { StudentSession } from '../../../lib/auth';
import { getActiveInterventions, startIntervention, completeIntervention } from '../../../lib/interventions';

const GRADES = [8, 9, 10, 11, 12];
const TERMS  = [1, 2, 3, 4];
const ease = [0.23, 1, 0.32, 1] as [number, number, number, number];

interface StudentPastPapersPageProps {
  session: StudentSession;
  onNavigate?: (page: string) => void;
}

type PracticePhase = 'setup' | 'active' | 'complete';

interface PracticeSession {
  paper: PastPaper;
  phase: PracticePhase;
  startedAt: number | null;
  durationMinutes: number;
  elapsed: number;
  selfScore: number | null;
  memoOpened: boolean;
}

interface PracticeRecord {
  paperId: number;
  paperTitle: string;
  subject: string | null;
  score: number | null;
  total: number;
  pct: number | null;
  completedAt: string;
}

export default function StudentPastPapersPage({ session }: StudentPastPapersPageProps) {
  const [papers, setPapers]       = useState<PastPaper[]>([]);
  const [subjects, setSubjects]   = useState<Subject[]>([]);
  const [loading, setLoading]     = useState(true);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [search, setSearch]       = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterGrade, setFilterGrade]     = useState('');
  const [filterYear, setFilterYear]       = useState('');
  const [filterTerm, setFilterTerm]       = useState('');
  const [downloading, setDownloading]     = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen]   = useState(false);
  const [memoLoading, setMemoLoading]     = useState<number | null>(null);
  const [expandedId, setExpandedId]       = useState<number | null>(null);
  const [recentlyOpened, setRecentlyOpened] = useState<number[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(`prospect_recent_papers_${session.student_id}`) ?? '[]');
    } catch { return []; }
  });

  // Practice state
  const [practice, setPractice] = useState<PracticeSession | null>(null);
  const [setupDuration, setSetupDuration] = useState(60);
  const [setupScore, setSetupScore] = useState('');
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [practiceHistory, setPracticeHistory] = useState<PracticeRecord[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(`prospect_practice_history_${session.student_id}`) ?? '[]');
    } catch { return []; }
  });

  // Timer effect
  useEffect(() => {
    if (practice?.phase === 'active' && practice.startedAt) {
      timerRef.current = setInterval(() => {
        setPractice(prev => {
          if (!prev || prev.phase !== 'active') return prev;
          const elapsed = Math.floor((Date.now() - prev.startedAt!) / 1000);
          const totalSeconds = prev.durationMinutes * 60;
          if (elapsed >= totalSeconds) {
            clearInterval(timerRef.current!);
            return { ...prev, elapsed: totalSeconds, phase: 'complete' };
          }
          return { ...prev, elapsed };
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [practice?.phase, practice?.startedAt]);

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

  const activeFilterCount = [filterSubject, filterGrade, filterYear, filterTerm].filter(Boolean).length;
  const hasFilters = search || activeFilterCount > 0;

  function clearFilters() {
    setSearch('');
    setFilterSubject('');
    setFilterGrade('');
    setFilterYear('');
    setFilterTerm('');
  }

  async function handleOpen(p: PastPaper) {
    setRecentlyOpened(prev => {
      const updated = [p.id, ...prev.filter(id => id !== p.id)].slice(0, 5);
      localStorage.setItem(`prospect_recent_papers_${session.student_id}`, JSON.stringify(updated));
      return updated;
    });
    // Mark any matching past_paper intervention as started
    const active = await getActiveInterventions(session.student_id);
    const matching = active.find(i =>
      i.type === 'past_paper' &&
      (p.subject_label?.toLowerCase().includes(i.subject.split(' ')[0].toLowerCase()) ||
       i.subject.toLowerCase().includes((p.subject_label ?? '').split(' ')[0].toLowerCase()))
    );
    if (matching) await startIntervention(session.student_id, matching.id);

    setDownloading(p.id);
    const url = await getPastPaperDownloadUrl(p.file_url);
    setDownloading(null);
    if (url) window.open(url, '_blank');
  }

  async function handleShowMemo(p: PastPaper) {
    if (!p.memo_url) return;
    setMemoLoading(p.id);
    const url = await getPastPaperDownloadUrl(p.memo_url);
    setMemoLoading(null);
    if (url) window.open(url, '_blank');
  }

  // Helper functions
  function formatTimer(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }

  function startPractice(paper: PastPaper, durationMinutes: number) {
    setPractice({
      paper,
      phase: 'active',
      startedAt: Date.now(),
      durationMinutes,
      elapsed: 0,
      selfScore: null,
      memoOpened: false,
    });
    getPastPaperDownloadUrl(paper.file_url).then(url => {
      if (url) window.open(url, '_blank');
    });
  }

  function exitPractice() {
    if (timerRef.current) clearInterval(timerRef.current);
    setPractice(null);
    setSetupScore('');
  }

  async function submitSelfMark(score: number, total: number) {
    const pct = Math.round((score / total) * 100);
    const record: PracticeRecord = {
      paperId: practice!.paper.id,
      paperTitle: practice!.paper.title,
      subject: practice!.paper.subject_label ?? null,
      score,
      total,
      pct,
      completedAt: new Date().toISOString(),
    };
    setPracticeHistory(prev => {
      const updated = [record, ...prev].slice(0, 20);
      localStorage.setItem(
        `prospect_practice_history_${session.student_id}`,
        JSON.stringify(updated)
      );
      return updated;
    });
    // Complete any matching past_paper intervention
    const active = await getActiveInterventions(session.student_id);
    const matching = active.find(i =>
      i.type === 'past_paper' &&
      (practice!.paper.subject_label?.toLowerCase().includes(i.subject.split(' ')[0].toLowerCase()) ||
       i.subject.toLowerCase().includes((practice!.paper.subject_label ?? '').split(' ')[0].toLowerCase()))
    );
    if (matching) await completeIntervention(session.student_id, matching.id);

    setPractice(prev => prev ? { ...prev, selfScore: score, phase: 'complete' } : null);
  }

  // Recently opened papers (in order)
  const recentPapers = recentlyOpened
    .map(id => papers.find(p => p.id === id))
    .filter(Boolean) as PastPaper[];

  // Recommended papers — grade match, not yet opened, most recent year first
  const unopenedIds = new Set(
    papers.filter(p => !recentlyOpened.includes(p.id)).map(p => p.id)
  );
  const recommended = papers
    .filter(p => p.grade === session.grade && unopenedIds.has(p.id))
    .sort((a, b) => b.year - a.year || (b.term ?? 0) - (a.term ?? 0))
    .slice(0, 3);

  // Difficulty label — derived from title keywords
  function difficultyLabel(p: PastPaper): { label: string; color: string } {
    const t = p.title.toLowerCase();
    if (t.includes('exam') || t.includes('final')) return { label: 'Exam', color: 'bg-red-50 text-red-600 border-red-100' };
    if (t.includes('test') || t.includes('assessment')) return { label: 'Test', color: 'bg-amber-50 text-amber-600 border-amber-100' };
    if (t.includes('trial') || t.includes('prelim')) return { label: 'Trial', color: 'bg-violet-50 text-violet-600 border-violet-100' };
    return { label: 'Paper', color: 'bg-stone-100 text-stone-500 border-brand-border' };
  }

  // ── Practice Mode ──────────────────────────────────────────────
  if (practice) {
    const { paper, phase, elapsed, durationMinutes, memoOpened } = practice;
    const totalSeconds = durationMinutes * 60;
    const remaining = Math.max(0, totalSeconds - elapsed);
    const progressPct = Math.min(100, Math.round((elapsed / totalSeconds) * 100));
    const isUrgent = remaining <= 300 && phase === 'active';

    return (
      <div className="student-home min-h-screen bg-stone-50 flex flex-col">

        {/* Practice top bar */}
        <div className="bg-brand-dark px-5 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={exitPractice}
              className="flex items-center gap-1.5 text-stone-500 hover:text-white transition-colors text-[11px] font-black uppercase tracking-widest"
            >
              <ChevronLeft className="w-3.5 h-3.5" /> Exit
            </button>
            <div className="w-px h-4 bg-stone-700" />
            <div>
              <p className="text-white font-black text-sm leading-none">{paper.title}</p>
              {paper.subject_label && (
                <p className="text-stone-500 text-[10px] mt-0.5">{paper.subject_label}</p>
              )}
            </div>
          </div>

          {/* Timer */}
          {phase === 'active' && (
            <div className={`font-black text-2xl tabular-nums ${isUrgent ? 'text-red-400' : 'text-white'}`}>
              {formatTimer(remaining)}
            </div>
          )}
          {phase === 'complete' && (
            <span className="text-emerald-400 font-black text-sm uppercase tracking-widest">Time Up</span>
          )}
        </div>

        {/* Timer progress bar */}
        {phase === 'active' && (
          <div className="h-1 bg-brand-dark/90 shrink-0">
            <div
              className={`h-full transition-all duration-1000 ${isUrgent ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${100 - progressPct}%` }}
            />
          </div>
        )}

        {/* Phase: setup */}
        {phase === 'setup' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-sm w-full"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Practice Mode</p>
              <h2 className="font-black text-brand-dark text-2xl mb-1" style={{ letterSpacing: '-0.02em' }}>
                {paper.title}
              </h2>
              {paper.subject_label && (
                <p className="text-stone-500 text-sm mb-6">{paper.subject_label} · {paper.year}</p>
              )}

              <div className="paper-card rounded p-5 mb-4">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">
                  Set Timer
                </p>
                <div className="flex gap-2 flex-wrap mb-3">
                  {[30, 60, 90, 120, 150, 180].map(mins => (
                    <button
                      key={mins}
                      onClick={() => setSetupDuration(mins)}
                      className={`px-3 py-2 rounded text-xs font-black transition-colors border ${
                        setupDuration === mins
                          ? 'bg-brand-dark text-white border-brand-dark'
                          : 'bg-stone-50 text-stone-600 border-brand-border hover:border-stone-400'
                      }`}
                    >
                      {mins >= 60 ? `${mins / 60}h${mins % 60 ? ` ${mins % 60}m` : ''}` : `${mins}m`}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-stone-500">
                  The paper will open in a new tab. Come back here to track time and self-mark.
                </p>
              </div>

              <button
                onClick={() => startPractice(paper, setupDuration)}
                className="w-full py-4 rounded bg-brand-dark text-white font-black text-sm hover:bg-stone-700 transition-colors"
              >
                Start — {setupDuration >= 60 ? `${setupDuration / 60}h${setupDuration % 60 ? ` ${setupDuration % 60}m` : ''}` : `${setupDuration}m`}
              </button>
              <button
                onClick={exitPractice}
                className="w-full py-3 rounded text-stone-500 font-black text-sm hover:text-stone-700 transition-colors mt-2"
              >
                Cancel
              </button>
            </motion.div>
          </div>
        )}

        {/* Phase: active */}
        {phase === 'active' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md w-full"
            >
              <div className={`text-7xl font-black tabular-nums mb-2 ${isUrgent ? 'text-red-500' : 'text-brand-dark'}`}>
                {formatTimer(remaining)}
              </div>
              <p className="text-stone-500 text-sm mb-8">
                {isUrgent ? 'Wrap up — time is running out.' : 'Paper is open in another tab. Work through it, then come back.'}
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => getPastPaperDownloadUrl(paper.file_url).then(url => url && window.open(url, '_blank'))}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded bg-stone-100 text-stone-700 text-sm font-black hover:bg-stone-200 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Reopen Paper
                </button>

                {paper.memo_url && !memoOpened && (
                  <button
                    onClick={() => {
                      getPastPaperDownloadUrl(paper.memo_url!).then(url => url && window.open(url, '_blank'));
                      setPractice(prev => prev ? { ...prev, memoOpened: true } : null);
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-black hover:bg-emerald-100 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Open Memo
                  </button>
                )}
                {memoOpened && (
                  <p className="text-[11px] text-emerald-600 font-bold">Memo opened — self-mark when ready.</p>
                )}

                <button
                  onClick={() => setPractice(prev => prev ? { ...prev, phase: 'complete' } : null)}
                  className="w-full py-3 rounded border border-brand-border text-stone-500 text-sm font-black hover:border-stone-400 transition-colors"
                >
                  Done — Self Mark Now
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Phase: complete / self-mark */}
        {phase === 'complete' && (
          <div className="flex-1 flex flex-col items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-sm w-full"
            >
              {practice.selfScore === null ? (
                <>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Self Mark</p>
                  <h2 className="font-black text-brand-dark text-2xl mb-1" style={{ letterSpacing: '-0.02em' }}>
                    How did you do?
                  </h2>
                  <p className="text-sm text-stone-500 mb-6">
                    Enter your score to track your performance.
                  </p>

                  <div className="paper-card rounded p-5 mb-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">Your Score</p>
                    <div className="flex items-center gap-3 mb-4">
                      <input
                        type="number"
                        min={0}
                        max={150}
                        value={setupScore}
                        onChange={e => setSetupScore(e.target.value)}
                        placeholder="0"
                        className="w-24 text-center font-black text-2xl rounded border border-brand-border py-3 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-brand-dark/10"
                      />
                      <span className="text-stone-500 font-bold text-lg">
                        / {150}
                      </span>
                      {setupScore && (
                        <span className={`font-black text-xl ml-2 ${
                          Math.round((Number(setupScore) / (150)) * 100) >= 70 ? 'text-emerald-600' :
                          Math.round((Number(setupScore) / (150)) * 100) >= 50 ? 'text-amber-600' :
                          'text-red-500'
                        }`}>
                          {Math.round((Number(setupScore) / (150)) * 100)}%
                        </span>
                      )}
                    </div>

                    {paper.memo_url && (
                      <button
                        onClick={() => getPastPaperDownloadUrl(paper.memo_url!).then(url => url && window.open(url, '_blank'))}
                        className="flex items-center gap-1.5 text-[11px] font-black text-emerald-600 hover:text-emerald-800 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Open Memo to Check Answers
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      const score = Number(setupScore);
                      const total = 150;
                      if (score >= 0 && score <= total) {
                        submitSelfMark(score, total);
                      }
                    }}
                    disabled={!setupScore || Number(setupScore) < 0}
                    className="w-full py-3.5 rounded bg-brand-dark text-white font-black text-sm hover:bg-stone-700 transition-colors disabled:opacity-40"
                  >
                    Save Result
                  </button>

                  <button
                    onClick={exitPractice}
                    className="w-full py-3 rounded text-stone-500 font-black text-sm hover:text-stone-700 transition-colors mt-2"
                  >
                    Skip — Exit Practice
                  </button>
                </>
              ) : (
                /* Result screen */
                <>
                  <div className={`rounded p-6 text-center mb-5 ${
                    practice.selfScore / (150) >= 0.7 ? 'bg-emerald-50 border border-emerald-200' :
                    practice.selfScore / (150) >= 0.5 ? 'bg-amber-50 border border-amber-200' :
                    'bg-red-50 border border-red-200'
                  }`}>
                    <p className={`font-black leading-none mb-1 ${
                      practice.selfScore / (150) >= 0.7 ? 'text-emerald-600' :
                      practice.selfScore / (150) >= 0.5 ? 'text-amber-600' :
                      'text-red-500'
                    }`} style={{ fontSize: 'clamp(3rem, 10vw, 5rem)' }}>
                      {Math.round((practice.selfScore / (150)) * 100)}%
                    </p>
                    <p className="text-stone-600 font-bold text-sm">
                      {practice.selfScore} / {150} marks
                    </p>
                    <p className="text-stone-500 text-xs mt-1">
                      Completed in {formatTimer(elapsed)}
                    </p>
                  </div>

                  <p className="text-center text-sm text-stone-500 mb-6">
                    {Math.round((practice.selfScore / (150)) * 100) >= 70
                      ? 'Strong result — well done.'
                      : Math.round((practice.selfScore / (150)) * 100) >= 50
                      ? 'On track — review the areas you struggled with.'
                      : 'Below pass mark — open the memo and work through the corrections.'}
                  </p>

                  <div className="space-y-2">
                    {paper.memo_url && (
                      <button
                        onClick={() => getPastPaperDownloadUrl(paper.memo_url!).then(url => url && window.open(url, '_blank'))}
                        className="w-full flex items-center justify-center gap-2 py-3 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-black text-sm hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Review Memo
                      </button>
                    )}
                    <button
                      onClick={exitPractice}
                      className="w-full py-3 rounded bg-brand-dark text-white font-black text-sm hover:bg-stone-700 transition-colors"
                    >
                      Back to Past Papers
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="student-home min-h-full pb-16">

      {/* ═══ Hero — full-width crested banner ═══════════════════════ */}
      <div className="relative overflow-hidden bg-brand-dark border-b border-brand-border grain-surface flex flex-col justify-end min-h-[220px] sm:min-h-[260px] lg:min-h-[280px]">
        <div className="absolute inset-0 pointer-events-none">
          <motion.img src="/images/nizamiye-pastpapers.png" alt=""
            onLoad={() => setImgLoaded(true)}
            initial={{ opacity: 0 }} animate={{ opacity: imgLoaded ? 0.62 : 0 }}
            transition={{ duration: 0.6, ease }}
            className="w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(100deg, rgba(21,23,28,0.82) 0%, rgba(21,23,28,0.62) 35%, rgba(21,23,28,0.3) 62%, rgba(21,23,28,0.66) 100%)' }} />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(21,23,28,0.05) 0%, transparent 35%, rgba(21,23,28,0.75) 100%)' }} />
        </div>
        <div className="absolute -bottom-32 -left-24 w-[24rem] h-[24rem] rounded-full blur-3xl opacity-[0.08] pointer-events-none"
          style={{ background: 'radial-gradient(circle, var(--color-accent), transparent 70%)' }} />

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 pt-8 sm:pt-11 pb-8 sm:pb-10 w-full">
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease }}
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/45">Past Papers</p>
            <h1 className="font-display font-extrabold text-white text-[28px] sm:text-[36px] mt-2 leading-[1.1]" style={{ letterSpacing: '-0.02em', textShadow: '0 2px 20px rgba(0,0,0,0.35)' }}>
              Past exam papers
            </h1>
            <p className="text-[13px] text-white/60 mt-2.5 font-medium">
              Practice with real papers uploaded by your school.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ═══ Body ═════════════════════════════════════════════════ */}
      <div className="max-w-6xl mx-auto px-4 sm:px-8 relative z-10 space-y-5 sm:space-y-6 pt-6 sm:pt-8">

      {!loading && papers.length > 0 && (
        <>
          {/* ── Recommended section ── */}
          {recommended.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, ease }}
            >
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">
                Recommended For You
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {recommended.map(p => {
                  const diff = difficultyLabel(p);
                  return (
                    <div key={p.id} className="paper-card rounded p-4 hover:border-stone-400 hover:shadow-sm transition-all">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-8 h-8 rounded bg-stone-100 flex items-center justify-center">
                          <FileText className="w-4 h-4 text-stone-600" />
                        </div>
                        {p.memo_url && (
                          <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                            Memo
                          </span>
                        )}
                      </div>
                      <p className="font-black text-brand-dark text-sm leading-snug mb-1">{p.title}</p>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {p.subject_label && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">{p.subject_label}</span>
                        )}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">{p.year}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diff.color}`}>{diff.label}</span>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => setPractice({
                            paper: p,
                            phase: 'setup',
                            startedAt: null,
                            durationMinutes: 60,
                            elapsed: 0,
                            selfScore: null,
                            memoOpened: false,
                          })}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded bg-stone-100 text-stone-700 text-xs font-black hover:bg-stone-200 transition-colors border border-brand-border"
                        >
                          <Timer className="w-3.5 h-3.5" />
                          Practice
                        </button>
                        <button
                          onClick={() => handleOpen(p)}
                          disabled={downloading === p.id}
                          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded bg-brand-dark text-white text-xs font-black hover:bg-stone-700 transition-colors disabled:opacity-40"
                        >
                          <ExternalLink className="w-3 h-3" />
                          {downloading === p.id ? '…' : 'Open'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ── Recently Opened ── */}
          {recentPapers.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, ease: [0.23, 1, 0.32, 1] }}
              className="mb-6"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">
                Recently Opened
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {recentPapers.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleOpen(p)}
                    disabled={downloading === p.id}
                    className="shrink-0 bg-white border border-brand-border rounded px-3 py-2.5 text-left hover:border-stone-400 transition-colors min-w-40 max-w-50 disabled:opacity-40"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <FileText className="w-3 h-3 text-stone-500 shrink-0" />
                      {p.memo_url && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />}
                    </div>
                    <p className="text-xs font-bold text-brand-dark truncate">{p.title}</p>
                    <p className="text-[10px] text-stone-500 truncate">{p.subject_label ?? `Grade ${p.grade}`} · {p.year}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Practice History ── */}
          {practiceHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="mb-6"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-3">
                Practice History
              </p>
              <div className="paper-card rounded divide-y divide-stone-100 overflow-hidden">
                {practiceHistory.slice(0, 5).map((r, i) => (
                  <div key={i} className="flex items-center gap-4 px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-brand-dark truncate">{r.paperTitle}</p>
                      <p className="text-[11px] text-stone-500">
                        {r.subject ?? 'Past Paper'} · {new Date(r.completedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    {r.pct !== null ? (
                      <span className={`font-black text-sm px-2.5 py-1 rounded ${
                        r.pct >= 70 ? 'bg-emerald-50 text-emerald-700' :
                        r.pct >= 50 ? 'bg-amber-50 text-amber-700' :
                                      'bg-red-50 text-red-600'
                      }`}>
                        {r.pct}%
                      </span>
                    ) : (
                      <span className="text-[11px] text-stone-400 font-bold">No score</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── Search + Filters ── */}
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="space-y-3 mb-5"
          >
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 pointer-events-none" />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search by title or subject…"
                  className="w-full pl-10 pr-9 py-3 rounded border border-brand-border text-sm font-bold text-brand-dark placeholder:text-stone-400 focus:outline-none focus:border-stone-400 focus:ring-2 focus:ring-brand-dark/10 bg-white"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                    <X className="w-3.5 h-3.5 text-stone-500" />
                  </button>
                )}
              </div>
              <button
                onClick={() => setIsFilterOpen(v => !v)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded font-bold text-xs uppercase tracking-widest transition-colors border whitespace-nowrap ${
                  isFilterOpen
                    ? 'bg-brand-dark text-white border-brand-dark'
                    : 'bg-white text-stone-700 border-brand-border hover:border-stone-400'
                }`}
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters
                {activeFilterCount > 0 && (
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-black ${
                    isFilterOpen ? 'bg-white text-brand-dark' : 'bg-brand-dark text-white'
                  }`}>
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            {/* Collapsible filter panel */}
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ ease: 'easeOut', duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="paper-card rounded p-5 space-y-5">

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Subject</p>
                      <div className="flex flex-wrap gap-2">
                        {subjects.filter(s => papers.some(p => p.subject_id === s.id)).map(s => (
                          <button key={s.id}
                            onClick={() => setFilterSubject(filterSubject === String(s.id) ? '' : String(s.id))}
                            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors border ${
                              filterSubject === String(s.id)
                                ? 'bg-brand-dark text-white border-brand-dark'
                                : 'bg-white text-stone-600 border-brand-border hover:border-stone-400'
                            }`}
                          >{s.label}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Grade</p>
                      <div className="flex flex-wrap gap-2">
                        {GRADES.filter(g => papers.some(p => p.grade === g)).map(g => (
                          <button key={g}
                            onClick={() => setFilterGrade(filterGrade === String(g) ? '' : String(g))}
                            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors border ${
                              filterGrade === String(g)
                                ? 'bg-brand-dark text-white border-brand-dark'
                                : 'bg-white text-stone-600 border-brand-border hover:border-stone-400'
                            }`}
                          >Grade {g}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Year</p>
                      <div className="flex flex-wrap gap-2">
                        {yearOptions.map(y => (
                          <button key={y}
                            onClick={() => setFilterYear(filterYear === String(y) ? '' : String(y))}
                            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors border ${
                              filterYear === String(y)
                                ? 'bg-brand-dark text-white border-brand-dark'
                                : 'bg-white text-stone-600 border-brand-border hover:border-stone-400'
                            }`}
                          >{y}</button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-stone-500 mb-2">Term</p>
                      <div className="flex flex-wrap gap-2">
                        {TERMS.filter(t => papers.some(p => p.term === t)).map(t => (
                          <button key={t}
                            onClick={() => setFilterTerm(filterTerm === String(t) ? '' : String(t))}
                            className={`px-3 py-1.5 rounded text-xs font-bold transition-colors border ${
                              filterTerm === String(t)
                                ? 'bg-brand-dark text-white border-brand-dark'
                                : 'bg-white text-stone-600 border-brand-border hover:border-stone-400'
                            }`}
                          >Term {t}</button>
                        ))}
                      </div>
                    </div>

                    {activeFilterCount > 0 && (
                      <div className="flex justify-end pt-1 border-t border-brand-border/60">
                        <button onClick={clearFilters}
                          className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-stone-500 hover:text-stone-700 transition-colors">
                          <X className="w-3.5 h-3.5" />
                          Clear {activeFilterCount} filter{activeFilterCount !== 1 ? 's' : ''}
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-stone-500">
                {filtered.length} paper{filtered.length !== 1 ? 's' : ''}
              </p>
              {hasFilters && (
                <button onClick={clearFilters}
                  className="text-xs font-black text-stone-500 hover:text-stone-700 transition-colors">
                  Clear all
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}

      {/* ── Paper list ── */}
      {loading ? (
        <div className="space-y-2.5">
          {[0, 1, 2, 3].map(i => (
            <motion.div key={i}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.05, ease }}
              className="paper-card rounded p-4 flex items-center gap-3"
            >
              <Shimmer className="w-9 h-9 rounded shrink-0" />
              <div className="flex-1 space-y-2">
                <Shimmer className="h-4" style={{ width: `${55 - i * 6}%` }} />
                <Shimmer className="h-3 w-1/3" />
              </div>
            </motion.div>
          ))}
        </div>
      ) : papers.length === 0 ? (
        <div className="paper-card rounded p-5 sm:p-7 flex flex-col items-center justify-center py-20 text-center">
          <FolderOpen className="w-9 h-9 text-stone-200 mb-4" />
          <p className="text-[16px] font-semibold text-brand-dark">No past papers yet.</p>
          <p className="text-[13px] text-[rgba(31,36,33,0.4)] mt-1">Papers uploaded by your teachers will appear here.</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="w-8 h-8 text-stone-200 mb-3" />
          <p className="text-sm font-black text-stone-500 mb-1">No papers match your filters.</p>
          <button onClick={clearFilters}
            className="mt-2 text-xs font-black text-stone-500 hover:text-stone-800 transition-colors">
            Clear filters
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((p, i) => {
            const diff = difficultyLabel(p);
            const wasOpened = recentlyOpened.includes(p.id);
            const isExpanded = expandedId === p.id;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: Math.min(i * 0.02, 0.12), duration: 0.18 }}
                className="paper-card rounded overflow-hidden hover:border-stone-300 transition-colors"
              >
                {/* Collapsed row — icon, title, one meta line */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : p.id)}
                  className="w-full flex items-center gap-3 px-4 py-3.5 text-left"
                >
                  <div className="relative w-9 h-9 shrink-0">
                    <div className="w-9 h-9 rounded bg-stone-100 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-stone-600" />
                    </div>
                    {p.memo_url && (
                      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-brand-dark truncate">{p.title}</p>
                    <p className="text-[11px] text-stone-500 truncate">
                      {p.subject_label ? `${p.subject_label} · ` : ''}{p.year}{p.term ? ` · Term ${p.term}` : ''}
                      {wasOpened && ' · Opened'}
                    </p>
                  </div>
                  <ChevronDown className={`w-4 h-4 text-stone-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                {/* Expanded — badges + actions */}
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 border-t border-brand-border/60">
                        <div className="flex items-center gap-1.5 flex-wrap mt-3 mb-4">
                          {p.subject_label && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">{p.subject_label}</span>
                          )}
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">Grade {p.grade}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">{p.year}</span>
                          {p.term && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">Term {p.term}</span>
                          )}
                          {p.paper_number > 1 && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-500">Paper {p.paper_number}</span>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${diff.color}`}>{diff.label}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => setPractice({
                              paper: p,
                              phase: 'setup',
                              startedAt: null,
                              durationMinutes: 60,
                              elapsed: 0,
                              selfScore: null,
                              memoOpened: false,
                            })}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded bg-stone-100 text-stone-700 text-xs font-black hover:bg-stone-200 transition-colors border border-brand-border"
                          >
                            <Timer className="w-3.5 h-3.5" />
                            Practice
                          </button>

                          <button
                            onClick={() => handleOpen(p)}
                            disabled={downloading === p.id}
                            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded bg-brand-dark text-white text-xs font-black hover:bg-brand-dark/90 transition-colors disabled:opacity-40"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            {downloading === p.id ? 'Opening…' : 'Open'}
                          </button>

                          {p.memo_url && (
                            <button
                              onClick={() => handleShowMemo(p)}
                              disabled={memoLoading === p.id}
                              className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded text-xs font-black transition-colors disabled:opacity-40 bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              {memoLoading === p.id ? 'Opening…' : 'Memo'}
                            </button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}
