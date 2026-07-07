import { useState, useEffect } from 'react';
import { Plus, Minus } from 'lucide-react';
import type { StudentSession } from '../../../lib/auth';
import { fetchStudentBehaviour, type BehaviourEntry } from '../../../lib/behaviour';

interface StudentBehaviourPageProps { session: StudentSession; }

export default function StudentBehaviourPage({ session }: StudentBehaviourPageProps) {
  const [entries, setEntries] = useState<BehaviourEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await fetchStudentBehaviour(session.student_id);
      setEntries(data);
      setLoading(false);
    };
    load();
  }, [session.student_id]);

  const meritPoints = entries.filter((e) => e.type === 'merit').reduce((sum, e) => sum + e.points, 0);
  const demeritPoints = entries.filter((e) => e.type === 'demerit').reduce((sum, e) => sum + e.points, 0);
  const netPoints = meritPoints - demeritPoints;

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-ZA', { weekday: 'short', day: 'numeric', month: 'short' });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-5 h-5 border-2 border-brand-border border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:p-6 md:p-8 max-w-3xl w-full mx-auto">
      <div className="mb-6">
        <span className="eyebrow">My Behaviour</span>
        <h1 className="text-2xl font-black text-brand-dark tracking-tight">Merits & Demerits</h1>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card-premium bg-white border border-brand-border rounded-2xl p-4 text-center">
          <p className="text-xl font-black text-green-700">{meritPoints}</p>
          <p className="text-[11px] font-black uppercase tracking-wider text-stone-500 mt-1">Merits</p>
        </div>
        <div className="card-premium bg-white border border-brand-border rounded-2xl p-4 text-center">
          <p className="text-xl font-black text-red-700">{demeritPoints}</p>
          <p className="text-[11px] font-black uppercase tracking-wider text-stone-500 mt-1">Demerits</p>
        </div>
        <div className="card-premium bg-brand-dark border border-brand-dark rounded-2xl p-4 text-center">
          <p className={`text-xl font-black ${netPoints >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {netPoints > 0 ? '+' : ''}{netPoints}
          </p>
          <p className="text-[11px] font-black uppercase tracking-wider text-stone-300 mt-1">Net</p>
        </div>
      </div>

      <div className="card-premium bg-white border border-brand-border rounded-[24px] overflow-hidden">
        <div className="px-6 py-4 border-b border-brand-border/60">
          <h2 className="text-sm font-black text-brand-dark">Timeline</h2>
          <p className="text-xs text-stone-500 mt-0.5">All recorded behaviour points, most recent first.</p>
        </div>

        {entries.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-bold text-brand-dark mb-1">No entries yet</p>
            <p className="text-sm text-stone-500">Merits and demerits from your teachers will appear here.</p>
          </div>
        ) : (
          <div className="divide-y divide-stone-50">
            {entries.map((e) => (
              <div key={e.id} className="flex items-start gap-3 px-6 py-4">
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  e.type === 'merit' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                }`}>
                  {e.type === 'merit' ? <Plus className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-brand-dark">{e.category}</p>
                    <span className="text-xs text-stone-400 whitespace-nowrap">{formatDate(e.created_at)}</span>
                  </div>
                  {e.reason && <p className="text-xs text-stone-600 font-medium mt-0.5">{e.reason}</p>}
                  <p className="text-xs text-stone-500 mt-0.5">{e.teacher_name ?? 'Teacher'} {e.teacher_surname ?? ''}</p>
                  {e.note && <p className="text-xs text-stone-600 mt-1.5">{e.note}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
