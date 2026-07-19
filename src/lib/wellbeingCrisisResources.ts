// ── South African crisis/referral resources ──────────────────────────────────
// Single source of truth for every phone/SMS number shown anywhere in the
// wellbeing feature (student safety-response screen, teacher script UI).
//
// Verified 2026-07-19 against each organisation's own site / official
// directory (see `source` per entry). Re-verify periodically — helplines do
// change numbers. Do not add or change a number anywhere else in the
// codebase — this file is the only place they should live.

export interface CrisisResource {
  name: string;
  description: string;
  phone: string;        // tel: link target, digits/spaces as dialled
  phoneDisplay: string;  // human-readable
  smsAvailable?: boolean;
  verified: true;
  source: string;   // where this number was confirmed, for future re-verification
}

export const CRISIS_RESOURCES: CrisisResource[] = [
  {
    name: 'Childline South Africa',
    description: '24/7 helpline for children and adults, toll-free from all networks',
    phone: '116',
    phoneDisplay: '116',
    verified: true,
    source: 'childlinesa.org.za/contact-us',
  },
  {
    name: 'SADAG Suicide Crisis Helpline',
    description: 'South African Depression and Anxiety Group — 24-hour toll-free crisis line',
    phone: '0800567567',
    phoneDisplay: '0800 567 567',
    verified: true,
    source: 'sadag.org',
  },
  {
    name: 'SADAG Office',
    description: 'South African Depression and Anxiety Group — general enquiries, 8am-8pm',
    phone: '0112344837',
    phoneDisplay: '011 234 4837',
    verified: true,
    source: 'sadag.org',
  },
  {
    name: 'Lifeline South Africa',
    description: 'National access number — routes to your nearest branch (24/7 toll-free counselling also available on 0800 012 322)',
    phone: '0861322322',
    phoneDisplay: '0861 322 322',
    verified: true,
    source: 'lifeline.co.za',
  },
  {
    name: 'Department of Basic Education Call Centre',
    description: 'DBE guidance line',
    phone: '0800202933',
    phoneDisplay: '0800 202 933',
    verified: true,
    source: 'DBE psychosocial support / LSA guidance materials',
  },
  {
    name: 'Police (emergency)',
    description: 'Immediate danger',
    phone: '10111',
    phoneDisplay: '10111',
    verified: true,
    source: 'SAPS national emergency number',
  },
  {
    name: 'Ambulance (emergency)',
    description: 'Immediate danger / medical emergency',
    phone: '10177',
    phoneDisplay: '10177',
    verified: true,
    source: 'National emergency medical services number',
  },
];
