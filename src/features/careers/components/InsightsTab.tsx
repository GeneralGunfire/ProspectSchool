import { motion } from 'motion/react';
import { Briefcase, Building2, Banknote, TrendingUp, Wallet, BarChart2, GraduationCap, Lightbulb } from 'lucide-react';
import type { ReactNode } from 'react';
import {
  getIndustryBreakdown,
  getTopEmployersByProvince,
  countCareersInProvince,
  countCollegesInProvince,
  getAverageSalaryByProvince,
  getHighDemandCareers,
  getCostOfLivingByCity,
  getBursariesByProvince,
} from '../services/mapService';

interface InsightsTabProps {
  province: string;
  city?: string;
}

function StatCard({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="border border-slate-100 rounded-lg p-4">
      <div className="text-slate-400 mb-2">{icon}</div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-[18px] font-black text-slate-900 mt-1" style={{ letterSpacing: '-0.018em' }}>{value}</p>
    </div>
  );
}

function SectionHeader({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-slate-400">{icon}</span>
      <h3 className="text-[13px] font-black uppercase tracking-widest text-slate-500">{label}</h3>
    </div>
  );
}

export default function InsightsTab({ province, city }: InsightsTabProps) {
  const careerCount      = countCareersInProvince(province);
  const collegeCount     = countCollegesInProvince(province);
  const topDemandCareers = getHighDemandCareers(province).slice(0, 4);
  const avgSalary        = getAverageSalaryByProvince(province);
  const industryBreakdown = getIndustryBreakdown(province);
  const topEmployers     = getTopEmployersByProvince(province);
  const bursaries        = getBursariesByProvince(province);
  const costOfLiving     = city ? getCostOfLivingByCity(city) : null;

  return (
    <div className="space-y-8">

      {/* ── Job Market summary ── */}
      <section>
        <SectionHeader icon={<BarChart2 size={14} />} label="Job Market" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard icon={<Briefcase size={18} />} label="Careers"    value={`${careerCount}+`} />
          <StatCard icon={<Building2 size={18} />} label="Colleges"   value={`${collegeCount}`} />
          <StatCard icon={<Banknote  size={18} />} label="Avg Salary" value={`R${(avgSalary / 1000).toFixed(0)}k`} />
          <StatCard icon={<TrendingUp size={18} />} label="Hot Roles" value={`${topDemandCareers.length}`} />
        </div>

        {topDemandCareers.length > 0 && (
          <div className="mt-4 border border-slate-100 rounded-lg overflow-hidden">
            <div className="px-4 py-2.5 border-b border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fastest growing</p>
            </div>
            <div className="divide-y divide-slate-100">
              {topDemandCareers.map((career) => (
                <div key={career.id} className="flex items-center justify-between px-4 py-3">
                  <span className="text-[13px] font-bold text-slate-900">{career.title}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center gap-1">
                    <TrendingUp size={10} />
                    High demand
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Cost of Living ── */}
      {costOfLiving && (
        <section>
          <SectionHeader icon={<Wallet size={14} />} label={`Cost of Living — ${city}`} />
          <div className="space-y-2">
            {[
              { label: 'Housing',   value: costOfLiving.rent,      max: 10000 },
              { label: 'Transport', value: costOfLiving.transport,  max: 2000 },
              { label: 'Food',      value: costOfLiving.food,       max: 5000 },
            ].map((item) => {
              const displayVal = Array.isArray(item.value)
                ? `R${item.value[0]}–R${item.value[1]}`
                : `R${item.value}`;
              const barPct = Math.min(
                100,
                ((Array.isArray(item.value) ? item.value[1] : item.value) / item.max) * 100
              );
              return (
                <div key={item.label} className="border border-slate-100 rounded-lg px-4 py-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-bold text-slate-700">{item.label}</span>
                    <span className="text-[13px] font-black text-slate-900">{displayVal}</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barPct}%` }}
                      transition={{ duration: 0.5 }}
                      className="bg-slate-400 h-1.5 rounded-full"
                    />
                  </div>
                </div>
              );
            })}

            <div className="bg-slate-900 text-white rounded-lg px-4 py-3 flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly total</p>
              <p className="text-[17px] font-black" style={{ letterSpacing: '-0.018em' }}>
                R{costOfLiving.monthly_total[0]}–R{costOfLiving.monthly_total[1]}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* ── Industry Breakdown ── */}
      {industryBreakdown && (
        <section>
          <SectionHeader icon={<BarChart2 size={14} />} label="Industry Breakdown" />
          <div className="space-y-2">
            {industryBreakdown.industries.map((industry) => (
              <div key={industry.name} className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold text-slate-700">{industry.name}</span>
                  <span className="text-[11px] font-black text-slate-500">{industry.percentage}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${industry.percentage}%` }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="bg-slate-700 h-1.5 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Education ── */}
      <section>
        <SectionHeader icon={<GraduationCap size={14} />} label="Education" />
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon={<Building2 size={18} />} label="Universities" value={collegeCount.toString()} />
          <StatCard icon={<Lightbulb  size={18} />} label="Bursaries"   value={`${bursaries.length}`} />
        </div>
      </section>

      {/* ── Top Employers ── */}
      {topEmployers.length > 0 && (
        <section>
          <SectionHeader icon={<Building2 size={14} />} label="Top Employers" />
          <div className="divide-y divide-slate-100 border border-slate-100 rounded-lg overflow-hidden">
            {topEmployers.slice(0, 5).map((employer) => (
              <div key={employer.name} className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-[13px] font-black text-slate-900">{employer.name}</p>
                  <p className="text-[11px] text-slate-400">{employer.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-bold text-slate-900">{employer.openRoles}+ roles</p>
                  <p className="text-[11px] text-slate-400">{employer.industry}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
