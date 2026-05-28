/**
 * Subject to Career Mapping
 * Maps Grade 10 subjects to relevant careers
 */

export const subjectCareerMapping: Record<string, string[]> = {
  'Mathematics': [
    'Software Engineer',
    'Data Scientist',
    'Accountant',
    'Economist',
    'Financial Analyst',
    'Actuary',
    'Engineer',
    'Architect',
    'Physicist',
    'Statistician',
    'Programmer',
    'IT Consultant',
    'Auditor',
    'Investment Banker',
    'Surveyor'
  ],
  'Physical Sciences': [
    'Engineer',
    'Scientist',
    'Pharmacist',
    'Doctor',
    'Electrician',
    'Technician',
    'Environmental Scientist',
    'Geologist',
    'Researcher',
    'Lab Technician',
    'Mechanic',
    'Plumber',
    'Chemical Engineer',
    'Civil Engineer',
    'Physicist'
  ],
  'Life Sciences': [
    'Doctor',
    'Nurse',
    'Veterinarian',
    'Biologist',
    'Pharmacist',
    'Dentist',
    'Therapist',
    'Nutritionist',
    'Medical Technologist',
    'Psychologist',
    'Researcher',
    'Lab Technician',
    'Health Inspector',
    'Agricultural Scientist',
    'Environmental Officer'
  ],
  'Accounting': [
    'Accountant',
    'Auditor',
    'Financial Analyst',
    'Tax Consultant',
    'Bookkeeper',
    'Cost Accountant',
    'Management Accountant',
    'Forensic Accountant',
    'Investment Banker',
    'Financial Planner',
    'Actuary',
    'CFO',
    'Internal Auditor',
    'Budget Analyst',
    'Controller'
  ],
  'Business Studies': [
    'Entrepreneur',
    'Manager',
    'Consultant',
    'Marketing Manager',
    'Sales Manager',
    'HR Manager',
    'Operations Manager',
    'Project Manager',
    'Business Analyst',
    'Executive',
    'Salesperson',
    'Event Organizer',
    'Retail Manager',
    'Supply Chain Manager',
    'Risk Manager'
  ],
  'Economics': [
    'Economist',
    'Banker',
    'Financial Analyst',
    'Policy Analyst',
    'Business Consultant',
    'Investment Manager',
    'Actuary',
    'Market Researcher',
    'Statistician',
    'Risk Manager',
    'Trade Analyst',
    'Development Economist',
    'Government Economist',
    'Academic',
    'Researcher'
  ],
  'CAT': [
    'Programmer',
    'Software Developer',
    'IT Support Technician',
    'Network Administrator',
    'Web Developer',
    'Database Administrator',
    'Systems Administrator',
    'IT Manager',
    'Software Architect',
    'IT Consultant',
    'Cybersecurity Specialist',
    'Tech Support Engineer',
    'Data Analyst',
    'IT Technician',
    'Help Desk Specialist'
  ],
  'EGD': [
    'Engineer',
    'Architect',
    'Technician',
    'Draughtsman',
    'CAD Designer',
    'Product Designer',
    'Structural Engineer',
    'Mechanical Engineer',
    'Civil Engineer',
    'Construction Manager',
    'Building Inspector',
    'Land Surveyor',
    'Technical Designer',
    'Manufacturing Engineer',
    'Project Engineer'
  ],
  'English Home Language': [
    'Lawyer',
    'Journalist',
    'Writer',
    'Teacher',
    'Editor',
    'Translator',
    'Public Relations Officer',
    'Marketing Manager',
    'Author',
    'Presenter',
    'Speech Writer',
    'Communications Specialist',
    'Content Creator',
    'Copywriter',
    'Literary Agent'
  ]
};

/**
 * Extract all unique careers from all subject mappings
 */
export function getAllCareers(): string[] {
  const allCareers = new Set<string>();
  Object.values(subjectCareerMapping).forEach(careers => {
    careers.forEach(career => allCareers.add(career));
  });
  return Array.from(allCareers).sort();
}

/**
 * Get careers matching selected subjects
 * Returns careers that appear in at least one of the selected subjects
 */
export function getMatchingCareers(selectedSubjects: string[]): string[] {
  if (selectedSubjects.length === 0) return [];

  const careerCounts = new Map<string, number>();
  const subjectCount = selectedSubjects.length;

  selectedSubjects.forEach(subject => {
    const careers = subjectCareerMapping[subject] || [];
    careers.forEach(career => {
      careerCounts.set(career, (careerCounts.get(career) || 0) + 1);
    });
  });

  // Sort by how many selected subjects this career appears in
  return Array.from(careerCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([career]) => career);
}

/**
 * Get top matching careers (up to limit)
 */
export function getTopMatchingCareers(selectedSubjects: string[], limit: number = 10): string[] {
  return getMatchingCareers(selectedSubjects).slice(0, limit);
}
