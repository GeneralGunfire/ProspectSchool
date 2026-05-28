/**
 * University Entry Requirements by Subject
 * Shows minimum marks needed for different degree types
 */

export interface UniversityRequirement {
  degreeType: string;
  minMark: number;
  description: string;
}

export const universityRequirements: Record<string, UniversityRequirement[]> = {
  'Mathematics': [
    { degreeType: 'Engineering', minMark: 70, description: 'Required for all engineering disciplines' },
    { degreeType: 'Commerce', minMark: 60, description: 'Required for accounting, economics, finance' },
    { degreeType: 'Science', minMark: 65, description: 'Highly recommended for physics, chemistry, mathematics' },
    { degreeType: 'Law', minMark: 55, description: 'Beneficial for certain law streams' },
    { degreeType: 'Medicine', minMark: 75, description: 'Required for medical and health sciences' },
  ],
  'Physical Sciences': [
    { degreeType: 'Engineering', minMark: 75, description: 'Essential for all engineering disciplines' },
    { degreeType: 'Medicine', minMark: 75, description: 'Required for medicine, dentistry, pharmacy' },
    { degreeType: 'Science', minMark: 70, description: 'Required for pure and applied sciences' },
    { degreeType: 'Environmental Science', minMark: 65, description: 'Recommended for environmental studies' },
    { degreeType: 'Agriculture', minMark: 60, description: 'Helpful for agricultural science' },
  ],
  'Life Sciences': [
    { degreeType: 'Medicine', minMark: 75, description: 'Required for medicine, dentistry, veterinary' },
    { degreeType: 'Nursing', minMark: 60, description: 'Required for nursing and health programs' },
    { degreeType: 'Pharmacy', minMark: 75, description: 'Required for pharmacy programs' },
    { degreeType: 'Psychology', minMark: 65, description: 'Required for psychology and counseling' },
    { degreeType: 'Agricultural Science', minMark: 60, description: 'Required for agricultural programs' },
  ],
  'Accounting': [
    { degreeType: 'Accounting', minMark: 65, description: 'Essential for accounting degrees' },
    { degreeType: 'Commerce', minMark: 60, description: 'Required for commerce programs' },
    { degreeType: 'Finance', minMark: 65, description: 'Beneficial for finance degrees' },
  ],
  'Business Studies': [
    { degreeType: 'Business Administration', minMark: 60, description: 'Recommended for business degrees' },
    { degreeType: 'Commerce', minMark: 55, description: 'Helpful for commerce programs' },
    { degreeType: 'Entrepreneurship', minMark: 50, description: 'Recommended for entrepreneurship' },
  ],
  'Economics': [
    { degreeType: 'Economics', minMark: 65, description: 'Essential for economics degrees' },
    { degreeType: 'Commerce', minMark: 60, description: 'Recommended for commerce programs' },
    { degreeType: 'Finance', minMark: 65, description: 'Required for finance and banking' },
  ],
  'CAT': [
    { degreeType: 'Computer Science', minMark: 70, description: 'Highly recommended for CS degrees' },
    { degreeType: 'IT', minMark: 65, description: 'Recommended for IT programs' },
    { degreeType: 'Software Engineering', minMark: 70, description: 'Recommended for software engineering' },
  ],
  'EGD': [
    { degreeType: 'Engineering', minMark: 70, description: 'Highly recommended for engineering' },
    { degreeType: 'Architecture', minMark: 65, description: 'Recommended for architecture' },
    { degreeType: 'Design', minMark: 60, description: 'Recommended for design programs' },
  ],
  'English Home Language': [
    { degreeType: 'Law', minMark: 65, description: 'Essential for all law degrees' },
    { degreeType: 'Humanities', minMark: 55, description: 'Required for most humanities degrees' },
    { degreeType: 'Education', minMark: 60, description: 'Required for teacher training' },
    { degreeType: 'Journalism', minMark: 65, description: 'Recommended for media studies' },
  ],
};

/**
 * APS Score Guide
 */
export const apsScoreGuide = [
  { apsRange: '40-60', category: 'Access Universities', description: 'Most public universities accept students with this range' },
  { apsRange: '60-80', category: 'Selective Universities', description: 'Good range for competitive programs at Wits, UCT, Stellenbosch' },
  { apsRange: '80+', category: 'Highly Selective', description: 'Top-tier programs in engineering, medicine, law require this range' },
];

/**
 * Get requirements for a specific subject
 */
export function getSubjectRequirements(subject: string): UniversityRequirement[] {
  return universityRequirements[subject] || [];
}

/**
 * Get all degree types mentioned in requirements
 */
export function getAllDegreeTypes(): string[] {
  const types = new Set<string>();
  Object.values(universityRequirements).forEach(requirements => {
    requirements.forEach(req => types.add(req.degreeType));
  });
  return Array.from(types).sort();
}
