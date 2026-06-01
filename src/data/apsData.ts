// ── APS Data: South African University Degree Requirements ────────────────────
// APS = Admission Point Score (NQF levels summed, Life Orientation capped at 1)
// NQF conversion: 80-100 → 7, 70-79 → 6, 60-69 → 5, 50-59 → 4, 40-49 → 3, 30-39 → 2, 0-29 → 1
// Sources: SAQA, individual university prospectuses

export type SubjectCode =
  | 'english' | 'afrikaans' | 'zulu' | 'xhosa' | 'sotho' | 'home-language' | 'first-additional-language'
  | 'mathematics' | 'mathematical-literacy' | 'technical-mathematics'
  | 'physical-sciences' | 'life-sciences' | 'geography' | 'history'
  | 'accounting' | 'business-studies' | 'economics'
  | 'computer-applications-technology' | 'information-technology'
  | 'engineering-graphics-design' | 'technical-sciences'
  | 'agricultural-sciences' | 'consumer-studies' | 'hospitality-studies' | 'tourism'
  | 'dramatic-arts' | 'music' | 'visual-arts'
  | 'life-orientation';

export const NSC_SUBJECTS: { value: SubjectCode; label: string; group: string }[] = [
  // Languages
  { value: 'english',                    label: 'English Home Language',              group: 'Languages' },
  { value: 'afrikaans',                  label: 'Afrikaans Home Language',            group: 'Languages' },
  { value: 'zulu',                       label: 'isiZulu Home Language',              group: 'Languages' },
  { value: 'xhosa',                      label: 'isiXhosa Home Language',             group: 'Languages' },
  { value: 'sotho',                      label: 'Sesotho Home Language',              group: 'Languages' },
  { value: 'home-language',             label: 'Other Home Language',                group: 'Languages' },
  { value: 'first-additional-language', label: 'First Additional Language',          group: 'Languages' },
  // Mathematics
  { value: 'mathematics',               label: 'Mathematics',                        group: 'Mathematics' },
  { value: 'mathematical-literacy',     label: 'Mathematical Literacy',              group: 'Mathematics' },
  { value: 'technical-mathematics',     label: 'Technical Mathematics',              group: 'Mathematics' },
  // Sciences
  { value: 'physical-sciences',         label: 'Physical Sciences',                  group: 'Sciences' },
  { value: 'life-sciences',             label: 'Life Sciences',                      group: 'Sciences' },
  { value: 'technical-sciences',        label: 'Technical Sciences',                 group: 'Sciences' },
  // Social Sciences & Commerce
  { value: 'geography',                 label: 'Geography',                          group: 'Social Sciences' },
  { value: 'history',                   label: 'History',                            group: 'Social Sciences' },
  { value: 'accounting',                label: 'Accounting',                         group: 'Commerce' },
  { value: 'business-studies',          label: 'Business Studies',                   group: 'Commerce' },
  { value: 'economics',                 label: 'Economics',                          group: 'Commerce' },
  // Technology
  { value: 'computer-applications-technology', label: 'Computer Applications Technology', group: 'Technology' },
  { value: 'information-technology',    label: 'Information Technology',             group: 'Technology' },
  { value: 'engineering-graphics-design', label: 'Engineering Graphics & Design',   group: 'Technology' },
  // Other
  { value: 'agricultural-sciences',     label: 'Agricultural Sciences',              group: 'Other' },
  { value: 'consumer-studies',          label: 'Consumer Studies',                   group: 'Other' },
  { value: 'hospitality-studies',       label: 'Hospitality Studies',                group: 'Other' },
  { value: 'tourism',                   label: 'Tourism',                            group: 'Other' },
  { value: 'dramatic-arts',             label: 'Dramatic Arts',                      group: 'Arts' },
  { value: 'music',                     label: 'Music',                              group: 'Arts' },
  { value: 'visual-arts',               label: 'Visual Arts',                        group: 'Arts' },
  { value: 'life-orientation',          label: 'Life Orientation',                   group: 'Compulsory' },
];

export function percentToNQF(percent: number): number {
  if (percent >= 80) return 7;
  if (percent >= 70) return 6;
  if (percent >= 60) return 5;
  if (percent >= 50) return 4;
  if (percent >= 40) return 3;
  if (percent >= 30) return 2;
  return 1;
}

