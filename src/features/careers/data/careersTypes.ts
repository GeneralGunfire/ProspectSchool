export interface CareerFull {
  id: string;
  title: string;
  category: 'university' | 'tvet' | 'trade' | 'digital' | 'creative' | 'business';
  description: string;
  dayInTheLife: string;
  riasecMatch: {
    realistic: number;
    investigative: number;
    artistic: number;
    social: number;
    enterprising: number;
    conventional: number;
  };
  matricRequirements: {
    requiredSubjects: string[];
    recommendedSubjects: string[];
    minimumAps: number;
  };
  studyPath: {
    primaryOption: string;
    secondaryOption?: string;
    timeToQualify: string;
    nqfLevel: number;
  };
  providers: {
    universities?: string[];
    tvetColleges?: string[];
    apprenticeshipBodies?: string[];
  };
  jobDemand: {
    level: 'high' | 'medium' | 'low';
    growthOutlook: string;
    growthPercentage: number;
  };
  jobLocations: {
    provinces: string[];
    hotspots: string[];
    remoteViable: boolean;
  };
  salary: {
    entryLevel: number;
    midLevel: number;
    senior: number;
    currency: 'ZAR';
  };
  topEmployers: string[];
  industryType: string;
  relevantBursaries: string[];
  nsfasEligible: boolean;
  careerProgression: {
    entryRole: string;
    midRole: string;
    seniorRole: string;
  };
  skills: string[];
  commonMisconceptions: string[];
  keywords: string[];
  actionPlan?: {
    grade: string;
    actions: string[];
  }[];
  salaryNote?: string;
  apsNote?: string;
}
