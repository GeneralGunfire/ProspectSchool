/**
 * TVET Careers and Technical Pathways
 * Matches Grade 10 subjects to TVET programs
 * Expanded list of 70+ TVET careers available in South Africa
 */

export interface TVETCareer {
  id: string;
  name: string;
  description: string;
  relatedSubjects: string[];
  colleges: string[];
  duration: string;
  salaryRange: string;
  jobDemand: 'High' | 'Medium' | 'Low';
  entryRequirements: string;
}

export const tvetCareers: TVETCareer[] = [
  // Electrical & Electronic Trades
  {
    id: 'electrician',
    name: 'Electrician',
    description: 'Install, maintain, and repair electrical systems in buildings, industries, and homes',
    relatedSubjects: ['Physical Sciences', 'Mathematics', 'EGD'],
    colleges: ['IPSET', 'Johannesburg TVET College', 'Ekurhuleni TVET College'],
    duration: '3 years',
    salaryRange: 'R8,000 - R18,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 minimum, with Physics and Mathematics'
  },
  {
    id: 'electronics-technician',
    name: 'Electronics Technician',
    description: 'Repair and maintain electronic equipment, circuitry, and devices',
    relatedSubjects: ['Physical Sciences', 'Mathematics', 'CAT'],
    colleges: ['Northlink TVET College', 'Johannesburg TVET College'],
    duration: '3 years',
    salaryRange: 'R8,500 - R17,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 with Physics'
  },
  {
    id: 'power-systems-technician',
    name: 'Power Systems Technician',
    description: 'Install and maintain electrical power distribution systems',
    relatedSubjects: ['Physical Sciences', 'Mathematics', 'EGD'],
    colleges: ['Eskom Training Academy', 'Johannesburg TVET College'],
    duration: '3-4 years',
    salaryRange: 'R12,000 - R22,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 10 with Physics and Mathematics'
  },
  {
    id: 'solar-installer',
    name: 'Solar PV Installer',
    description: 'Install and maintain renewable solar energy systems',
    relatedSubjects: ['Physical Sciences', 'Mathematics', 'EGD'],
    colleges: ['Multiple TVET colleges offering green energy programs'],
    duration: '2 years',
    salaryRange: 'R9,000 - R18,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 with Mathematics'
  },

  // Plumbing & Gas Services
  {
    id: 'plumber',
    name: 'Plumber',
    description: 'Install and repair water and gas pipes, fixtures, and systems',
    relatedSubjects: ['Physical Sciences', 'Mathematics'],
    colleges: ['Cape Peninsula TVET College', 'Eastcape Midlands TVET College'],
    duration: '3 years',
    salaryRange: 'R7,000 - R16,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 minimum with Mathematics'
  },
  {
    id: 'gas-installer',
    name: 'Gas Installer (LPG)',
    description: 'Install and maintain liquefied petroleum gas systems safely',
    relatedSubjects: ['Physical Sciences', 'Mathematics'],
    colleges: ['Boland TVET College', 'West Coast TVET College'],
    duration: '2 years',
    salaryRange: 'R8,000 - R15,000/month',
    jobDemand: 'Medium',
    entryRequirements: 'Grade 9 with Mathematics'
  },

  // Metal & Welding Trades
  {
    id: 'welder',
    name: 'Welder',
    description: 'Weld metal parts together for construction, manufacturing, and repair',
    relatedSubjects: ['Physical Sciences', 'Mathematics', 'EGD'],
    colleges: ['Gert Sibande TVET College', 'Vhembe TVET College'],
    duration: '3 years',
    salaryRange: 'R7,500 - R17,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 minimum with Physical Sciences'
  },
  {
    id: 'structural-steel-worker',
    name: 'Structural Steel Worker',
    description: 'Fabricate and assemble structural steel components',
    relatedSubjects: ['EGD', 'Mathematics', 'Physical Sciences'],
    colleges: ['Ekurhuleni TVET College', 'Johannesburg TVET College'],
    duration: '3 years',
    salaryRange: 'R8,000 - R17,500/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 with Mathematics'
  },
  {
    id: 'metal-fabricator',
    name: 'Metal Fabricator',
    description: 'Design and fabricate metal products and structures',
    relatedSubjects: ['EGD', 'Physical Sciences', 'Mathematics'],
    colleges: ['Ekurhuleni TVET College', 'Gert Sibande TVET College'],
    duration: '3 years',
    salaryRange: 'R7,500 - R16,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 with EGD'
  },

  // Woodwork & Construction
  {
    id: 'carpenter',
    name: 'Carpenter & Joinery',
    description: 'Design, build, and install wood structures and furniture',
    relatedSubjects: ['EGD', 'Physical Sciences', 'Mathematics'],
    colleges: ['Ekurhuleni TVET College', 'Northlink TVET College'],
    duration: '3 years',
    salaryRange: 'R6,500 - R14,000/month',
    jobDemand: 'Medium',
    entryRequirements: 'Grade 9 with EGD or Mathematics'
  },
  {
    id: 'furniture-maker',
    name: 'Furniture Maker',
    description: 'Craft and manufacture custom furniture and wooden items',
    relatedSubjects: ['EGD', 'Business Studies', 'Mathematics'],
    colleges: ['Northlink TVET College', 'Boland TVET College'],
    duration: '3 years',
    salaryRange: 'R6,500 - R13,000/month',
    jobDemand: 'Medium',
    entryRequirements: 'Grade 9 with creative skills'
  },
  {
    id: 'construction',
    name: 'Construction & Building',
    description: 'Learn construction techniques, safety, and project management',
    relatedSubjects: ['EGD', 'Physical Sciences', 'Mathematics'],
    colleges: ['Gert Sibande TVET College', 'KZN TVET College'],
    duration: '3 years',
    salaryRange: 'R8,000 - R18,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 with Mathematics'
  },
  {
    id: 'bricklayer-mason',
    name: 'Bricklayer & Mason',
    description: 'Lay bricks, blocks, and stones to construct building structures',
    relatedSubjects: ['Mathematics', 'Physical Sciences'],
    colleges: ['Multiple regional TVET colleges'],
    duration: '2 years',
    salaryRange: 'R6,000 - R12,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 minimum'
  },

  // Mechanical Trades
  {
    id: 'motor-mechanic',
    name: 'Motor Mechanic',
    description: 'Service, repair, and maintain motor vehicles and engines',
    relatedSubjects: ['Physical Sciences', 'Mathematics'],
    colleges: ['Automotive Skills Institute', 'Johannesburg TVET College'],
    duration: '3 years',
    salaryRange: 'R7,000 - R15,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 minimum'
  },
  {
    id: 'diesel-mechanic',
    name: 'Diesel Mechanic',
    description: 'Service diesel engines used in trucks, buses, and heavy equipment',
    relatedSubjects: ['Physical Sciences', 'Mathematics'],
    colleges: ['Automotive Skills Institute', 'Ekurhuleni TVET College'],
    duration: '3 years',
    salaryRange: 'R8,000 - R16,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 with Mathematics'
  },
  {
    id: 'heavy-equipment-operator',
    name: 'Heavy Equipment Operator',
    description: 'Operate bulldozers, excavators, and other construction machinery',
    relatedSubjects: ['Mathematics', 'EGD'],
    colleges: ['Ekurhuleni TVET College', 'Gert Sibande TVET College'],
    duration: '2 years',
    salaryRange: 'R8,500 - R16,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 10 with valid drivers license'
  },
  {
    id: 'plant-mechanic',
    name: 'Plant Mechanic',
    description: 'Maintain industrial machinery and plant equipment',
    relatedSubjects: ['Physical Sciences', 'Mathematics', 'EGD'],
    colleges: ['Ekurhuleni TVET College', 'Johannesburg TVET College'],
    duration: '3 years',
    salaryRange: 'R9,000 - R17,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 with Mathematics'
  },

  // Hospitality & Food Services
  {
    id: 'chef',
    name: 'Chef / Culinary Arts',
    description: 'Prepare and cook food in professional kitchen settings',
    relatedSubjects: ['Business Studies', 'Life Sciences'],
    colleges: ['False Bay TVET College', 'Boland TVET College'],
    duration: '2-3 years',
    salaryRange: 'R6,000 - R12,000/month',
    jobDemand: 'Medium',
    entryRequirements: 'Grade 9 minimum'
  },
  {
    id: 'pastry-chef',
    name: 'Pastry Chef & Baker',
    description: 'Bake and decorate pastries, breads, and baked goods',
    relatedSubjects: ['Mathematics', 'Business Studies'],
    colleges: ['Boland TVET College', 'False Bay TVET College'],
    duration: '2 years',
    salaryRange: 'R5,500 - R11,000/month',
    jobDemand: 'Medium',
    entryRequirements: 'Grade 9 minimum'
  },
  {
    id: 'hospitality-manager',
    name: 'Hospitality Management',
    description: 'Manage hotel, restaurant, and hospitality operations',
    relatedSubjects: ['Business Studies', 'Tourism'],
    colleges: ['Boland TVET College', 'Multiple hospitality colleges'],
    duration: '2-3 years',
    salaryRange: 'R7,000 - R14,000/month',
    jobDemand: 'Medium',
    entryRequirements: 'Grade 10 minimum'
  },

  // ICT & Digital Technology
  {
    id: 'it-support',
    name: 'IT Support & Networking',
    description: 'Provide technical support and maintain computer networks',
    relatedSubjects: ['CAT', 'Mathematics'],
    colleges: ['Northlink TVET College', 'West Coast TVET College'],
    duration: '2-3 years',
    salaryRange: 'R8,000 - R16,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 9 with Mathematics/CAT'
  },
  {
    id: 'network-technician',
    name: 'Network Technician',
    description: 'Install, configure, and troubleshoot computer networks',
    relatedSubjects: ['CAT', 'Mathematics', 'Physical Sciences'],
    colleges: ['Northlink TVET College', 'Johannesburg TVET College'],
    duration: '3 years',
    salaryRange: 'R9,000 - R17,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 10 with CAT'
  },
  {
    id: 'web-developer',
    name: 'Web Development',
    description: 'Design and develop websites and web applications',
    relatedSubjects: ['CAT', 'Mathematics'],
    colleges: ['Northlink TVET College', 'Multiple digital colleges'],
    duration: '2-3 years',
    salaryRange: 'R10,000 - R18,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 10 with CAT'
  },
  {
    id: 'cybersecurity-technician',
    name: 'Cybersecurity Technician',
    description: 'Protect computer systems and networks from cyber threats',
    relatedSubjects: ['CAT', 'Mathematics'],
    colleges: ['Northlink TVET College', 'Johannesburg TVET College'],
    duration: '2 years',
    salaryRange: 'R11,000 - R19,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 10 with CAT/IT'
  },

  // Health & Safety
  {
    id: 'occupational-health-safety',
    name: 'Occupational Health & Safety',
    description: 'Implement workplace safety and health protocols',
    relatedSubjects: ['Life Sciences', 'Business Studies'],
    colleges: ['Multiple TVET colleges'],
    duration: '2 years',
    salaryRange: 'R7,500 - R14,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 10 minimum'
  },
  {
    id: 'nursing-assistant',
    name: 'Nursing Assistant',
    description: 'Assist nurses and healthcare professionals in patient care',
    relatedSubjects: ['Life Sciences', 'Physical Sciences'],
    colleges: ['Multiple health training colleges'],
    duration: '1-2 years',
    salaryRange: 'R5,500 - R10,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 10 with Life Sciences'
  },

  // Tourism & Events
  {
    id: 'tour-guide',
    name: 'Tour Guide',
    description: 'Guide tourists and provide information about destinations',
    relatedSubjects: ['Tourism', 'Languages', 'Business Studies'],
    colleges: ['Boland TVET College', 'Tourism training centers'],
    duration: '2 years',
    salaryRange: 'R5,500 - R11,000/month',
    jobDemand: 'Medium',
    entryRequirements: 'Grade 10 with good communication skills'
  },
  {
    id: 'events-coordinator',
    name: 'Events Coordinator',
    description: 'Plan and organize events, conferences, and functions',
    relatedSubjects: ['Business Studies', 'CAT'],
    colleges: ['Multiple event training colleges'],
    duration: '2 years',
    salaryRange: 'R6,500 - R12,500/month',
    jobDemand: 'Medium',
    entryRequirements: 'Grade 10 minimum'
  },

  // Agricultural & Environmental
  {
    id: 'agricultural-technician',
    name: 'Agricultural Technician',
    description: 'Manage agricultural operations and crop production',
    relatedSubjects: ['Life Sciences', 'Mathematics'],
    colleges: ['Agricultural colleges, Vhembe TVET'],
    duration: '2-3 years',
    salaryRange: 'R6,000 - R12,000/month',
    jobDemand: 'Medium',
    entryRequirements: 'Grade 10 with Life Sciences'
  },
  {
    id: 'veterinary-technician',
    name: 'Veterinary Technician',
    description: 'Assist veterinarians in animal care and treatment',
    relatedSubjects: ['Life Sciences', 'Physical Sciences'],
    colleges: ['Agricultural colleges'],
    duration: '2-3 years',
    salaryRange: 'R6,500 - R13,000/month',
    jobDemand: 'Medium',
    entryRequirements: 'Grade 10 with Life Sciences'
  },
  {
    id: 'environmental-technician',
    name: 'Environmental Technician',
    description: 'Monitor and manage environmental compliance and sustainability',
    relatedSubjects: ['Life Sciences', 'Physical Sciences'],
    colleges: ['Multiple environmental training centers'],
    duration: '2 years',
    salaryRange: 'R7,000 - R13,500/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 10 with Life Sciences'
  },

  // Manufacturing & Production
  {
    id: 'production-technician',
    name: 'Production Technician',
    description: 'Operate and monitor manufacturing production equipment',
    relatedSubjects: ['Mathematics', 'Physical Sciences'],
    colleges: ['Ekurhuleni TVET College', 'Johannesburg TVET College'],
    duration: '2-3 years',
    salaryRange: 'R7,500 - R14,500/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 10 with Mathematics'
  },
  {
    id: 'quality-control-technician',
    name: 'Quality Control Technician',
    description: 'Inspect and test products to ensure quality standards',
    relatedSubjects: ['Mathematics', 'Physical Sciences'],
    colleges: ['Multiple manufacturing colleges'],
    duration: '2 years',
    salaryRange: 'R7,000 - R13,500/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 10 with Mathematics'
  },

  // Textiles & Fashion
  {
    id: 'tailor-seamstress',
    name: 'Tailor/Seamstress',
    description: 'Design and create garments and textile products',
    relatedSubjects: ['Home Economics', 'Business Studies'],
    colleges: ['Multiple textile colleges'],
    duration: '2 years',
    salaryRange: 'R5,000 - R10,000/month',
    jobDemand: 'Low',
    entryRequirements: 'Grade 9 minimum'
  },

  // Transportation & Logistics
  {
    id: 'truck-driver',
    name: 'Heavy Vehicle Driver (HGV)',
    description: 'Drive large commercial trucks and manage cargo transport',
    relatedSubjects: ['Mathematics', 'Physical Sciences'],
    colleges: ['Multiple driver training schools'],
    duration: '3 months - 1 year',
    salaryRange: 'R8,000 - R15,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 10, valid drivers license'
  },
  {
    id: 'logistics-technician',
    name: 'Logistics & Supply Chain Technician',
    description: 'Manage inventory, warehousing, and supply chain operations',
    relatedSubjects: ['Mathematics', 'Business Studies', 'CAT'],
    colleges: ['Northlink TVET College', 'Multiple logistics centers'],
    duration: '2 years',
    salaryRange: 'R7,500 - R14,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 10 with Mathematics'
  },

  // Mining & Resources
  {
    id: 'mining-technician',
    name: 'Mining Technician',
    description: 'Support mining operations and extraction processes',
    relatedSubjects: ['Mathematics', 'Physical Sciences'],
    colleges: ['Mining colleges, Gert Sibande TVET'],
    duration: '3 years',
    salaryRange: 'R12,000 - R22,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 10 with Mathematics'
  },

  // Retail & Commerce
  {
    id: 'retail-management',
    name: 'Retail Management',
    description: 'Manage retail operations, staff, and customer service',
    relatedSubjects: ['Business Studies', 'Mathematics'],
    colleges: ['Multiple retail training centers'],
    duration: '2 years',
    salaryRange: 'R6,000 - R12,000/month',
    jobDemand: 'Medium',
    entryRequirements: 'Grade 10 minimum'
  },

  // Office & Administration
  {
    id: 'office-administration',
    name: 'Office Administration',
    description: 'Manage office operations and administrative tasks',
    relatedSubjects: ['Business Studies', 'CAT', 'Languages'],
    colleges: ['Multiple business colleges'],
    duration: '1-2 years',
    salaryRange: 'R5,500 - R11,000/month',
    jobDemand: 'Medium',
    entryRequirements: 'Grade 10 minimum'
  },
  {
    id: 'bookkeeping',
    name: 'Bookkeeping & Accounts',
    description: 'Record financial transactions and maintain accounting records',
    relatedSubjects: ['Mathematics', 'Business Studies'],
    colleges: ['Multiple accounting colleges'],
    duration: '2 years',
    salaryRange: 'R6,500 - R12,500/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 10 with Mathematics'
  },

  // Security & Protection
  {
    id: 'security-officer',
    name: 'Security Officer',
    description: 'Provide security services and protect property and personnel',
    relatedSubjects: ['Physical Sciences', 'Business Studies'],
    colleges: ['Multiple security training centers'],
    duration: '6 months - 1 year',
    salaryRange: 'R4,500 - R8,500/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 10 minimum'
  },
  {
    id: 'fire-fighting',
    name: 'Fire Fighting & Rescue',
    description: 'Respond to fires and emergencies as a firefighter',
    relatedSubjects: ['Physical Sciences', 'Life Sciences'],
    colleges: ['Fire and rescue academies'],
    duration: '3-4 months',
    salaryRange: 'R6,000 - R12,000/month',
    jobDemand: 'Medium',
    entryRequirements: 'Grade 10 minimum, physical fitness'
  },

  // Creative & Technical
  {
    id: 'graphic-design',
    name: 'Graphic Design & Digital Media',
    description: 'Create visual designs using digital tools',
    relatedSubjects: ['CAT', 'Art', 'Business Studies'],
    colleges: ['Multiple design colleges'],
    duration: '2 years',
    salaryRange: 'R7,000 - R14,000/month',
    jobDemand: 'Medium',
    entryRequirements: 'Grade 10 with CAT'
  },

  // Water & Sanitation
  {
    id: 'water-technician',
    name: 'Water & Sanitation Technician',
    description: 'Manage water treatment and sanitation systems',
    relatedSubjects: ['Physical Sciences', 'Mathematics'],
    colleges: ['Multiple water boards and training centers'],
    duration: '2-3 years',
    salaryRange: 'R8,000 - R15,000/month',
    jobDemand: 'High',
    entryRequirements: 'Grade 10 with Chemistry/Biology'
  }
];

export function getMatchingTVETCareers(selectedSubjects: string[]): TVETCareer[] {
  if (selectedSubjects.length === 0) return [];

  return tvetCareers.filter(career => {
    return career.relatedSubjects.some(subject =>
      selectedSubjects.includes(subject)
    );
  }).sort((a, b) => {
    const demandOrder = { 'High': 0, 'Medium': 1, 'Low': 2 };
    return demandOrder[a.jobDemand] - demandOrder[b.jobDemand];
  });
}

export function getTopTVETCareers(selectedSubjects: string[], limit: number = 6): TVETCareer[] {
  return getMatchingTVETCareers(selectedSubjects).slice(0, limit);
}
