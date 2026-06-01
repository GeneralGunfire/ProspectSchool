import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Users, Layout, BarChart2, BookOpen, Award, ArrowRight, Loader } from 'lucide-react';

type Page = string;

const roles = [
  {
    id: 'student',
    name: 'Student',
    label: 'Learner Experience',
    title: 'See Your Path Clearly.',
    desc: 'Students get a live view of their marks per subject, per term. Track averages, spot weaknesses, access past papers, and get career recommendations matched to your actual performance.',
    features: [
      { icon: <BarChart2 className="w-4 h-4" />, text: 'Live marks & averages per subject' },
      { icon: <Target className="w-4 h-4" />, text: 'Personalised career path recommendations' },
      { icon: <BookOpen className="w-4 h-4" />, text: 'Past papers & exam prep tools' },
    ],
    image: '/images/gamified_tablet_1779608887104.png',
    ctaLabel: 'Student Login',
  },
  {
    id: 'teacher',
    name: 'Teacher',
    label: 'Educator Tools',
    title: 'Teach. Track. Intervene.',
    desc: 'Enter and manage marks for your classes. Instantly see which students are at risk (below 40%), track class averages by subject, and assign past papers or career quizzes directly.',
    features: [
      { icon: <Users className="w-4 h-4" />, text: 'At-risk student alerts (below 40%)' },
      { icon: <Layout className="w-4 h-4" />, text: 'Class performance & subject analytics' },
      { icon: <Award className="w-4 h-4" />, text: 'Assign past papers & quizzes' },
    ],
    image: '/images/gamified_tablet_1779608887104.png',
    ctaLabel: 'Teacher Login',
  },
  {
    id: 'admin',
    name: 'School Admin',
    label: 'Governance Hub',
    title: 'Total School Oversight.',
    desc: 'Principals get a unified view of the entire school — all cohorts, all teachers, all performance trends. Manage teacher accounts, review analytics, and ensure no learner falls through the cracks.',
    features: [
      { icon: <Target className="w-4 h-4" />, text: 'School-wide cohort performance analytics' },
      { icon: <Users className="w-4 h-4" />, text: 'Teacher & cohort management' },
      { icon: <Layout className="w-4 h-4" />, text: 'Verified EMIS school identity' },
    ],
    image: '/images/gamified_tablet_1779608887104.png',
    ctaLabel: 'Admin Login',
  },
];

export default function Perspectives({ onNavigate }: { onNavigate: (page: Page) => void }) {
  const [activeTab, setActiveTab] = useState('student');
  const [loading, setLoading] = useState<string | null>(null);
  const currentRole = roles.find(r => r.id === activeTab)!;

  const handleRoleSelect = async (roleId: string) => {
    setLoading(roleId);
    // Simulate auth initiation
    setTimeout(() => {
      setLoading(null);
      // Future: Integrate real Supabase auth flow here
    }, 500);
  };

  return (
    <section className="py-28 bg-white border-y border-slate-100">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="text-center mb-16">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-400 mb-4">School Portal</p>
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">One Platform. Every Role.</h2>
          <p className="text-slate-500 text-[17px] leading-relaxed max-w-xl mx-auto">
            Four role-specific dashboards. One school. Everything connected.
          </p>
        </div>

        <div className="flex justify-center mb-12">
          <div className="bg-slate-50 p-1 rounded-full border border-slate-200 flex gap-1">
            {roles.map(role => (
              <button
                key={role.id}
                onClick={() => setActiveTab(role.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  activeTab === role.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {role.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#F5F0E8] rounded-4xl p-8 md:p-16 border border-slate-100 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center"
            >
              <div className="space-y-8">
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-white border border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-5">
                    {currentRole.label}
                  </span>
                  <h3 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">{currentRole.title}</h3>
                </div>
                <p className="text-slate-500 text-[17px] leading-[1.7]">{currentRole.desc}</p>
                <div className="space-y-4">
                  {currentRole.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                      <div className="text-slate-400">{f.icon}</div>
                      <span className="text-[15px]">{f.text}</span>
                    </div>
                  ))}
                </div>
                <motion.button
                  onClick={() => handleRoleSelect(activeTab)}
                  disabled={loading !== null}
                  className="inline-flex items-center gap-2 bg-slate-900 text-white text-[11px] font-black uppercase tracking-[0.15em] px-6 py-3.5 rounded-full hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
                  aria-label={`${currentRole.ctaLabel} — access the ${currentRole.name.toLowerCase()} dashboard`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading === activeTab ? (
                    <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                      <Loader className="w-3.5 h-3.5" />
                    </motion.div>
                  ) : (
                    <>
                      {currentRole.ctaLabel} <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </motion.button>
              </div>

              <div className="relative">
                <motion.div
                  whileHover={{ scale: 1.02, rotate: 0.5 }}
                  transition={{ duration: 0.3 }}
                  className="rounded-4xl overflow-hidden shadow-2xl"
                >
                  <img
                    src={currentRole.image}
                    alt={`${currentRole.name} dashboard preview`}
                    className="w-full h-auto"
                  />
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
