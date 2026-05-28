import { motion } from 'motion/react';
import { ArrowRight, CheckCircle } from 'lucide-react';

const fundingOptions = [
  {
    title: 'NSFAS',
    tag: 'Most students qualify',
    tagCls: 'bg-emerald-50 text-emerald-700 border border-emerald-100',
    desc: 'Government bursary covering tuition for households under R350k/year income. No repayment required when you graduate.',
    facts: ['Tuition: R0–10k/year', 'Living allowance: R3–4k/month', 'Book and equipment allowance included'],
    highlight: true,
  },
  {
    title: 'SETA Bursaries',
    tag: 'Industry-sponsored',
    tagCls: 'bg-slate-100 text-slate-600 border border-slate-200',
    desc: 'Sector Education Training Authorities — Eskom, Construction SETA, Manufacturing SETA — fund students directly.',
    facts: ['R10–25k annually', 'No minimum grades required', 'Apply directly to SETA bodies'],
    highlight: false,
  },
  {
    title: 'Apprenticeships',
    tag: 'Earn while you learn',
    tagCls: 'bg-slate-100 text-slate-600 border border-slate-200',
    desc: 'An employer hires and pays you while you complete your qualification. Most common in electrical, plumbing, and automotive.',
    facts: ['R8–15k/month during training', 'All training costs covered', 'High employment rate after completion'],
    highlight: false,
  },
  {
    title: 'Company-Sponsored Training',
    tag: 'Guaranteed placement',
    tagCls: 'bg-slate-100 text-slate-600 border border-slate-200',
    desc: 'Major employers like Absa, Nedbank, and Eskom hire trainees and fund qualifications with employment guaranteed after.',
    facts: ['Monthly stipend + training paid', 'Guaranteed job placement', '2–3 year commitment required'],
    highlight: false,
  },
];

const applySteps = [
  { title: 'Complete matric',            desc: 'No minimum grade required for TVET entry, unlike university.' },
  { title: 'Choose your TVET career',    desc: 'Browse careers in our TVET section. Match to local demand and your interests.' },
  { title: 'Find a TVET college',        desc: 'Use the college finder to locate NSFAS-accredited colleges near you.' },
  { title: 'Apply for NSFAS',            desc: 'Visit nsfas.org.za before May–June deadlines. Apply early — spots fill fast.' },
  { title: 'Apply to the college',       desc: 'Submit directly to the TVET college. Deadlines vary by province and program.' },
  { title: 'Explore apprenticeships',    desc: 'Apply to companies offering apprenticeship programs alongside your studies.' },
  { title: 'Graduate and start earning', desc: 'Enter the workforce at R15–25k+/month. Build toward trade ownership over time.' },
];

const costRows = [
  { item: 'Tuition',          tvet: 'R0–10k/year (NSFAS covered)',  uni: 'R30–80k/year' },
  { item: 'Living allowance', tvet: 'R3–4k/month via NSFAS',        uni: 'Self-funded or loan' },
  { item: 'Duration',         tvet: '2–3 years',                    uni: '4–6 years' },
  { item: 'Total cost',       tvet: 'R0–20k',                       uni: 'R120–320k' },
];

function TVETFundingPage({ onNavigate }: { onNavigate: (page: any) => void }) {
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
            Funding
          </h1>
          <p className="text-[15px] text-slate-500 leading-[1.65]">
            Most TVET programs cost very little or nothing. Here are your options.
          </p>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-16">

          {/* Funding options */}
          <section>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-5">Funding Options</p>

            <div className="space-y-3">
              {fundingOptions.map((option, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.06, ease: 'easeOut' }}
                  className={`border rounded-xl p-6 ${option.highlight ? 'border-emerald-200 bg-emerald-50/30' : 'border-slate-100'}`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3 flex-wrap">
                    <h3
                      className="text-[17px] font-black text-slate-900"
                      style={{ letterSpacing: '-0.016em' }}
                    >
                      {option.title}
                    </h3>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full shrink-0 ${option.tagCls}`}>
                      {option.tag}
                    </span>
                  </div>
                  <p className="text-[15px] text-slate-500 leading-[1.65] mb-4">{option.desc}</p>
                  <div className="space-y-2">
                    {option.facts.map((f, i) => (
                      <div key={i} className="flex items-center gap-2.5">
                        <CheckCircle
                          size={13}
                          className={option.highlight ? 'text-emerald-600 shrink-0' : 'text-slate-300 shrink-0'}
                        />
                        <span className="text-[12px] font-bold text-slate-600">{f}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* How to apply */}
          <section>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-5">How to Apply</p>

            <div className="divide-y divide-slate-100">
              {applySteps.map(({ title, desc }, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.04, ease: 'easeOut' }}
                  className="flex gap-6 py-5"
                >
                  <span className="text-[11px] font-black text-slate-300 mt-0.5 shrink-0 w-5 tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4
                      className="text-[14px] font-black text-slate-900 mb-1"
                      style={{ letterSpacing: '-0.014em' }}
                    >
                      {title}
                    </h4>
                    <p className="text-[15px] text-slate-500 leading-[1.65]">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Cost comparison */}
          <section>
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-5">Cost Comparison</p>

            <div className="border border-slate-100 rounded-xl overflow-hidden">
              <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-100">
                <div className="px-5 py-3.5">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">Item</p>
                </div>
                <div className="px-5 py-3.5 border-l border-slate-100">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-emerald-600">TVET (2–3 yr)</p>
                </div>
                <div className="px-5 py-3.5 border-l border-slate-100">
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">University (4+ yr)</p>
                </div>
              </div>

              {costRows.map((row, idx) => (
                <div
                  key={idx}
                  className={`grid grid-cols-3 border-b border-slate-100 last:border-b-0 ${idx % 2 === 1 ? 'bg-slate-50/50' : ''}`}
                >
                  <div className="px-5 py-4">
                    <p className="text-[12px] font-black text-slate-500">{row.item}</p>
                  </div>
                  <div className="px-5 py-4 border-l border-slate-100">
                    <p className="text-[14px] font-bold text-slate-900">{row.tvet}</p>
                  </div>
                  <div className="px-5 py-4 border-l border-slate-100">
                    <p className="text-[14px] text-slate-400">{row.uni}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest">
              Apply at nsfas.org.za before June each year
              <ArrowRight size={11} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default TVETFundingPage;
