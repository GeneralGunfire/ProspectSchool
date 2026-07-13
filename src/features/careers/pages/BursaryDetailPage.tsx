import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle2, XCircle, FileText, PenTool, ExternalLink, Bookmark, AlertCircle, ArrowRight } from 'lucide-react';
import { bursaries } from '../data/bursaries';

function BursaryDetailPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const bursaryId = typeof window !== 'undefined' ? sessionStorage.getItem('selectedBursaryId') : null;
  const bursary   = bursaryId ? bursaries.find((b) => b.id === bursaryId) : null;
  const [eligibilityAnswers, setEligibilityAnswers] = useState<Record<string, boolean>>({});
  const [savedBursaries, setSavedBursaries] = useState<string[]>([]);

  if (!bursary) {
    return (
      <div className="min-h-screen" style={{ background: '#F5F0E8' }}>
        <div className="pt-32 pb-16 px-4 max-w-lg mx-auto text-center">
          <h1 className="text-2xl font-black text-slate-900 mb-4" style={{ letterSpacing: '-0.02em' }}>Bursary not found</h1>
          <button onClick={() => onNavigate('bursaries')} className="px-6 py-3 rounded-xl text-white font-bold text-xs uppercase tracking-widest bg-slate-900 hover:bg-slate-700 transition-colors">
            Back to Bursaries
          </button>
        </div>
      </div>
    );
  }

  const isSaved = savedBursaries.includes(bursary.id);

  const toggleSave = () => {
    if (isSaved) {
      setSavedBursaries((prev) => prev.filter((s) => s !== bursary.id));
    } else {
      setSavedBursaries((prev) => [...prev, bursary.id]);
    }
  };

  const eligibilityChecks = useMemo(() => {
    const checks: { key: string; label: string }[] = [];
    if (bursary.requirements.minMarks)      checks.push({ key: 'marks',       label: `Minimum marks: ${bursary.requirements.minMarks}` });
    if (bursary.requirements.maxIncome)     checks.push({ key: 'income',      label: `Household income: ${bursary.requirements.maxIncome}` });
    if (bursary.requirements.citizenship)   checks.push({ key: 'citizenship', label: `Citizenship: ${bursary.requirements.citizenship}` });
    if (bursary.requirements.ageLimit)      checks.push({ key: 'age',         label: `Age limit: ${bursary.requirements.ageLimit}` });
    bursary.requirements.specialRequirements?.forEach((req, i) =>
      checks.push({ key: `special-${i}`, label: req }),
    );
    return checks;
  }, [bursary]);

  const coverageItems = useMemo(() => {
    const items: string[] = [];
    if (bursary.coverage.tuition)       items.push('Full tuition fees');
    if (bursary.coverage.accommodation) items.push('Accommodation and residence fees');
    if (bursary.coverage.meals)         items.push('Meal plan and food allowance');
    if (bursary.coverage.books)         items.push('Learning materials and laptop');
    if (bursary.coverage.transport)     items.push('Transport and travel allowance');
    if (bursary.coverage.laptop)        items.push('Laptop and computer equipment');
    if (bursary.coverage.stipend)       items.push(`Monthly stipend: ${bursary.coverage.stipend}`);
    return items;
  }, [bursary]);

  const eligibilityPct = eligibilityChecks.length > 0
    ? Math.round((Object.values(eligibilityAnswers).filter(Boolean).length / eligibilityChecks.length) * 100)
    : 0;

  const eligibilityColor = eligibilityPct >= 100 ? 'text-emerald-600' : eligibilityPct >= 75 ? 'text-amber-600' : 'text-red-500';
  const eligibilityMsg   =
    eligibilityPct === 100  ? 'You appear to meet all requirements. Review the details carefully before applying.' :
    eligibilityPct >= 75    ? 'You meet most requirements. Check the gaps with the provider before applying.' :
    eligibilityPct >= 50    ? 'You meet some requirements. Contact the provider to clarify your eligibility.' :
                              "You don't currently meet most requirements. Consider other bursaries or improving your profile.";

  const applicationSteps = [
    { step: 1, title: 'Create an account',    desc: `Go to ${bursary.contact.website} and register with your email and personal details.` },
    { step: 2, title: 'Prepare documents',    desc: `Gather: ${bursary.applicationProcess.requiredDocuments.slice(0, 3).join(', ')}, and more.` },
    { step: 3, title: 'Complete the form',    desc: 'Fill in the online application accurately. Double-check before submitting.' },
    { step: 4, title: 'Upload documents',     desc: 'Attach certified copies of all required documents to your application.' },
    { step: 5, title: 'Submit on time',       desc: `Submit before the deadline: ${bursary.applicationProcess.deadline}` },
    { step: 6, title: 'Wait for feedback',    desc: 'Check your email. Shortlisted candidates will be invited for interviews.' },
  ];

  const similarBursaries = bursaries.filter((b) => b.id !== bursary.id && b.category === bursary.category).slice(0, 3);

  return (
    <div className="min-h-screen" style={{ background: '#F5F0E8' }}>

      <div className="pt-24 pb-16 px-4 max-w-3xl mx-auto">

        {/* Back */}
        <button
          onClick={() => onNavigate('bursaries')}
          className="flex items-center gap-2 mb-8 text-sm font-bold uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Bursaries
        </button>

        {/* ── Header card ── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">{bursary.category}</p>
          <div className="flex items-start justify-between gap-6 mb-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 mb-1" style={{ letterSpacing: '-0.025em' }}>
                {bursary.name}
              </h1>
              <p className="text-sm font-medium text-slate-400">by {bursary.provider}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={toggleSave}
                aria-label={isSaved ? 'Unsave' : 'Save'}
                className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  isSaved ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-200 text-slate-400 hover:border-slate-400'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
              </button>
              <a
                href={bursary.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="h-10 px-5 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-700 transition-colors flex items-center gap-2"
              >
                Apply <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
          <p className="text-[15px] leading-[1.7] text-slate-600 mb-5">{bursary.description}</p>
          <div className="flex flex-wrap gap-2">
            {bursary.tags.map((tag, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-slate-50 border border-slate-200 text-slate-500">
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Eligibility checker ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5">Am I Eligible?</p>
          <div className="space-y-2 mb-5">
            {eligibilityChecks.map((check) => {
              const checked = !!eligibilityAnswers[check.key];
              return (
                <div
                  key={check.key}
                  onClick={() => setEligibilityAnswers({ ...eligibilityAnswers, [check.key]: !checked })}
                  className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all select-none ${
                    checked ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-100 hover:border-slate-200'
                  }`}
                >
                  {checked
                    ? <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
                    : <div className="w-5 h-5 rounded-full border-2 border-slate-300 shrink-0" />
                  }
                  <p className="text-sm font-medium text-slate-800">{check.label}</p>
                </div>
              );
            })}
          </div>

          {eligibilityChecks.length > 0 && (
            <div className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
              <div>
                <p className="text-sm font-black text-slate-900 mb-1">
                  Your match: <span className={eligibilityColor}>{eligibilityPct}%</span>
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">{eligibilityMsg}</p>
              </div>
            </div>
          )}
        </motion.section>

        {/* ── What's covered ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }} className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5">What's Covered</p>
          <div className="divide-y divide-slate-100">
            {coverageItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <span className="text-sm font-medium text-slate-800">{item}</span>
              </div>
            ))}
          </div>
          {bursary.coverage.totalValue && (
            <div className="mt-5 flex items-center justify-between p-4 bg-slate-900 rounded-xl text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Total value</p>
              <p className="text-xl font-black" style={{ letterSpacing: '-0.02em' }}>{bursary.coverage.totalValue}</p>
            </div>
          )}
        </motion.section>

        {/* ── How to apply ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }} className="mb-8">
          <div className="flex items-start justify-between gap-4 mb-5">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">How to Apply</p>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-1 rounded-full">
              Deadline: {bursary.applicationProcess.deadline}
            </span>
          </div>
          {bursary.applicationProcess.timeline && (
            <p className="text-sm text-slate-500 leading-relaxed mb-6">{bursary.applicationProcess.timeline}</p>
          )}
          <div className="space-y-4">
            {applicationSteps.map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                  {item.step}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 mb-0.5">{item.title}</p>
                  <p className="text-xs leading-relaxed text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>

        {/* ── Required documents ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5">Required Documents</p>
          <div className="divide-y divide-slate-100">
            {bursary.applicationProcess.requiredDocuments.map((doc, i) => (
              <div key={i} className="flex items-start gap-3 py-3">
                <FileText className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                <p className="text-sm font-medium text-slate-800">{doc}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-xs font-bold text-amber-800 mb-1">Pro tip</p>
            <p className="text-xs text-amber-700 leading-relaxed">
              Prepare documents well in advance. Get certified copies from school immediately after your marks are released. Keep digital backups of everything you upload.
            </p>
          </div>
        </motion.section>

        {/* ── Motivation letter guide ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }} className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5">Motivation Letter Guide</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5">
            <div className="p-5 bg-emerald-50 border border-emerald-100 rounded-xl">
              <p className="text-xs font-black uppercase tracking-wider text-emerald-700 mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5" /> What to do
              </p>
              <ul className="space-y-2">
                {['Be specific with your story', 'Show resilience despite challenges', 'Explain why this bursary matters to you', 'Show gratitude and commitment', 'Proofread carefully', 'Be honest and authentic', 'Show how you will contribute to society'].map((t) => (
                  <li key={t} className="text-xs text-emerald-800 leading-relaxed">{t}</li>
                ))}
              </ul>
            </div>
            <div className="p-5 bg-red-50 border border-red-100 rounded-xl">
              <p className="text-xs font-black uppercase tracking-wider text-red-600 mb-4 flex items-center gap-2">
                <XCircle className="w-3.5 h-3.5" /> What not to do
              </p>
              <ul className="space-y-2">
                {["Don't just say \"I'm poor, help me\"", "Don't make excuses for poor grades", "Don't lie or exaggerate achievements", "Don't copy from others", "Don't sound desperate", "Don't ignore the word limit", "Don't focus only on money"].map((t) => (
                  <li key={t} className="text-xs text-red-800 leading-relaxed">{t}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl mb-4">
            <p className="text-xs font-black uppercase tracking-wider text-slate-500 mb-4">Structure</p>
            <div className="space-y-3">
              {[
                { part: 'Opening', desc: 'Start with a powerful statement about who you are or what drives you.' },
                { part: 'Your story', desc: 'Describe your background, challenges, and how you overcame them.' },
                { part: 'Why this bursary', desc: 'Explain how this bursary aligns with your goals and why it matters.' },
                { part: 'Future goals', desc: 'What will you achieve with this support? How will you give back?' },
              ].map(({ part, desc }) => (
                <div key={part}>
                  <span className="text-xs font-bold text-slate-800">{part}: </span>
                  <span className="text-xs text-slate-500">{desc}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 bg-slate-50 border border-slate-100 rounded-xl">
            <p className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
              <PenTool className="w-3 h-3" /> Example
            </p>
            <p className="text-xs italic leading-relaxed text-slate-600">
              "I come from Khayelitsha where my mother works as a domestic worker earning R3,500/month. My father passed when I was 8. Despite walking 2km daily to school and helping at home, I achieved 78% last year because I believe education is my path to a better life. This bursary would mean my mother does not need extra jobs for my tuition. I'm passionate about engineering to help build better communities. If selected, I commit to maintaining excellence and mentoring younger students from my township."
            </p>
          </div>
        </motion.section>

        {/* ── Success stories ── */}
        {bursary.successStories && bursary.successStories.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }} className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5">Success Stories</p>
            <div className="divide-y divide-slate-100">
              {bursary.successStories.map((story, i) => (
                <div key={i} className="py-5 first:pt-0 last:pb-0">
                  <p className="text-sm font-black text-slate-900 mb-3" style={{ letterSpacing: '-0.01em' }}>{story.studentName}</p>
                  <div className="space-y-1.5 text-sm">
                    <p><span className="font-bold text-slate-500">Background: </span><span className="text-slate-600">{story.background}</span></p>
                    <p><span className="font-bold text-slate-500">What helped: </span><span className="text-slate-600">{story.whatHelped}</span></p>
                    <p><span className="font-bold text-emerald-600">Outcome: </span><span className="text-emerald-700">{story.outcome}</span></p>
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        )}

        {/* ── Contact + CTA ── */}
        <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }} className="mb-8">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-5">Contact</p>
          <div className="flex flex-wrap gap-3 mb-8">
            <a href={`mailto:${bursary.contact.email}`} className="text-sm font-bold text-slate-900 hover:text-slate-600 transition-colors">
              {bursary.contact.email}
            </a>
            {bursary.contact.phone && (
              <>
                <span className="text-slate-200">·</span>
                <a href={`tel:${bursary.contact.phone}`} className="text-sm font-bold text-slate-900 hover:text-slate-600 transition-colors">
                  {bursary.contact.phone}
                </a>
              </>
            )}
          </div>

          {/* Ready to apply dark panel */}
          <div className="bg-slate-900 rounded-xl p-7">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-3">Ready to apply</p>
            <h3 className="text-lg font-black text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
              Submit before {bursary.applicationProcess.deadline}
            </h3>
            <ol className="space-y-2 text-sm mb-7 text-slate-400">
              {['Review all requirements above', 'Gather certified document copies', 'Draft your motivation letter', 'Visit the official website and submit', 'Keep records of your application'].map((s, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="font-bold text-slate-600">{i + 1}.</span> {s}
                </li>
              ))}
            </ol>
            <div className="flex flex-wrap gap-3">
              <a
                href={bursary.contact.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-lg font-bold text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors"
              >
                Start Application <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={toggleSave}
                className={`inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-xs uppercase tracking-widest border transition-all ${
                  isSaved ? 'bg-slate-700 border-slate-700 text-white' : 'border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
                {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
        </motion.section>

        {/* ── Similar bursaries — flat list ── */}
        {similarBursaries.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36 }}>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Similar Bursaries</p>
            <div className="divide-y divide-slate-100">
              {similarBursaries.map((sb) => (
                <button
                  key={sb.id}
                  onClick={() => { sessionStorage.setItem('selectedBursaryId', sb.id); onNavigate('bursary'); }}
                  className="w-full flex items-center justify-between gap-4 py-4 text-left group hover:bg-slate-50 -mx-1 px-1 rounded-lg transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-0.5">{sb.provider}</p>
                    <p className="text-sm font-bold text-slate-900 leading-snug truncate">{sb.name}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </button>
              ))}
            </div>
          </motion.section>
        )}

      </div>
    </div>
  );
}

export default BursaryDetailPage;
