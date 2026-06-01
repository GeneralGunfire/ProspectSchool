import { useEffect, useState } from 'react';
import {
  Users, GraduationCap, Megaphone, TrendingUp, BookOpen,
  Activity, ArrowUpRight, ArrowDownRight, Clock, Star,
  CheckCircle2, AlertCircle, Calendar, BarChart3,
} from 'lucide-react';
import { motion, type Variants } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../../components/ui/card';
import { fetchSchoolTeachers } from '../../../lib/teachers';
import { fetchAnnouncements } from '../../../lib/announcements';
import type { AdminSession } from '../../../lib/auth';
import { supabaseAdmin } from '../../../lib/supabase';

interface AdminHomePageProps {
  session: AdminSession;
  onNavigate: (page: string) => void;
}

interface Stats {
  teachers: number;
  activeTeachers: number;
  students: number;
  announcements: number;
  pinnedAnnouncements: number;
  recentLogins: number;
}

// Mock activity data — week-by-week engagement (would be real from DB in production)
const weeklyActivity = [
  { week: 'Wk 1', logins: 42, marks: 18 },
  { week: 'Wk 2', logins: 58, marks: 31 },
  { week: 'Wk 3', logins: 51, marks: 24 },
  { week: 'Wk 4', logins: 67, marks: 39 },
  { week: 'Wk 5', logins: 74, marks: 45 },
  { week: 'Wk 6', logins: 63, marks: 37 },
];

const gradeDistribution = [
  { grade: 'Gr 8',  students: 48 },
  { grade: 'Gr 9',  students: 52 },
  { grade: 'Gr 10', students: 61 },
  { grade: 'Gr 11', students: 57 },
  { grade: 'Gr 12', students: 44 },
];

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

