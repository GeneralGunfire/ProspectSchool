import { motion } from 'motion/react';
import { ArrowUpRight, Wrench, Database, ArrowRight } from 'lucide-react';

type Page = string;

const riasecTypes = [
  { name: 'Realistic', desc: 'Practical, hands-on work with tools.' },
  { name: 'Investigative', desc: 'Analytical, scientific, and curious.' },
  { name: 'Artistic', desc: 'Creative, expressive, and original.' },
  { name: 'Social', desc: 'Helping, teaching, and curing others.' },
  { name: 'Enterprising', desc: 'Leading, persuading, and managing.' },
  { name: 'Conventional', desc: 'Orderly, structured, and detailed.' },
];

export default function CareerSection({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <section className="py-28 bg-[#FAF9F6]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">Career Guide</p>
            <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">Your Future is not a Guess.</h2>
            <p className="text-slate-500 text-[17px] leading-relaxed max-w-xl">
              We align your personality with the world's fastest-growing careers through psychology-driven insights.
            </p>
          </div>
          <button
            onClick={() => onNavigate('quiz')}
            className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest hover:text-slate-900 transition-colors whitespace-nowrap"
            aria-label="Take the RIASEC career quiz"
          >
            Take the Quiz <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* RIASEC Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 * 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-100 shadow-sm cursor-pointer"
            onClick={() => onNavigate('quiz')}
          >
            <h3 className="text-2xl sm:text-3xl font-black mb-4 tracking-tight">RIASEC Methodology</h3>
            <p className="text-slate-500 text-[15px] leading-relaxed mb-8 max-w-lg">
              Our assessment decodes your personality into 6 core types to find your perfect professional fit.
              400+ SA careers matched.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {riasecTypes.map((type, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ y: -2, backgroundColor: '#fff' }}
                  className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100"
                >
                  <h4 className="font-bold text-slate-800 text-[14px] sm:text-[15px] mb-1">{type.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{type.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-2 text-sm font-bold text-slate-400">
              Start the quiz <ArrowRight className="w-4 h-4" />
            </div>
          </motion.div>

          {/* TVET Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1 * 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="bg-slate-950 text-white rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden flex flex-col justify-between cursor-pointer min-h-[320px]"
            onClick={() => onNavigate('tvet')}
          >
            <div className="relative z-10">
              <Wrench className="w-10 h-10 text-slate-100/20 mb-6" aria-hidden="true" />
              <h3 className="text-2xl sm:text-3xl font-black mb-4 tracking-tight">TVET & Trade</h3>
              <p className="text-slate-400 text-[15px] leading-relaxed mb-8">
                Prospect bridges the gap to 26 technical colleges, providing direct pathways for vocational excellence
                in plumbing, electrical engineering, coding, and more.
              </p>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                Explore TVET <ArrowRight className="w-4 h-4" />
              </div>
            </div>
            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-slate-800/20 rounded-full blur-3xl pointer-events-none" />
          </motion.div>

          {/* Bursaries row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 2 * 0.1 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
            className="lg:col-span-3 bg-slate-100 rounded-[2.5rem] p-8 md:p-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 cursor-pointer"
            onClick={() => onNavigate('bursaries')}
          >
            <div>
              <h3 className="text-2xl sm:text-3xl font-black mb-3 tracking-tight">245+ Bursaries. Free to Access.</h3>
              <p className="text-slate-500 text-[15px] leading-relaxed max-w-lg">
                Search by field, province, and eligibility. Matched to your career quiz results. No middleman.
              </p>
            </div>
            <div className="flex gap-3 flex-wrap shrink-0">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest px-5 py-3 bg-white rounded-full border border-slate-200">
                <Database className="w-4 h-4" aria-hidden="true" /> 245+ Bursaries
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500 uppercase tracking-widest px-5 py-3 bg-white rounded-full border border-slate-200">
                <Database className="w-4 h-4" aria-hidden="true" /> 9 Provinces
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
