import { motion } from 'motion/react';
import { Eye, ShieldCheck } from 'lucide-react';

const featureItems = [
  {
    icon: <Eye className="w-5 h-5" />,
    title: 'Real-time Performance Visibility',
    desc: 'Instant feedback loops for students, parents, and teachers.',
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    title: 'Unfalsifiable Records',
    desc: 'Secure, cloud-based storage that builds a credible academic history.',
  },
];

export default function ProblemSection() {
  return (
    <section className="py-28 bg-[#FAF9F6]">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-8"
          >
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400">The Problem</p>
            <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Ending the <span className="text-slate-400">Paper-Based</span>{' '}
              Bottleneck.
            </h2>
            <p className="text-slate-500 text-[17px] leading-[1.7] max-w-xl">
              In South Africa, 85% of under-resourced schools still lack any form of digital mark
              management. This leads to massive administrative lag, lost data, and ultimately, a
              lack of transparency that hinders student career placement.
            </p>
            <p className="text-slate-500 text-[17px] leading-[1.7] max-w-xl">
              When records are static, students become invisible. Prospect digitizes the entire
              academic journey, ensuring no learner is left behind due to clerical inefficiency
              or lost files.
            </p>
            <div className="space-y-5 pt-2">
              {featureItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-[15px] mb-1">{item.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.3 }}
              className="rounded-[2.5rem] overflow-hidden shadow-2xl"
            >
              <img
                src="/images/paper_bottleneck_1779608869442.png"
                alt="Paper-based bottleneck in SA schools"
                className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700"
              />
            </motion.div>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              animate={{ y: [0, -6, 0] }}
              transition={{
                opacity: { delay: 0.5 },
                y: { repeat: Infinity, duration: 3, ease: 'easeInOut' },
              }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-xl border border-slate-100 max-w-45 sm:max-w-55"
            >
              <div className="text-4xl font-black text-slate-900 mb-1">+82%</div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-tight">
                Increase in administrative efficiency
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