const recentActivity = [
  { type: 'mark',         text: 'Marks uploaded for Maths Gr 10',   time: '12 min ago',  icon: BookOpen,    color: 'text-blue-500',   bg: 'bg-blue-50' },
  { type: 'announcement', text: 'New announcement: Sports Day',      time: '1 hr ago',    icon: Megaphone,   color: 'text-amber-500',  bg: 'bg-amber-50' },
  { type: 'teacher',      text: 'Mr Dlamini logged in',              time: '2 hrs ago',   icon: GraduationCap, color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { type: 'mark',         text: 'Science Gr 11 results captured',    time: '3 hrs ago',   icon: CheckCircle2, color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { type: 'alert',        text: '3 students without a class cohort', time: 'Yesterday',   icon: AlertCircle, color: 'text-red-500',    bg: 'bg-red-50' },
];

const container: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' as const } },
};

function StatCard({
  title, value, sub, icon: Icon, trend, trendLabel, accent,
}: {
  title: string; value: string | number; sub?: string;
  icon: any; trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string; accent: string;
}) {
  return (
    <motion.div variants={item}>
      <Card className="relative overflow-hidden border-0 shadow-sm bg-white h-full">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{value}</p>
              {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${accent}`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
          {trendLabel && (
            <div className="flex items-center gap-1 mt-3">
              {trend === 'up' && <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />}
              {trend === 'down' && <ArrowDownRight className="w-3.5 h-3.5 text-red-400" />}
              <span className={`text-xs font-semibold ${trend === 'up' ? 'text-emerald-500' : trend === 'down' ? 'text-red-400' : 'text-slate-400'}`}>
                {trendLabel}
              </span>
            </div>
          )}
        </CardContent>
        {/* subtle colour bar at bottom */}
        <div className={`absolute bottom-0 left-0 right-0 h-0.5 ${accent}`} />
      </Card>
    </motion.div>
  );
}

export default function AdminHomePage({ session, onNavigate }: AdminHomePageProps) {
  const [stats, setStats] = useState<Stats>({
    teachers: 0, activeTeachers: 0, students: 0,
    announcements: 0, pinnedAnnouncements: 0, recentLogins: 0,
  });
  const [loading, setLoading] = useState(true);
  const today = new Date().toLocaleDateString('en-ZA', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  useEffect(() => {
    if (!session.school_id) return;
    (async () => {
      try {
        const [teachers, announcements] = await Promise.all([
          fetchSchoolTeachers(session.school_id!),
          fetchAnnouncements(session.school_id!),
        ]);

        // Count students via supabaseAdmin count query
        const { count: studentCount } = await supabaseAdmin
          .from('students')
          .select('id', { count: 'exact', head: true })
          .eq('school_id', session.school_id);

        // Teachers who logged in in the last 7 days
        const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
        const recentLogins = teachers.filter(t => t.last_login_at && t.last_login_at > sevenDaysAgo).length;

        setStats({
          teachers: teachers.length,
          activeTeachers: teachers.filter(t => t.is_active).length,
          students: studentCount ?? 0,
          announcements: announcements.length,
          pinnedAnnouncements: announcements.filter(a => a.pinned).length,
          recentLogins,
        });
      } catch (_) {
        // silently fail — stats remain 0
      } finally {
        setLoading(false);
      }
    })();
  }, [session.school_id]);

  const statCards = [
    {
      title: 'Total Teachers',
      value: loading ? '—' : stats.teachers,
      sub: `${stats.activeTeachers} active`,
      icon: GraduationCap,
      trend: 'up' as const,
      trendLabel: `${stats.recentLogins} logged in this week`,
      accent: 'bg-blue-500',
    },
    {
      title: 'Total Students',
      value: loading ? '—' : stats.students,
      sub: 'across all grades',
      icon: Users,
      trend: 'up' as const,
      trendLabel: 'Enrolled this term',
      accent: 'bg-emerald-500',
    },
    {
      title: 'Announcements',
      value: loading ? '—' : stats.announcements,
      sub: `${stats.pinnedAnnouncements} pinned`,
      icon: Megaphone,
      trend: 'neutral' as const,
      trendLabel: 'School-wide broadcasts',
      accent: 'bg-amber-500',
    },
    {
      title: 'Platform Activity',
      value: loading ? '—' : `${stats.recentLogins}`,
      sub: 'teacher logins this week',
      icon: Activity,
      trend: stats.recentLogins > 0 ? 'up' as const : 'neutral' as const,
      trendLabel: 'Active educators',
      accent: 'bg-violet-500',
    },
  ];

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Dashboard</p>
        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-1">
          Good morning, {session.name} 👋
        </h1>
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Calendar className="w-3.5 h-3.5" />
          <span>{today}</span>
          <span className="mx-1">·</span>
          <span className="font-semibold text-slate-500">{session.school_name}</span>
        </div>
      </motion.div>

      {/* Stat cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
      >
        {statCards.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </motion.div>

      {/* Charts row */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8"
      >
        {/* Weekly activity bar chart */}
        <motion.div variants={item} className="lg:col-span-2">
          <Card className="border-0 shadow-sm bg-white h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold text-slate-800">Weekly Activity</CardTitle>
                  <CardDescription className="text-xs">Teacher logins &amp; marks captured</CardDescription>
                </div>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-slate-800 inline-block" />Logins</span>
                  <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm bg-blue-400 inline-block" />Marks</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={weeklyActivity} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="week" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontSize: 12 }}
                  />
                  <Bar dataKey="logins" fill="#1e293b" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="marks"  fill="#93c5fd" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        {/* Grade distribution pie */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm bg-white h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-800">Students by Grade</CardTitle>
              <CardDescription className="text-xs">Current enrolment breakdown</CardDescription>
            </CardHeader>
            <CardContent className="pb-4 flex flex-col items-center">
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={gradeDistribution}
                    dataKey="students"
                    nameKey="grade"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={3}
                  >
                    {gradeDistribution.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontSize: 12 }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full mt-1">
                {gradeDistribution.map((g, i) => (
                  <div key={g.grade} className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: PIE_COLORS[i] }} />
                    <span className="text-xs text-slate-500">{g.grade}</span>
                    <span className="text-xs font-bold text-slate-700 ml-auto">{g.students}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Bottom row */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {/* Recent activity feed */}
        <motion.div variants={item}>
          <Card className="border-0 shadow-sm bg-white h-full">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-800">Recent Activity</CardTitle>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Live feed
                </span>
              </div>
            </CardHeader>
            <CardContent className="pb-4 space-y-3">
              {recentActivity.map((act, i) => {
                const Icon = act.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${act.bg}`}>
                      <Icon className={`w-4 h-4 ${act.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-700 leading-tight">{act.text}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{act.time}</p>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick actions + school info */}
        <motion.div variants={item} className="flex flex-col gap-4">
          {/* School info card */}
          <Card className="border-0 shadow-sm bg-linear-to-br from-slate-900 to-slate-700 text-white">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Your School</p>
                  <h2 className="text-lg font-black tracking-tight">{session.school_name}</h2>
                </div>
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Star className="w-5 h-5 text-amber-300" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Teachers', value: loading ? '—' : stats.teachers },
                  { label: 'Students', value: loading ? '—' : stats.students },
                  { label: 'Announcements', value: loading ? '—' : stats.announcements },
                ].map((s) => (
                  <div key={s.label} className="bg-white/10 rounded-lg p-3 text-center">
                    <p className="text-xl font-black">{s.value}</p>
                    <p className="text-[10px] text-slate-300 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card className="border-0 shadow-sm bg-white flex-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-bold text-slate-800">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="pb-4 grid grid-cols-2 gap-2">
              {[
                { label: 'Add Teacher',      icon: GraduationCap, page: 'teachers',      accent: 'bg-blue-500' },
                { label: 'Announcement',     icon: Megaphone,     page: 'announcements', accent: 'bg-amber-500' },
                { label: 'View Reports',     icon: BarChart3,     page: 'home',          accent: 'bg-violet-500' },
                { label: 'Platform Health',  icon: TrendingUp,    page: 'home',          accent: 'bg-emerald-500' },
              ].map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.label}
                    onClick={() => onNavigate(action.page)}
                    className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors text-left group"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${action.accent}`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900">{action.label}</span>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  );
}
