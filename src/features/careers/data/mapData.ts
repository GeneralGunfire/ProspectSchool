// SA Geographic and Educational Data for Map Feature

export interface Province {
  name: string;
  centroid: { lat: number; lng: number };
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

export interface CityCoord {
  name: string;
  province: string;
  lat: number;
  lng: number;
  hotspot?: boolean; // Major job hotspot
}

export interface UniversityLocation {
  name: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
}

export interface TVETCollegeLocation {
  name: string;
  city: string;
  province: string;
  lat: number;
  lng: number;
}

export interface CostOfLiving {
  city: string;
  province: string;
  rent: [number, number]; // [min, max] monthly ZAR
  transport: number;
  food: number; // Monthly spend
  monthly_total: [number, number]; // [min, max]
}

export interface ProvinceJobDemand {
  province: string;
  level: 'high' | 'medium' | 'low';
  topIndustries: string[];
}

// SA Provinces with centroids
export const PROVINCES: Province[] = [
  {
    name: 'Gauteng',
    centroid: { lat: -25.7461, lng: 28.2293 },
    bounds: { north: -24.5, south: -26.5, east: 29.9, west: 27.8 },
  },
  {
    name: 'Western Cape',
    centroid: { lat: -33.9249, lng: 18.4241 },
    bounds: { north: -33.3, south: -34.8, east: 19.5, west: 17 },
  },
  {
    name: 'KwaZulu-Natal',
    centroid: { lat: -29.6100, lng: 31.0753 },
    bounds: { north: -27.9, south: -31.1, east: 32.8, west: 30 },
  },
  {
    name: 'Eastern Cape',
    centroid: { lat: -32.5832, lng: 26.2324 },
    bounds: { north: -31.2, south: -33.9, east: 28.3, west: 25 },
  },
  {
    name: 'Limpopo',
    centroid: { lat: -23.8103, lng: 28.7469 },
    bounds: { north: -22.2, south: -25.3, east: 30.8, west: 27.3 },
  },
  {
    name: 'Mpumalanga',
    centroid: { lat: -25.5328, lng: 30.3397 },
    bounds: { north: -24.5, south: -27.2, east: 32.8, west: 29 },
  },
  {
    name: 'North West',
    centroid: { lat: -26.0473, lng: 25.6367 },
    bounds: { north: -25, south: -27.5, east: 27.8, west: 24 },
  },
  {
    name: 'Free State',
    centroid: { lat: -28.2366, lng: 25.5225 },
    bounds: { north: -26.8, south: -30.2, east: 28.8, west: 24 },
  },
  {
    name: 'Northern Cape',
    centroid: { lat: -29.6100, lng: 25.2656 },
    bounds: { north: -27.8, south: -30.8, east: 28.8, west: 20.3 },
  },
];

// Major Cities in SA
export const MAJOR_CITIES: CityCoord[] = [
  { name: 'Johannesburg', province: 'Gauteng', lat: -26.2023, lng: 28.0436, hotspot: true },
  { name: 'Pretoria', province: 'Gauteng', lat: -25.7482, lng: 28.2293, hotspot: true },
  { name: 'Sandton', province: 'Gauteng', lat: -26.1088, lng: 28.0681, hotspot: true },
  { name: 'Cape Town', province: 'Western Cape', lat: -33.9249, lng: 18.4241, hotspot: true },
  { name: 'Stellenbosch', province: 'Western Cape', lat: -33.9341, lng: 18.8631 },
  { name: 'Durban', province: 'KwaZulu-Natal', lat: -29.8587, lng: 31.0218, hotspot: true },
  { name: 'Pietermaritzburg', province: 'KwaZulu-Natal', lat: -29.6135, lng: 30.3944 },
  { name: 'Port Elizabeth', province: 'Eastern Cape', lat: -33.9576, lng: 25.6012, hotspot: true },
  { name: 'East London', province: 'Eastern Cape', lat: -33.0136, lng: 27.9125 },
  { name: 'Polokwane', province: 'Limpopo', lat: -23.9009, lng: 29.4167 },
  { name: 'Mbombela', province: 'Mpumalanga', lat: -25.4792, lng: 30.9928 },
  { name: 'Witbank', province: 'Mpumalanga', lat: -25.8549, lng: 29.2269 },
  { name: 'Rustenburg', province: 'North West', lat: -25.6802, lng: 27.2345 },
  { name: 'Bloemfontein', province: 'Free State', lat: -29.1199, lng: 25.5186, hotspot: true },
  { name: 'Kimberley', province: 'Northern Cape', lat: -28.7347, lng: 24.8821 },
  { name: 'Potchefstroom', province: 'North West', lat: -26.7073, lng: 27.0928 },
  { name: 'Soweto', province: 'Gauteng', lat: -26.2644, lng: 27.8468 },
  { name: 'Tshwane', province: 'Gauteng', lat: -25.5478, lng: 28.2293 },
];

// 26 Public Universities in SA
export const UNIVERSITIES: UniversityLocation[] = [
  { name: 'University of Cape Town (UCT)', city: 'Cape Town', province: 'Western Cape', lat: -33.959, lng: 18.46 },
  { name: 'Stellenbosch University', city: 'Stellenbosch', province: 'Western Cape', lat: -33.933, lng: 18.864 },
  { name: 'University of the Western Cape', city: 'Cape Town', province: 'Western Cape', lat: -33.919, lng: 18.468 },
  { name: 'University of Johannesburg', city: 'Johannesburg', province: 'Gauteng', lat: -26.191, lng: 28.065 },
  { name: 'University of the Witwatersrand', city: 'Johannesburg', province: 'Gauteng', lat: -26.195, lng: 28.05 },
  { name: 'University of Pretoria', city: 'Pretoria', province: 'Gauteng', lat: -25.753, lng: 28.235 },
  { name: 'University of South Africa (UNISA)', city: 'Pretoria', province: 'Gauteng', lat: -25.745, lng: 28.3 },
  { name: 'North-West University', city: 'Potchefstroom', province: 'North West', lat: -26.709, lng: 27.093 },
  { name: 'University of Limpopo', city: 'Polokwane', province: 'Limpopo', lat: -23.901, lng: 29.417 },
  { name: 'University of the Free State', city: 'Bloemfontein', province: 'Free State', lat: -29.11, lng: 25.51 },
  { name: 'Central University of Technology', city: 'Bloemfontein', province: 'Free State', lat: -29.12, lng: 25.51 },
  { name: 'University of KwaZulu-Natal', city: 'Durban', province: 'KwaZulu-Natal', lat: -29.874, lng: 31.019 },
  { name: 'Durban University of Technology', city: 'Durban', province: 'KwaZulu-Natal', lat: -29.856, lng: 31.025 },
  { name: 'Mangosuthu University of Technology', city: 'Durban', province: 'KwaZulu-Natal', lat: -29.834, lng: 31.021 },
  { name: 'University of Zululand', city: 'KwaDlangezwa', province: 'KwaZulu-Natal', lat: -28.823, lng: 31.805 },
  { name: 'University of Venda', city: 'Thohoyandou', province: 'Limpopo', lat: -23.126, lng: 30.354 },
  { name: 'Tshwane University of Technology', city: 'Pretoria', province: 'Gauteng', lat: -25.592, lng: 28.25 },
  { name: 'University of Mpumalanga', city: 'Mbombela', province: 'Mpumalanga', lat: -25.48, lng: 30.99 },
  { name: 'Rhodes University', city: 'Grahamstown', province: 'Eastern Cape', lat: -33.305, lng: 26.53 },
  { name: 'Nelson Mandela University', city: 'Port Elizabeth', province: 'Eastern Cape', lat: -33.96, lng: 25.6 },
  { name: 'Cape Peninsula University of Technology', city: 'Cape Town', province: 'Western Cape', lat: -33.97, lng: 18.43 },
  { name: 'Vaal University of Technology', city: 'Vanderbijlpark', province: 'Gauteng', lat: -26.73, lng: 27.78 },
  { name: 'Sefako Makgatho Health Sciences University', city: 'Pretoria', province: 'Gauteng', lat: -25.6, lng: 28.2 },
  { name: 'University of Fort Hare', city: 'Alice', province: 'Eastern Cape', lat: -32.795, lng: 26.84 },
  { name: 'Border Technical College', city: 'East London', province: 'Eastern Cape', lat: -33.01, lng: 27.91 },
  { name: 'Witwatersrand University (Wits)', city: 'Johannesburg', province: 'Gauteng', lat: -26.195, lng: 28.05 },
];

// Representative TVET Colleges in SA (50 mapped to 9 provinces)
export const TVET_COLLEGES: TVETCollegeLocation[] = [
  // Gauteng (10)
  { name: 'Ekurhuleni West TVET College', city: 'Johannesburg', province: 'Gauteng', lat: -26.22, lng: 28.09 },
  { name: 'Ekurhuleni South TVET College', city: 'Johannesburg', province: 'Gauteng', lat: -26.25, lng: 28.05 },
  { name: 'Joburg TVET College', city: 'Johannesburg', province: 'Gauteng', lat: -26.20, lng: 28.08 },
  { name: 'Tshwane North TVET College', city: 'Pretoria', province: 'Gauteng', lat: -25.6, lng: 28.3 },
  { name: 'Tshwane South TVET College', city: 'Pretoria', province: 'Gauteng', lat: -25.75, lng: 28.25 },
  { name: 'West Rand TVET College', city: 'Soweto', province: 'Gauteng', lat: -26.29, lng: 27.86 },
  { name: 'Sedibeng TVET College', city: 'Vereeniging', province: 'Gauteng', lat: -26.24, lng: 27.93 },
  { name: 'Motheo TVET College', city: 'Johannesburg', province: 'Gauteng', lat: -26.21, lng: 28.04 },
  { name: 'Gert Sibande TVET College', city: 'Johannesburg', province: 'Gauteng', lat: -26.23, lng: 28.06 },
  { name: 'Free State TVET College', city: 'Johannesburg', province: 'Gauteng', lat: -26.20, lng: 28.07 },

  // Western Cape (8)
  { name: 'Cape Peninsula TVET College', city: 'Cape Town', province: 'Western Cape', lat: -33.97, lng: 18.43 },
  { name: 'Boland TVET College', city: 'Stellenbosch', province: 'Western Cape', lat: -33.93, lng: 18.86 },
  { name: 'South Cape TVET College', city: 'Cape Town', province: 'Western Cape', lat: -33.92, lng: 18.42 },
  { name: 'False Bay TVET College', city: 'Cape Town', province: 'Western Cape', lat: -33.98, lng: 18.45 },
  { name: 'West Coast TVET College', city: 'Cape Town', province: 'Western Cape', lat: -33.93, lng: 18.45 },
  { name: 'Caledon TVET College', city: 'Stellenbosch', province: 'Western Cape', lat: -33.93, lng: 18.87 },
  { name: 'Strand TVET College', city: 'Cape Town', province: 'Western Cape', lat: -33.95, lng: 18.41 },
  { name: 'Hermanus TVET College', city: 'Cape Town', province: 'Western Cape', lat: -33.94, lng: 18.44 },

  // KwaZulu-Natal (8)
  { name: 'Durban University of Technology Campus', city: 'Durban', province: 'KwaZulu-Natal', lat: -29.86, lng: 31.02 },
  { name: 'Umfolozi TVET College', city: 'Durban', province: 'KwaZulu-Natal', lat: -29.88, lng: 31.00 },
  { name: 'Pinetown TVET College', city: 'Durban', province: 'KwaZulu-Natal', lat: -29.85, lng: 30.99 },
  { name: 'Umlazi TVET College', city: 'Durban', province: 'KwaZulu-Natal', lat: -29.95, lng: 31.05 },
  { name: 'Newcastle TVET College', city: 'Newcastle', province: 'KwaZulu-Natal', lat: -27.82, lng: 30.11 },
  { name: 'Pietermaritzburg TVET College', city: 'Pietermaritzburg', province: 'KwaZulu-Natal', lat: -29.61, lng: 30.39 },
  { name: 'Uthukela TVET College', city: 'Pietermaritzburg', province: 'KwaZulu-Natal', lat: -29.62, lng: 30.40 },
  { name: 'Cartour TVET College', city: 'Durban', province: 'KwaZulu-Natal', lat: -29.87, lng: 31.01 },

  // Eastern Cape (6)
  { name: 'Port Elizabeth TVET College', city: 'Port Elizabeth', province: 'Eastern Cape', lat: -33.96, lng: 25.60 },
  { name: 'Algoa TVET College', city: 'Port Elizabeth', province: 'Eastern Cape', lat: -33.95, lng: 25.61 },
  { name: 'East London TVET College', city: 'East London', province: 'Eastern Cape', lat: -33.01, lng: 27.91 },
  { name: 'Buffalo City TVET College', city: 'East London', province: 'Eastern Cape', lat: -33.02, lng: 27.92 },
  { name: 'South Africa TVET College', city: 'Port Elizabeth', province: 'Eastern Cape', lat: -33.94, lng: 25.59 },
  { name: 'Grahamstown TVET College', city: 'Grahamstown', province: 'Eastern Cape', lat: -33.30, lng: 26.53 },

  // Limpopo (4)
  { name: 'Capricorn TVET College', city: 'Polokwane', province: 'Limpopo', lat: -23.90, lng: 29.42 },
  { name: 'Mopani TVET College', city: 'Polokwane', province: 'Limpopo', lat: -23.91, lng: 29.43 },
  { name: 'Nzhelele TVET College', city: 'Polokwane', province: 'Limpopo', lat: -23.89, lng: 29.41 },
  { name: 'Waterberg TVET College', city: 'Polokwane', province: 'Limpopo', lat: -23.92, lng: 29.44 },

  // Mpumalanga (4)
  { name: 'Ehlanzeni TVET College', city: 'Mbombela', province: 'Mpumalanga', lat: -25.48, lng: 30.99 },
  { name: 'Gert Sibande TVET College', city: 'Witbank', province: 'Mpumalanga', lat: -25.85, lng: 29.23 },
  { name: 'Nkangala TVET College', city: 'Witbank', province: 'Mpumalanga', lat: -25.86, lng: 29.24 },
  { name: 'Sibanyoni TVET College', city: 'Mbombela', province: 'Mpumalanga', lat: -25.49, lng: 31.00 },

  // North West (4)
  { name: 'Rustenburg TVET College', city: 'Rustenburg', province: 'North West', lat: -25.68, lng: 27.23 },
  { name: 'Potchefstroom TVET College', city: 'Potchefstroom', province: 'North West', lat: -26.71, lng: 27.09 },
  { name: 'North West TVET College', city: 'Rustenburg', province: 'North West', lat: -25.69, lng: 27.24 },
  { name: 'Mafikeng TVET College', city: 'Mafikeng', province: 'North West', lat: -25.84, lng: 25.64 },

  // Free State (4)
  { name: 'Motheo TVET College', city: 'Bloemfontein', province: 'Free State', lat: -29.11, lng: 25.51 },
  { name: 'Thabo Mofutsanyane TVET College', city: 'Bloemfontein', province: 'Free State', lat: -29.12, lng: 25.52 },
  { name: 'Maluti TVET College', city: 'Bloemfontein', province: 'Free State', lat: -29.10, lng: 25.50 },
  { name: 'Welkom TVET College', city: 'Welkom', province: 'Free State', lat: -28.23, lng: 25.59 },

  // Northern Cape (2)
  { name: 'Kimberley TVET College', city: 'Kimberley', province: 'Northern Cape', lat: -28.73, lng: 24.88 },
  { name: 'Northern Cape TVET College', city: 'Kimberley', province: 'Northern Cape', lat: -28.74, lng: 24.89 },
];

// Cost of Living by Major City
export const COST_OF_LIVING: CostOfLiving[] = [
  {
    city: 'Johannesburg',
    province: 'Gauteng',
    rent: [3000, 6500],
    transport: 800,
    food: 2500,
    monthly_total: [6300, 9800],
  },
  {
    city: 'Cape Town',
    province: 'Western Cape',
    rent: [3500, 7000],
    transport: 600,
    food: 2000,
    monthly_total: [6100, 9600],
  },
  {
    city: 'Durban',
    province: 'KwaZulu-Natal',
    rent: [2500, 5500],
    transport: 700,
    food: 2000,
    monthly_total: [5200, 8200],
  },
  {
    city: 'Pretoria',
    province: 'Gauteng',
    rent: [2800, 5500],
    transport: 700,
    food: 2200,
    monthly_total: [5700, 8400],
  },
  {
    city: 'Port Elizabeth',
    province: 'Eastern Cape',
    rent: [2000, 4500],
    transport: 500,
    food: 1800,
    monthly_total: [4300, 6800],
  },
  {
    city: 'Bloemfontein',
    province: 'Free State',
    rent: [1800, 3800],
    transport: 400,
    food: 1600,
    monthly_total: [3800, 5800],
  },
  {
    city: 'Polokwane',
    province: 'Limpopo',
    rent: [1500, 3200],
    transport: 300,
    food: 1400,
    monthly_total: [3200, 4900],
  },
  {
    city: 'Mbombela',
    province: 'Mpumalanga',
    rent: [1600, 3500],
    transport: 400,
    food: 1500,
    monthly_total: [3500, 5400],
  },
];

// Job Demand by Province (derived from career data patterns)
export const PROVINCE_JOB_DEMAND: ProvinceJobDemand[] = [
  {
    province: 'Gauteng',
    level: 'high',
    topIndustries: ['IT & Technology', 'Finance', 'Consulting', 'Manufacturing', 'Retail'],
  },
  {
    province: 'Western Cape',
    level: 'high',
    topIndustries: ['Tourism', 'Wine Industry', 'Technology', 'Healthcare', 'Education'],
  },
  {
    province: 'KwaZulu-Natal',
    level: 'medium',
    topIndustries: ['Logistics & Transport', 'Manufacturing', 'Agriculture', 'Healthcare', 'Retail'],
  },
  {
    province: 'Eastern Cape',
    level: 'medium',
    topIndustries: ['Automotive', 'Manufacturing', 'Healthcare', 'Education', 'Government'],
  },
  {
    province: 'Limpopo',
    level: 'low',
    topIndustries: ['Agriculture', 'Mining', 'Government', 'Healthcare', 'Education'],
  },
  {
    province: 'Mpumalanga',
    level: 'low',
    topIndustries: ['Mining', 'Agriculture', 'Energy', 'Government', 'Manufacturing'],
  },
  {
    province: 'North West',
    level: 'low',
    topIndustries: ['Mining', 'Agriculture', 'Manufacturing', 'Government', 'Education'],
  },
  {
    province: 'Free State',
    level: 'low',
    topIndustries: ['Agriculture', 'Manufacturing', 'Education', 'Government', 'Energy'],
  },
  {
    province: 'Northern Cape',
    level: 'low',
    topIndustries: ['Mining', 'Agriculture', 'Government', 'Energy', 'Tourism'],
  },
];

// SA Bounding Box (for validation)
export const SA_BOUNDS = {
  north: -22,
  south: -34,
  east: 33,
  west: 16,
};

// Utility function to get province from coordinates
export function getProvinceFromCoords(lat: number, lng: number): string | null {
  for (const province of PROVINCES) {
    const { bounds } = province;
    if (lat <= bounds.north && lat >= bounds.south && lng <= bounds.east && lng >= bounds.west) {
      return province.name;
    }
  }
  return null;
}

// Utility function to check if within SA
export function isWithinSouthAfrica(lat: number, lng: number): boolean {
  return lat >= SA_BOUNDS.south && lat <= SA_BOUNDS.north && lng >= SA_BOUNDS.west && lng <= SA_BOUNDS.east;
}

// Utility function to get nearest city
export function getNearestCity(lat: number, lng: number): CityCoord | null {
  if (MAJOR_CITIES.length === 0) return null;

  let nearest = MAJOR_CITIES[0];
  let minDist = Math.hypot(nearest.lat - lat, nearest.lng - lng);

  for (let i = 1; i < MAJOR_CITIES.length; i++) {
    const city = MAJOR_CITIES[i];
    const dist = Math.hypot(city.lat - lat, city.lng - lng);
    if (dist < minDist) {
      minDist = dist;
      nearest = city;
    }
  }

  return minDist < 5 ? nearest : null; // Within ~5 degrees
}

// Industry Breakdown by Province
export interface IndustryBreakdown {
  province: string;
  industries: Array<{ name: string; percentage: number }>;
}

export const INDUSTRY_BREAKDOWN: IndustryBreakdown[] = [
  {
    province: 'Gauteng',
    industries: [
      { name: 'Technology & IT', percentage: 25 },
      { name: 'Finance & Business', percentage: 20 },
      { name: 'Manufacturing', percentage: 15 },
      { name: 'Retail & Trade', percentage: 15 },
      { name: 'Healthcare', percentage: 10 },
      { name: 'Education', percentage: 8 },
      { name: 'Other', percentage: 7 },
    ],
  },
  {
    province: 'Western Cape',
    industries: [
      { name: 'Tourism & Hospitality', percentage: 20 },
      { name: 'Technology & IT', percentage: 18 },
      { name: 'Wine & Agriculture', percentage: 15 },
      { name: 'Finance & Business', percentage: 14 },
      { name: 'Healthcare', percentage: 12 },
      { name: 'Education', percentage: 10 },
      { name: 'Other', percentage: 11 },
    ],
  },
  {
    province: 'KwaZulu-Natal',
    industries: [
      { name: 'Logistics & Transport', percentage: 22 },
      { name: 'Manufacturing', percentage: 18 },
      { name: 'Retail & Trade', percentage: 16 },
      { name: 'Healthcare', percentage: 13 },
      { name: 'Agriculture', percentage: 12 },
      { name: 'Education', percentage: 10 },
      { name: 'Other', percentage: 9 },
    ],
  },
  {
    province: 'Eastern Cape',
    industries: [
      { name: 'Automotive', percentage: 20 },
      { name: 'Manufacturing', percentage: 18 },
      { name: 'Retail & Trade', percentage: 15 },
      { name: 'Healthcare', percentage: 13 },
      { name: 'Education', percentage: 12 },
      { name: 'Government', percentage: 12 },
      { name: 'Other', percentage: 10 },
    ],
  },
  {
    province: 'Limpopo',
    industries: [
      { name: 'Agriculture', percentage: 25 },
      { name: 'Mining', percentage: 20 },
      { name: 'Government', percentage: 18 },
      { name: 'Healthcare', percentage: 13 },
      { name: 'Education', percentage: 12 },
      { name: 'Retail & Trade', percentage: 8 },
      { name: 'Other', percentage: 4 },
    ],
  },
  {
    province: 'Mpumalanga',
    industries: [
      { name: 'Mining', percentage: 28 },
      { name: 'Manufacturing', percentage: 18 },
      { name: 'Agriculture', percentage: 16 },
      { name: 'Energy', percentage: 14 },
      { name: 'Government', percentage: 12 },
      { name: 'Education', percentage: 8 },
      { name: 'Other', percentage: 4 },
    ],
  },
  {
    province: 'North West',
    industries: [
      { name: 'Mining', percentage: 32 },
      { name: 'Agriculture', percentage: 18 },
      { name: 'Manufacturing', percentage: 14 },
      { name: 'Government', percentage: 14 },
      { name: 'Education', percentage: 11 },
      { name: 'Retail & Trade', percentage: 7 },
      { name: 'Other', percentage: 4 },
    ],
  },
  {
    province: 'Free State',
    industries: [
      { name: 'Agriculture', percentage: 24 },
      { name: 'Manufacturing', percentage: 18 },
      { name: 'Government', percentage: 16 },
      { name: 'Education', percentage: 14 },
      { name: 'Energy', percentage: 12 },
      { name: 'Retail & Trade', percentage: 10 },
      { name: 'Other', percentage: 6 },
    ],
  },
  {
    province: 'Northern Cape',
    industries: [
      { name: 'Mining', percentage: 30 },
      { name: 'Agriculture', percentage: 22 },
      { name: 'Energy', percentage: 16 },
      { name: 'Government', percentage: 14 },
      { name: 'Tourism', percentage: 10 },
      { name: 'Education', percentage: 6 },
      { name: 'Other', percentage: 2 },
    ],
  },
];

// Top Employers by Province
export interface TopEmployer {
  name: string;
  province: string;
  city: string;
  openRoles: number;
  industry: string;
}

export const TOP_EMPLOYERS: TopEmployer[] = [
  // Gauteng
  { name: 'Eskom', province: 'Gauteng', city: 'Johannesburg', openRoles: 250, industry: 'Energy' },
  { name: 'Transnet', province: 'Gauteng', city: 'Johannesburg', openRoles: 180, industry: 'Logistics' },
  { name: 'Vodacom', province: 'Gauteng', city: 'Johannesburg', openRoles: 150, industry: 'Technology' },
  { name: 'Standard Bank', province: 'Gauteng', city: 'Johannesburg', openRoles: 120, industry: 'Finance' },
  { name: 'Sasol', province: 'Gauteng', city: 'Johannesburg', openRoles: 100, industry: 'Manufacturing' },
  { name: 'Microsoft', province: 'Gauteng', city: 'Johannesburg', openRoles: 85, industry: 'Technology' },
  { name: 'Accenture', province: 'Gauteng', city: 'Johannesburg', openRoles: 95, industry: 'Consulting' },
  { name: 'Absa', province: 'Gauteng', city: 'Johannesburg', openRoles: 110, industry: 'Finance' },

  // Western Cape
  { name: 'Investec', province: 'Western Cape', city: 'Cape Town', openRoles: 75, industry: 'Finance' },
  { name: 'Mediclinic', province: 'Western Cape', city: 'Cape Town', openRoles: 85, industry: 'Healthcare' },
  { name: 'Shoprite', province: 'Western Cape', city: 'Cape Town', openRoles: 120, industry: 'Retail' },
  { name: 'Distell', province: 'Western Cape', city: 'Cape Town', openRoles: 60, industry: 'Wine & Beverages' },
  { name: 'Uber', province: 'Western Cape', city: 'Cape Town', openRoles: 40, industry: 'Technology' },
  { name: 'Luno', province: 'Western Cape', city: 'Cape Town', openRoles: 30, industry: 'Fintech' },

  // KwaZulu-Natal
  { name: 'Durban Port Authority', province: 'KwaZulu-Natal', city: 'Durban', openRoles: 140, industry: 'Logistics' },
  { name: 'Toyota', province: 'KwaZulu-Natal', city: 'Durban', openRoles: 200, industry: 'Manufacturing' },
  { name: 'Mondi', province: 'KwaZulu-Natal', city: 'Durban', openRoles: 110, industry: 'Manufacturing' },
  { name: 'Tiger Brands', province: 'KwaZulu-Natal', city: 'Durban', openRoles: 90, industry: 'Food & Beverage' },

  // Eastern Cape
  { name: 'Volkswagen', province: 'Eastern Cape', city: 'Port Elizabeth', openRoles: 180, industry: 'Automotive' },
  { name: 'Daimler', province: 'Eastern Cape', city: 'East London', openRoles: 150, industry: 'Automotive' },
  { name: 'Uitenhage Municipality', province: 'Eastern Cape', city: 'Port Elizabeth', openRoles: 75, industry: 'Government' },

  // Limpopo
  { name: 'Eskom (Limpopo)', province: 'Limpopo', city: 'Polokwane', openRoles: 95, industry: 'Energy' },
  { name: 'Foskor', province: 'Limpopo', city: 'Polokwane', openRoles: 60, industry: 'Mining' },

  // Other provinces (minimal)
  { name: 'Impala Platinum', province: 'Mpumalanga', city: 'Witbank', openRoles: 120, industry: 'Mining' },
  { name: 'Kumba Iron Ore', province: 'North West', city: 'Rustenburg', openRoles: 150, industry: 'Mining' },
  { name: 'Free State Government', province: 'Free State', city: 'Bloemfontein', openRoles: 80, industry: 'Government' },
];
