import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, ArrowRight } from 'lucide-react';

const tradeRequirements: Record<string, { required: string[]; recommended: string[]; notes: string }> = {
  'Electrical & Energy': {
    required:    ['Mathematics', 'Physical Science'],
    recommended: ['Technical Studies', 'Engineering Graphics'],
    notes: 'Strong maths matters most. Pass at 40%+ in both required subjects.',
  },
  'Plumbing': {
    required:    ['Mathematics'],
    recommended: ['Physical Science', 'Life Sciences'],
    notes: 'Practical maths skills matter more than theory. Average grades acceptable.',
  },
  'Construction': {
    required:    ['Mathematics'],
    recommended: ['Physical Science', 'Engineering Graphics'],
    notes: 'Basic maths for measurements. No top grades needed.',
  },
  'Automotive': {
    required:    ['Mathematics', 'Physical Science'],
    recommended: ['Technical Studies', 'English'],
    notes: 'Mechanical understanding is important. Hands-on skills are taught during training.',
  },
  'Welding & Metal': {
    required:    ['Mathematics', 'Physical Science'],
    recommended: ['Engineering Graphics', 'Technical Studies'],
    notes: 'Maths for measurements. Physical stamina also matters.',
  },
  'Engineering': {
    required:    ['Mathematics', 'Physical Science'],
    recommended: ['Engineering Graphics'],
    notes: 'Strong technical foundation needed. Good maths grades help.',
  },
  'Hospitality': {
    required:    ['English'],
    recommended: ['Mathematics', 'Life Sciences'],
    notes: 'Customer service and communication skills matter most. Grades less critical.',
  },
  'Beauty & Wellness': {
    required:    ['English'],
    recommended: ['Life Sciences', 'Mathematics'],
    notes: 'Communication and creativity are key. No specific grade requirements.',
  },
  'IT & Digital': {
    required:    ['Mathematics', 'English'],
    recommended: ['Computer Studies', 'Physical Science'],
    notes: 'Logic and problem-solving matter. Average maths grades are sufficient.',
  },
};

const subjectGuide = [
  { subject: 'Mathematics',                       importance: 'Critical',       why: 'Used in measurements, calculations, and safety standards across almost every trade.' },
  { subject: 'Physical Science / Life Sciences',  importance: 'Important',      why: 'Electrical trades need Physics. Plumbing benefits from both.' },
  { subject: 'English / Home Language',           importance: 'Always useful',  why: 'Communication, reading instructions, and job applications.' },
  { subject: 'Technical Studies / EGD',           importance: 'Trade bonus',    why: 'Perfect foundation for construction, manufacturing, and automotive.' },
  { subject: 'Computer Studies',                  importance: 'Modern trades',  why: 'All trades increasingly use technology. Good general foundation.' },
];

const importanceCls: Record<string, string> = {
  'Critical':      'bg-slate-900 text-white',
  'Important':     'bg-slate-200 text-slate-700',
  'Always useful': 'bg-slate-100 text-slate-600',
  'Trade bonus':   'bg-slate-100 text-slate-600',
  'Modern trades': 'bg-slate-100 text-slate-600',
};

function TVETRequirementsPage({ onNavigate }: { onNavigate: (page: any) => void }) {
  const [selectedTrade, setSelectedTrade] = useState<string | null>(null);

  return (
    <div className="min-h-screen" style={{ background: 'oklch(98.5% 0.005 80)' }}>

      <div className="pt-24 pb-20">
        {/* Header */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-8">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-3">TVET</p>
          <h1
            className="text-3xl sm:text-4xl font-black text-slate-900 mb-3"
            style={{ letterSpacing: '-0.025em' }}
          >
            Requirements
          </h1>
          <p className="text-[15px] text-slate-500 leading-[1.65] max-w-lg">
            A matric pass with the right subjects is enough for most TVET programs. No top grades needed.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-16">

          {/* By trade type */}
          <section>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-5">Requirements by Trade</p>

            <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100">
              {Object.entries(tradeRequirements).map(([trade, reqs]) => {
                const isOpen = selectedTrade === trade;
                return (
                  <div key={trade}>
                    <button
                      onClick={() => setSelectedTrade(isOpen ? null : trade)}
                      className="w-full flex items-start justify-between px-5 py-5 text-left hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex-1 pr-4">
                        <p
                          className="text-[14px] font-black text-slate-900 mb-3"
                          style={{ letterSpacing: '-0.014em' }}
                        >
                          {trade}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {reqs.required.map((subj) => (
                            <span
                              key={subj}
                              className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-slate-900 text-white"
                            >
                              {subj}
                            </span>
                          ))}
                        </div>
                      </div>
                      <ChevronDown
                        size={15}
                        className={`text-slate-400 shrink-0 mt-1 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ ease: 'easeOut', duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-6 pt-3 bg-slate-50 border-t border-slate-100 space-y-4">
                            <div>
                              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400 mb-2.5">
                                Recommended
                              </p>
                              <div className="flex flex-wrap gap-1.5">
                                {reqs.recommended.map((subj) => (
                                  <span
                                    key={subj}
                                    className="text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-slate-300 text-slate-500"
                                  >
                                    {subj}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <p className="text-[15px] text-slate-500 leading-[1.65]">{reqs.notes}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Subject guide */}
          <section>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-5">Subject Guide</p>

            <div className="divide-y divide-slate-100">
              {subjectGuide.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex gap-6 py-5"
                >
                  <span className="text-[11px] font-black text-slate-300 shrink-0 w-5 tabular-nums mt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h4
                        className="text-[14px] font-black text-slate-900"
                        style={{ letterSpacing: '-0.014em' }}
                      >
                        {item.subject}
                      </h4>
                      <span className={`text-[9px] font-black uppercase tracking-[0.18em] px-2 py-0.5 rounded-full ${importanceCls[item.importance]}`}>
                        {item.importance}
                      </span>
                    </div>
                    <p className="text-[15px] text-slate-500 leading-[1.65]">{item.why}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Low grades CTA */}
          <section>
            <div className="border border-slate-100 rounded-xl p-8">
              <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-4">
                What if your grades are low?
              </p>
              <p className="text-[15px] font-black text-slate-900 mb-2" style={{ letterSpacing: '-0.014em' }}>
                Most TVET programs accept any matric pass.
              </p>
              <p className="text-[15px] text-slate-500 leading-[1.65] mb-6 max-w-md">
                Practical skills are taught during training. Colleges prioritize motivated students over high marks. Don't let current grades hold you back.
              </p>
              <button
                onClick={() => onNavigate('tvet-careers')}
                className="flex items-center gap-2 text-[12px] font-black text-slate-900 hover:text-slate-500 transition-colors uppercase tracking-widest"
              >
                Explore TVET careers <ArrowRight size={14} />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TVETRequirementsPage;
