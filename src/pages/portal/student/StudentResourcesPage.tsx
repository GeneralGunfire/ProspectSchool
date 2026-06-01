import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Paperclip, Link2, FileText, ExternalLink, FolderOpen, Search, X } from 'lucide-react';
import {
  fetchStudentResources, getResourceDownloadUrl,
  RESOURCE_TYPE_META,
  type Resource, type ResourceType,
} from '../../../lib/resources';
import { supabaseAdmin } from '../../../lib/supabase';
import type { StudentSession } from '../../../lib/auth';

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short', year: 'numeric' });
}

const TypeIcon = { file: Paperclip, link: Link2, note: FileText };

interface StudentResourcesPageProps {
  session: StudentSession;
}

export default function StudentResourcesPage({ session }: StudentResourcesPageProps) {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [subjectIds, setSubjectIds] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<ResourceType | 'all'>('all');
  const [downloading, setDownloading] = useState<number | null>(null);
  // expanded note
  const [expandedNote, setExpandedNote] = useState<number | null>(null);

  useEffect(() => {
    // Load student's subject IDs, then load resources
    supabaseAdmin
      .from('teacher_students')
      .select('subject_id')
      .eq('student_id', session.student_id)
      .then(({ data }) => {
        const ids = [...new Set((data ?? []).map((r: any) => r.subject_id as number))];
        setSubjectIds(ids);
        return fetchStudentResources(
          session.school_id,
          session.student_id,
          session.grade,
          session.cohort_id,
          ids,
        );
      })
      .then(r => {
        setResources(r);
        setLoading(false);
      });
  }, []);

  async function handleOpen(r: Resource) {
    if (r.resource_type === 'link' && r.link_url) {
      window.open(r.link_url.startsWith('http') ? r.link_url : `https://${r.link_url}`, '_blank');
    } else if (r.resource_type === 'file' && r.file_url) {
      setDownloading(r.id);
      const url = await getResourceDownloadUrl(r.file_url);
      setDownloading(null);
      if (url) window.open(url, '_blank');
    }
  }

  // Filter
  const filtered = resources.filter(r => {
    if (filterType !== 'all' && r.resource_type !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        r.title.toLowerCase().includes(q) ||
        r.description?.toLowerCase().includes(q) ||
        r.subject_label?.toLowerCase().includes(q) ||
        r.note_content?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-5 md:p-8 max-w-6xl w-full mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Resources</p>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Class Resources</h1>
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search resources…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>

        {/* Type filter pills */}
        <div className="flex items-center gap-1.5">
          {(['all', 'file', 'link', 'note'] as const).map(t => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-2 rounded-xl text-xs font-black transition-all ${
                filterType === t ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
            >
              {t === 'all' ? 'All' : RESOURCE_TYPE_META[t].label + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            className="w-5 h-5 border-2 border-slate-200 border-t-slate-700 rounded-full" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <FolderOpen className="w-10 h-10 text-slate-200 mb-4" />
          <p className="text-sm font-bold text-slate-400">
            {resources.length === 0 ? 'No resources yet.' : 'No results for that search.'}
          </p>
          {resources.length === 0 && (
            <p className="text-xs text-slate-300 mt-1">Your teacher hasn't added any resources yet.</p>
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r, i) => {
            const meta = RESOURCE_TYPE_META[r.resource_type];
            const Icon = TypeIcon[r.resource_type];
            const isNote = r.resource_type === 'note';
            const noteExpanded = expandedNote === r.id;

            return (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03, duration: 0.18 }}
                className="bg-white rounded-2xl border border-slate-200 px-5 py-4"
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${meta.badge}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-0.5">
                      <p className="text-sm font-bold text-slate-900">{r.title}</p>
                      {r.subject_label && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                          {r.subject_label}
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${meta.badge}`}>
                        {meta.label}
                      </span>
                    </div>
                    {r.description && (
                      <p className="text-xs text-slate-400 mb-1">{r.description}</p>
                    )}
                    {r.resource_type === 'link' && r.link_url && (
                      <p className="text-xs text-violet-500 truncate">{r.link_url}</p>
                    )}
                    {r.resource_type === 'file' && r.file_name && (
                      <p className="text-xs text-slate-400">{r.file_name}</p>
                    )}
                    {isNote && r.note_content && (
                      <AnimatePresence initial={false}>
                        {noteExpanded ? (
                          <motion.p
                            key="expanded"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-xs text-slate-600 bg-amber-50 rounded-xl px-3 py-2 mt-1 leading-relaxed border border-amber-100 overflow-hidden"
                          >
                            {r.note_content}
                          </motion.p>
                        ) : (
                          <p className="text-xs text-slate-400 mt-0.5 truncate">{r.note_content}</p>
                        )}
                      </AnimatePresence>
                    )}
                    <p className="text-[10px] text-slate-300 mt-1">{formatDate(r.created_at)}</p>
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    {isNote ? (
                      <button
                        onClick={() => setExpandedNote(noteExpanded ? null : r.id)}
                        className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700 text-xs font-black"
                      >
                        {noteExpanded ? 'Less' : 'Read'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpen(r)}
                        disabled={downloading === r.id}
                        className="p-2 rounded-xl hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700 disabled:opacity-40"
                        title={r.resource_type === 'file' ? 'Download' : 'Open link'}
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