export interface StudentSubject {
  code: SubjectCode;
  percent: number;
}

export function calculateAPS(subjects: StudentSubject[]): number {
  return subjects.reduce((sum, s) => {
    const level = percentToNQF(s.percent);
    // Life Orientation is capped at a maximum of 1 APS point at most universities
    const capped = s.code === 'life-orientation' ? Math.min(level, 1) : level;
    return sum + capped;
  }, 0);
}

// ── Degree requirement types ──────────────────────────────────────────────────

export type FieldOfStudy =
  | 'Engineering & Built Environment'
  | 'Health Sciences'
  | 'Commerce & Management'
  | 'Humanities & Social Sciences'
  | 'Natural Sciences'
  | 'Education'
  | 'Law'
  | 'Information Technology'
  | 'Agriculture & Environmental Sciences'
  | 'Arts & Design';

export interface SubjectRequirement {
  subject: SubjectCode;
  minLevel: number; // NQF level (1–7)
  label: string;    // human-readable label
}

export interface DegreeEntry {
  id: string;
  university: string;
  shortName: string;   // e.g. "UCT", "UP"
  faculty: string;
  degree: string;
  field: FieldOfStudy;
  minAPS: number;
  subjectRequirements: SubjectRequirement[];
  duration: string;    // e.g. "4 years"
  notes?: string;
}

// ── University degree data ────────────────────────────────────────────────────

