import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

type Page = string;

export default function CTASection({ onNavigate }: { onNavigate: (page: Page) => void }) {
  return (
    <section className="py-28 bg-[#F5F0E8]">
      <div className="container mx-auto px-6 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="bg-slate-950 rounded-[3rem] p-12 md:p-24 text-center overflow-hidden relative"
        >
          <div className="relative z-10">
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[11px] font-black uppercase tracking-[0.25em] text-white/30 mb-6"
            >
              Free for every SA school
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight tracking-tight"
            >
              Ready to Lead?
            </motion.h2>
            <p className="text-white/50 text-[17px] leading-[1.7] mb-12 max-w-xl mx-auto">
              Join the network of South African schools transforming how students learn, track, and plan their futures.
            </p>
            <motion.button
              onClick={() => onNavigate('portal')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.15 }}
              className="inline-flex items-center gap-3 bg-white text-slate-900 px-10 py-4 rounded-full font-bold text-[15px] hover:bg-slate-100 transition-all shadow-2xl"
            >
              Go to Portal <ArrowRight className="w-4 h-4" />
            </motion.button>
            <p className="mt-8 text-[11px] font-bold text-white/20 uppercase tracking-[0.2em]">
              No hardware required · Fully cloud-based · Free for every school
            </p>
          </div>
          <motion.div
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
            className="absolute -top-24 -left-24 w-96 h-96 bg-slate-800 rounded-full blur-3xl opacity-30 pointer-events-none"
          />
          <motion.div
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
            className="absolute -bottom-24 -right-24 w-96 h-96 bg-slate-800 rounded-full blur-3xl opacity-20 pointer-events-none"
          />
        </motion.div>
      </div>
    </section>
  );
}
