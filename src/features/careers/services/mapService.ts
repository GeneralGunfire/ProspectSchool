// Map service — helper functions for filtering and formatting map data
import {
  UNIVERSITIES,
  TVET_COLLEGES,
  INDUSTRY_BREAKDOWN,
  TOP_EMPLOYERS,
  COST_OF_LIVING,
  PROVINCE_JOB_DEMAND,
  type UniversityLocation,
  type TVETCollegeLocation,
  type IndustryBreakdown,
  type TopEmployer,
  type CostOfLiving,
} from '../data/mapData';
import { allCareersComplete } from '../data/careers400Final';
import { bursaries as BURSARIES } from '../data/bursaries';

// ── Universities & TVET ────────────────────────────────────────────────────

export function getUniversitiesByProvince(province: string): UniversityLocation[] {
  if (!province) return [];
  return UNIVERSITIES.filter((u) => u.province === province);
}

export function getTVETCollegesByProvince(province: string): TVETCollegeLocation[] {
  if (!province) return [];
  return TVET_COLLEGES.filter((c) => c.province === province);
}

export function createUniversityMarkers(universities: UniversityLocation[]) {
  return universities.map((u) => ({
    id: `uni-${u.name}`,
    lat: u.lat,
    lng: u.lng,
    type: 'university' as const,
    title: u.name,
    city: u.city,
    province: u.province,
  }));
}

export function createTVETMarkers(colleges: TVETCollegeLocation[]) {
  return colleges.map((c) => ({
    id: `tvet-${c.name}`,
    lat: c.lat,
    lng: c.lng,
    type: 'tvet' as const,
    title: c.name,
    city: c.city,
    province: c.province,
  }));
}

// ── Counts ─────────────────────────────────────────────────────────────────

export function countCareersInProvince(province: string): number {
  if (!province) return allCareersComplete.length;
  // Map province to demand level to give a meaningful count estimate
  const demand = PROVINCE_JOB_DEMAND.find((p) => p.province === province);
  if (!demand) return 50;
  return demand.level === 'high' ? 200 : demand.level === 'medium' ? 120 : 60;
}

export function countCollegesInProvince(province: string): number {
  const unis = getUniversitiesByProvince(province).length;
  const tvet = getTVETCollegesByProvince(province).length;
  return unis + tvet;
}

// ── Salary ─────────────────────────────────────────────────────────────────

export function getAverageSalaryByProvince(province: string): number {
  const salaryMap: Record<string, number> = {
    Gauteng: 45000,
    'Western Cape': 42000,
    'KwaZulu-Natal': 35000,
    'Eastern Cape': 32000,
    Limpopo: 28000,
    Mpumalanga: 30000,
    'North West': 31000,
    'Free State': 29000,
    'Northern Cape': 33000,
  };
  return salaryMap[province] ?? 32000;
}

// ── Industry breakdown ─────────────────────────────────────────────────────

export function getIndustryBreakdown(province: string): IndustryBreakdown | null {
  return INDUSTRY_BREAKDOWN.find((i) => i.province === province) ?? null;
}

// ── Employers ──────────────────────────────────────────────────────────────

export function getTopEmployersByProvince(province: string): TopEmployer[] {
  if (!province) return [];
  return TOP_EMPLOYERS.filter((e) => e.province === province);
}

// ── High-demand careers ────────────────────────────────────────────────────

export function getHighDemandCareers(province: string) {
  // Return careers with high demand — province filter is aspirational for now
  return allCareersComplete.filter((c) => (c as any).demandLevel === 'high').slice(0, 10);
}

// ── Cost of living ─────────────────────────────────────────────────────────

export function getCostOfLivingByCity(city: string): CostOfLiving | null {
  return COST_OF_LIVING.find((c) => c.city.toLowerCase() === city.toLowerCase()) ?? null;
}

// ── Bursaries ──────────────────────────────────────────────────────────────

export function getBursariesByProvince(province: string) {
  if (!province) return BURSARIES;
  // Bursaries are national — return all; filter by province field if it exists
  return BURSARIES.filter((b: any) =>
    !b.province || b.province === province || b.province === 'National'
  );
}