export const DEGREE_DATA: DegreeEntry[] = [

  // ── ENGINEERING ──────────────────────────────────────────────────────────────
  {
    id: 'uct-bsc-eng-civil',
    university: 'University of Cape Town',
    shortName: 'UCT',
    faculty: 'Engineering & the Built Environment',
    degree: 'BSc Engineering (Civil)',
    field: 'Engineering & Built Environment',
    minAPS: 42,
    duration: '4 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 6, label: 'Mathematics (70%+)' },
      { subject: 'physical-sciences', minLevel: 6, label: 'Physical Sciences (70%+)' },
      { subject: 'english', minLevel: 5, label: 'English (60%+)' },
    ],
  },
  {
    id: 'uct-bsc-eng-electrical',
    university: 'University of Cape Town',
    shortName: 'UCT',
    faculty: 'Engineering & the Built Environment',
    degree: 'BSc Engineering (Electrical)',
    field: 'Engineering & Built Environment',
    minAPS: 44,
    duration: '4 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 7, label: 'Mathematics (80%+)' },
      { subject: 'physical-sciences', minLevel: 6, label: 'Physical Sciences (70%+)' },
      { subject: 'english', minLevel: 5, label: 'English (60%+)' },
    ],
  },
  {
    id: 'wits-bsc-eng-mechanical',
    university: 'University of the Witwatersrand',
    shortName: 'Wits',
    faculty: 'Engineering & the Built Environment',
    degree: 'BSc Engineering (Mechanical)',
    field: 'Engineering & Built Environment',
    minAPS: 42,
    duration: '4 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 6, label: 'Mathematics (70%+)' },
      { subject: 'physical-sciences', minLevel: 6, label: 'Physical Sciences (70%+)' },
      { subject: 'english', minLevel: 5, label: 'English (60%+)' },
    ],
  },
  {
    id: 'up-beng-civil',
    university: 'University of Pretoria',
    shortName: 'UP',
    faculty: 'Engineering, Built Environment & IT',
    degree: 'BEng (Civil)',
    field: 'Engineering & Built Environment',
    minAPS: 32,
    duration: '4 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 6, label: 'Mathematics (70%+)' },
      { subject: 'physical-sciences', minLevel: 5, label: 'Physical Sciences (60%+)' },
      { subject: 'english', minLevel: 4, label: 'English (50%+)' },
    ],
  },
  {
    id: 'up-beng-electrical',
    university: 'University of Pretoria',
    shortName: 'UP',
    faculty: 'Engineering, Built Environment & IT',
    degree: 'BEng (Electrical)',
    field: 'Engineering & Built Environment',
    minAPS: 34,
    duration: '4 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 7, label: 'Mathematics (80%+)' },
      { subject: 'physical-sciences', minLevel: 6, label: 'Physical Sciences (70%+)' },
      { subject: 'english', minLevel: 4, label: 'English (50%+)' },
    ],
  },
  {
    id: 'stellenbosch-beng-mechanical',
    university: 'Stellenbosch University',
    shortName: 'SU',
    faculty: 'Engineering',
    degree: 'BEng (Mechanical)',
    field: 'Engineering & Built Environment',
    minAPS: 36,
    duration: '4 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 6, label: 'Mathematics (70%+)' },
      { subject: 'physical-sciences', minLevel: 6, label: 'Physical Sciences (70%+)' },
    ],
  },
  {
    id: 'dut-beng-tech-civil',
    university: 'Durban University of Technology',
    shortName: 'DUT',
    faculty: 'Engineering & the Built Environment',
    degree: 'BEng Technology (Civil)',
    field: 'Engineering & Built Environment',
    minAPS: 22,
    duration: '3 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 4, label: 'Mathematics (50%+)' },
      { subject: 'physical-sciences', minLevel: 4, label: 'Physical Sciences (50%+)' },
    ],
  },
  {
    id: 'tut-beng-tech-electrical',
    university: 'Tshwane University of Technology',
    shortName: 'TUT',
    faculty: 'Engineering & the Built Environment',
    degree: 'BEng Technology (Electrical)',
    field: 'Engineering & Built Environment',
    minAPS: 20,
    duration: '3 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 4, label: 'Mathematics (50%+)' },
      { subject: 'physical-sciences', minLevel: 4, label: 'Physical Sciences (50%+)' },
    ],
  },

  // ── HEALTH SCIENCES ──────────────────────────────────────────────────────────
  {
    id: 'uct-mbchb',
    university: 'University of Cape Town',
    shortName: 'UCT',
    faculty: 'Health Sciences',
    degree: 'MBChB (Medicine)',
    field: 'Health Sciences',
    minAPS: 45,
    duration: '6 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 6, label: 'Mathematics (70%+)' },
      { subject: 'physical-sciences', minLevel: 6, label: 'Physical Sciences (70%+)' },
      { subject: 'life-sciences', minLevel: 6, label: 'Life Sciences (70%+)' },
      { subject: 'english', minLevel: 6, label: 'English (70%+)' },
    ],
  },
  {
    id: 'wits-mbchb',
    university: 'University of the Witwatersrand',
    shortName: 'Wits',
    faculty: 'Health Sciences',
    degree: 'MBBCh (Medicine)',
    field: 'Health Sciences',
    minAPS: 44,
    duration: '6 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 6, label: 'Mathematics (70%+)' },
      { subject: 'physical-sciences', minLevel: 6, label: 'Physical Sciences (70%+)' },
      { subject: 'life-sciences', minLevel: 6, label: 'Life Sciences (70%+)' },
      { subject: 'english', minLevel: 5, label: 'English (60%+)' },
    ],
  },
  {
    id: 'up-mbchb',
    university: 'University of Pretoria',
    shortName: 'UP',
    faculty: 'Health Sciences',
    degree: 'MBChB (Medicine)',
    field: 'Health Sciences',
    minAPS: 34,
    duration: '6 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 6, label: 'Mathematics (70%+)' },
      { subject: 'physical-sciences', minLevel: 6, label: 'Physical Sciences (70%+)' },
      { subject: 'life-sciences', minLevel: 6, label: 'Life Sciences (70%+)' },
    ],
  },
  {
    id: 'up-bpharm',
    university: 'University of Pretoria',
    shortName: 'UP',
    faculty: 'Health Sciences',
    degree: 'BPharm (Pharmacy)',
    field: 'Health Sciences',
    minAPS: 30,
    duration: '4 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 5, label: 'Mathematics (60%+)' },
      { subject: 'physical-sciences', minLevel: 5, label: 'Physical Sciences (60%+)' },
      { subject: 'life-sciences', minLevel: 5, label: 'Life Sciences (60%+)' },
    ],
  },
  {
    id: 'uct-bnursing',
    university: 'University of Cape Town',
    shortName: 'UCT',
    faculty: 'Health Sciences',
    degree: 'BCur (Nursing)',
    field: 'Health Sciences',
    minAPS: 32,
    duration: '4 years',
    subjectRequirements: [
      { subject: 'life-sciences', minLevel: 5, label: 'Life Sciences (60%+)' },
      { subject: 'english', minLevel: 5, label: 'English (60%+)' },
      { subject: 'mathematics', minLevel: 4, label: 'Mathematics (50%+)' },
    ],
  },
  {
    id: 'ukzn-bphysio',
    university: 'University of KwaZulu-Natal',
    shortName: 'UKZN',
    faculty: 'Health Sciences',
    degree: 'BPhysiotherapy',
    field: 'Health Sciences',
    minAPS: 32,
    duration: '4 years',
    subjectRequirements: [
      { subject: 'life-sciences', minLevel: 5, label: 'Life Sciences (60%+)' },
      { subject: 'physical-sciences', minLevel: 5, label: 'Physical Sciences (60%+)' },
      { subject: 'mathematics', minLevel: 4, label: 'Mathematics (50%+)' },
    ],
  },

  // ── COMMERCE ─────────────────────────────────────────────────────────────────
  {
    id: 'uct-bcom-accounting',
    university: 'University of Cape Town',
    shortName: 'UCT',
    faculty: 'Commerce',
    degree: 'BCom (Accounting)',
    field: 'Commerce & Management',
    minAPS: 40,
    duration: '3 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 6, label: 'Mathematics (70%+)' },
      { subject: 'english', minLevel: 6, label: 'English (70%+)' },
    ],
    notes: 'Leading to CA(SA) qualification',
  },
  {
    id: 'wits-bcom-accounting',
    university: 'University of the Witwatersrand',
    shortName: 'Wits',
    faculty: 'Commerce, Law & Management',
    degree: 'BCom (Accounting)',
    field: 'Commerce & Management',
    minAPS: 38,
    duration: '3 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 6, label: 'Mathematics (70%+)' },
      { subject: 'english', minLevel: 5, label: 'English (60%+)' },
    ],
  },
  {
    id: 'up-bcom-financial-sciences',
    university: 'University of Pretoria',
    shortName: 'UP',
    faculty: 'Economic & Management Sciences',
    degree: 'BCom (Financial Sciences)',
    field: 'Commerce & Management',
    minAPS: 30,
    duration: '3 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 5, label: 'Mathematics (60%+)' },
      { subject: 'english', minLevel: 4, label: 'English (50%+)' },
    ],
  },
  {
    id: 'stellenbosch-bcom',
    university: 'Stellenbosch University',
    shortName: 'SU',
    faculty: 'Economic & Management Sciences',
    degree: 'BCom (General)',
    field: 'Commerce & Management',
    minAPS: 34,
    duration: '3 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 5, label: 'Mathematics (60%+)' },
      { subject: 'english', minLevel: 5, label: 'English (60%+)' },
    ],
  },
  {
    id: 'unisa-bcom',
    university: 'UNISA',
    shortName: 'UNISA',
    faculty: 'Economic & Management Sciences',
    degree: 'BCom (General)',
    field: 'Commerce & Management',
    minAPS: 23,
    duration: '3 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 4, label: 'Mathematics (50%+)' },
      { subject: 'english', minLevel: 4, label: 'English (50%+)' },
    ],
    notes: 'Distance learning — highly flexible',
  },

  // ── LAW ───────────────────────────────────────────────────────────────────────
  {
    id: 'uct-llb',
    university: 'University of Cape Town',
    shortName: 'UCT',
    faculty: 'Law',
    degree: 'LLB (Law)',
    field: 'Law',
    minAPS: 40,
    duration: '4 years',
    subjectRequirements: [
      { subject: 'english', minLevel: 6, label: 'English (70%+)' },
      { subject: 'mathematics', minLevel: 5, label: 'Mathematics or Maths Lit (60%+)' },
    ],
  },
  {
    id: 'up-llb',
    university: 'University of Pretoria',
    shortName: 'UP',
    faculty: 'Law',
    degree: 'LLB (Law)',
    field: 'Law',
    minAPS: 30,
    duration: '4 years',
    subjectRequirements: [
      { subject: 'english', minLevel: 5, label: 'English (60%+)' },
    ],
  },
  {
    id: 'wits-llb',
    university: 'University of the Witwatersrand',
    shortName: 'Wits',
    faculty: 'Commerce, Law & Management',
    degree: 'LLB (Law)',
    field: 'Law',
    minAPS: 36,
    duration: '4 years',
    subjectRequirements: [
      { subject: 'english', minLevel: 6, label: 'English (70%+)' },
    ],
  },

  // ── NATURAL SCIENCES ─────────────────────────────────────────────────────────
  {
    id: 'uct-bsc-general',
    university: 'University of Cape Town',
    shortName: 'UCT',
    faculty: 'Science',
    degree: 'BSc (General)',
    field: 'Natural Sciences',
    minAPS: 36,
    duration: '3 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 6, label: 'Mathematics (70%+)' },
      { subject: 'physical-sciences', minLevel: 5, label: 'Physical Sciences (60%+)' },
    ],
  },
  {
    id: 'wits-bsc-general',
    university: 'University of the Witwatersrand',
    shortName: 'Wits',
    faculty: 'Science',
    degree: 'BSc (General)',
    field: 'Natural Sciences',
    minAPS: 36,
    duration: '3 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 5, label: 'Mathematics (60%+)' },
      { subject: 'physical-sciences', minLevel: 5, label: 'Physical Sciences (60%+)' },
    ],
  },
  {
    id: 'up-bsc-biological-sciences',
    university: 'University of Pretoria',
    shortName: 'UP',
    faculty: 'Natural & Agricultural Sciences',
    degree: 'BSc (Biological Sciences)',
    field: 'Natural Sciences',
    minAPS: 28,
    duration: '3 years',
    subjectRequirements: [
      { subject: 'life-sciences', minLevel: 5, label: 'Life Sciences (60%+)' },
      { subject: 'mathematics', minLevel: 5, label: 'Mathematics (60%+)' },
    ],
  },

  // ── INFORMATION TECHNOLOGY ────────────────────────────────────────────────────
  {
    id: 'uct-bsc-cs',
    university: 'University of Cape Town',
    shortName: 'UCT',
    faculty: 'Science',
    degree: 'BSc (Computer Science)',
    field: 'Information Technology',
    minAPS: 40,
    duration: '3 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 6, label: 'Mathematics (70%+)' },
      { subject: 'english', minLevel: 5, label: 'English (60%+)' },
    ],
  },
  {
    id: 'up-bsc-cs',
    university: 'University of Pretoria',
    shortName: 'UP',
    faculty: 'Engineering, Built Environment & IT',
    degree: 'BSc (Computer Science)',
    field: 'Information Technology',
    minAPS: 30,
    duration: '3 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 5, label: 'Mathematics (60%+)' },
      { subject: 'english', minLevel: 4, label: 'English (50%+)' },
    ],
  },
  {
    id: 'wits-bsc-cs',
    university: 'University of the Witwatersrand',
    shortName: 'Wits',
    faculty: 'Science',
    degree: 'BSc (Computer Science)',
    field: 'Information Technology',
    minAPS: 36,
    duration: '3 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 6, label: 'Mathematics (70%+)' },
      { subject: 'physical-sciences', minLevel: 5, label: 'Physical Sciences (60%+)' },
    ],
  },
  {
    id: 'cput-btech-it',
    university: 'Cape Peninsula University of Technology',
    shortName: 'CPUT',
    faculty: 'Informatics & Design',
    degree: 'BTech (Information Technology)',
    field: 'Information Technology',
    minAPS: 20,
    duration: '3 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 4, label: 'Mathematics (50%+)' },
      { subject: 'english', minLevel: 4, label: 'English (50%+)' },
    ],
  },
  {
    id: 'vut-nd-it',
    university: 'Vaal University of Technology',
    shortName: 'VUT',
    faculty: 'Applied & Computer Sciences',
    degree: 'Diploma in IT',
    field: 'Information Technology',
    minAPS: 18,
    duration: '3 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 3, label: 'Mathematics (40%+)' },
      { subject: 'english', minLevel: 3, label: 'English (40%+)' },
    ],
  },

  // ── EDUCATION ─────────────────────────────────────────────────────────────────
  {
    id: 'up-bed-foundation',
    university: 'University of Pretoria',
    shortName: 'UP',
    faculty: 'Education',
    degree: 'BEd (Foundation Phase)',
    field: 'Education',
    minAPS: 26,
    duration: '4 years',
    subjectRequirements: [
      { subject: 'english', minLevel: 4, label: 'English (50%+)' },
      { subject: 'mathematics', minLevel: 3, label: 'Mathematics (40%+)' },
    ],
  },
  {
    id: 'wits-bed-senior',
    university: 'University of the Witwatersrand',
    shortName: 'Wits',
    faculty: 'Humanities',
    degree: 'BEd (Senior Phase & FET)',
    field: 'Education',
    minAPS: 28,
    duration: '4 years',
    subjectRequirements: [
      { subject: 'english', minLevel: 5, label: 'English (60%+)' },
      { subject: 'mathematics', minLevel: 4, label: 'Mathematics (50%+)' },
    ],
  },

  // ── HUMANITIES ────────────────────────────────────────────────────────────────
  {
    id: 'uct-ba-general',
    university: 'University of Cape Town',
    shortName: 'UCT',
    faculty: 'Humanities',
    degree: 'BA (General)',
    field: 'Humanities & Social Sciences',
    minAPS: 33,
    duration: '3 years',
    subjectRequirements: [
      { subject: 'english', minLevel: 5, label: 'English (60%+)' },
    ],
  },
  {
    id: 'up-ba-social-sciences',
    university: 'University of Pretoria',
    shortName: 'UP',
    faculty: 'Humanities',
    degree: 'BA (Social Sciences)',
    field: 'Humanities & Social Sciences',
    minAPS: 26,
    duration: '3 years',
    subjectRequirements: [
      { subject: 'english', minLevel: 4, label: 'English (50%+)' },
    ],
  },
  {
    id: 'ukzn-bsocsc',
    university: 'University of KwaZulu-Natal',
    shortName: 'UKZN',
    faculty: 'Humanities',
    degree: 'BSocSci (Social Science)',
    field: 'Humanities & Social Sciences',
    minAPS: 24,
    duration: '3 years',
    subjectRequirements: [
      { subject: 'english', minLevel: 4, label: 'English (50%+)' },
    ],
  },

  // ── AGRICULTURE ───────────────────────────────────────────────────────────────
  {
    id: 'up-bsc-agric',
    university: 'University of Pretoria',
    shortName: 'UP',
    faculty: 'Natural & Agricultural Sciences',
    degree: 'BSc (Agriculture)',
    field: 'Agriculture & Environmental Sciences',
    minAPS: 28,
    duration: '4 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 4, label: 'Mathematics (50%+)' },
      { subject: 'physical-sciences', minLevel: 4, label: 'Physical Sciences or Life Sciences (50%+)' },
    ],
  },
  {
    id: 'ul-bsc-agric',
    university: 'University of Limpopo',
    shortName: 'UL',
    faculty: 'Science & Agriculture',
    degree: 'BSc (Agriculture)',
    field: 'Agriculture & Environmental Sciences',
    minAPS: 22,
    duration: '4 years',
    subjectRequirements: [
      { subject: 'mathematics', minLevel: 3, label: 'Mathematics (40%+)' },
      { subject: 'life-sciences', minLevel: 3, label: 'Life Sciences (40%+)' },
    ],
  },

  // ── ARTS & DESIGN ─────────────────────────────────────────────────────────────
  {
    id: 'uct-bfa',
    university: 'University of Cape Town',
    shortName: 'UCT',
    faculty: 'Humanities',
    degree: 'Bachelor of Fine Arts',
    field: 'Arts & Design',
    minAPS: 30,
    duration: '4 years',
    subjectRequirements: [
      { subject: 'english', minLevel: 5, label: 'English (60%+)' },
    ],
    notes: 'Portfolio required',
  },
  {
    id: 'cput-bdes',
    university: 'Cape Peninsula University of Technology',
    shortName: 'CPUT',
    faculty: 'Informatics & Design',
    degree: 'Bachelor of Design',
    field: 'Arts & Design',
    minAPS: 20,
    duration: '4 years',
    subjectRequirements: [
      { subject: 'english', minLevel: 4, label: 'English (50%+)' },
    ],
    notes: 'Portfolio submission required',
  },
];

export const FIELDS_OF_STUDY: FieldOfStudy[] = [
  'Engineering & Built Environment',
  'Health Sciences',
  'Commerce & Management',
  'Humanities & Social Sciences',
  'Natural Sciences',
  'Education',
  'Law',
  'Information Technology',
  'Agriculture & Environmental Sciences',
  'Arts & Design',
];

export const UNIVERSITIES = [...new Set(DEGREE_DATA.map(d => d.shortName))].sort();
