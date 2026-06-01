import { FadeIn } from './Animations';
import { GraduationCap, BookOpen, Building2 } from './icons';

export const AudienceSection = ({ onNavigate }: { onNavigate: (p: string) => void }) => {
  return (
    <section className="bg-brand-bg py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <FadeIn className="text-center mb-16">
          <span className="eyebrow">WHO IT'S FOR</span>
          <h2 className="text-brand-dark text-[clamp(2.2rem,4vw,3rem)] tracking-tight mt-4 leading-[1.2]">
            Built for everyone in the classroom.
          </h2>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {/* CARD 1 — Students */}
          <FadeIn delay={0.1} className="group h-full">
            <div className="bg-brand-dark rounded-[32px] p-10 md:p-12 h-full flex flex-col transition-all duration-300 hover:shadow-xl shadow-brand-dark/10">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center">
                <GraduationCap className="text-white w-9 h-9" />
              </div>
              <span className="text-stone-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-10">FOR STUDENTS</span>
              <h3 className="text-white text-2xl font-bold mt-4 leading-tight">Your future, mapped out.</h3>
              <p className="text-stone-400 text-[15px] leading-relaxed mt-4 font-medium">
                Take the RIASEC career quiz, explore 400+ SA careers with real salary data, find bursaries, study for matric, and track your progress — all free.
              </p>
              <ul className="mt-8 space-y-4 mb-10">
                {["Career Quiz & Matching", "Study Library — 35 topics", "Bursary Finder", "My Future Dashboard", "APS Calculator"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-[14px] text-white/70 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="mt-auto bg-white text-brand-dark rounded-xl py-4 font-bold text-[15px] transition-all hover:scale-[1.02] cursor-pointer">
                Start Learning
              </button>
            </div>
          </FadeIn>

          {/* CARD 2 — Teachers */}
          <FadeIn delay={0.2} className="group h-full">
            <div className="bg-white border border-brand-border rounded-[32px] p-10 md:p-12 h-full flex flex-col transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 bg-brand-dark rounded-2xl flex items-center justify-center">
                <BookOpen className="text-white w-9 h-9" />
              </div>
              <span className="text-brand-eyebrow text-[10px] font-bold uppercase tracking-[0.2em] mt-10">FOR TEACHERS</span>
              <h3 className="text-brand-dark text-2xl font-bold mt-4 leading-tight">Everything you need to teach.</h3>
              <p className="text-brand-eyebrow text-[15px] leading-relaxed mt-4 font-medium">
                Manage your classes, track every student's study progress, record marks, upload resources, post announcements, and manage homework — from one dashboard.
              </p>
              <ul className="mt-8 space-y-4 mb-10">
                {["Student Progress Tracking", "Mark Sheets & Grades", "Resource Uploads", "Class Calendar", "Past Papers"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-[14px] text-brand-eyebrow font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-dark/10 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="mt-auto bg-brand-dark text-white rounded-xl py-4 font-bold text-[15px] transition-all hover:scale-[1.02] cursor-pointer">
                Teacher Portal
              </button>
            </div>
          </FadeIn>

          {/* CARD 3 — Schools */}
          <FadeIn delay={0.3} className="group h-full">
            <div className="bg-white border border-brand-border rounded-[32px] p-10 md:p-12 h-full flex flex-col transition-all duration-300 hover:shadow-lg">
              <div className="w-14 h-14 bg-brand-dark rounded-2xl flex items-center justify-center">
                <Building2 className="text-white w-9 h-9" />
              </div>
              <span className="text-brand-eyebrow text-[10px] font-bold uppercase tracking-[0.2em] mt-10">FOR SCHOOLS</span>
              <h3 className="text-brand-dark text-2xl font-bold mt-4 leading-tight">One platform. Zero cost.</h3>
              <p className="text-brand-eyebrow text-[15px] leading-relaxed mt-4 font-medium">
                Give your entire school access to Prospect — student dashboards, teacher tools, admin controls, and school-wide announcements. No subscription, no catch.
              </p>
              <ul className="mt-8 space-y-4 mb-10">
                {["Admin Dashboard", "School Announcements", "Teacher Management", "Student Accounts", "Completely Free"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-[14px] text-brand-eyebrow font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-brand-dark/10 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <button className="mt-auto bg-brand-dark text-white rounded-xl py-4 font-bold text-[15px] transition-all hover:scale-[1.02] cursor-pointer">
                Set Up Your School
              </button>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
};
