// Map service — helper functions for filtering and formatting map data
import {
  UNIVERSITIES,
  TVET_COLLEGES,
  type UniversityLocation,
  type TVETCollegeLocation,
} from '../data/mapData';

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
