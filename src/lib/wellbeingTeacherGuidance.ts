// ── Homeroom-teacher problem-specific guidance content ─────────────────────
// Static reference content for the 4 guidance pages in research section 4 of
// .planning/research/WELLBEING_HELP_EXPANSION_RESEARCH.md. Same rationale as
// wellbeingHelpContent.ts for keeping this a typed constants file rather than
// a DB table: static, no personalisation, no admin UI requested.
//
// Every topic ends with a safetyFlagBox (linking back to the existing crisis
// protocol, not a new one) and "remember" bullets, per the research spec.

export interface GuidanceSection {
  whatYouMightNotice: string[];
  why: string;
  script: string[];              // ordered: open / listen / close (or similar)
  classroomSupports: string[];
  whenToInvolveOthers: string;
  safetyFlagBox: string;
  remember: string[];
}

export type TeacherGuidanceTopicId =
  | 'low_mood_unmotivated'
  | 'very_worried_stressed'
  | 'mood_dropped_suddenly'
  | 'one_tough_week';

export interface TeacherGuidanceTopic {
  id: TeacherGuidanceTopicId;
  label: string;
  section: GuidanceSection;
}

const REMEMBER_BULLETS = [
  "You're not expected to be a therapist — your role is to notice, listen, and connect.",
  'Involve SBST/LSA and parents when patterns persist or intensify.',
];

const SAFETY_FLAG_BOX =
  'If you are ever worried about a student\'s immediate safety — mentions of self-harm, a plan, or feeling unsafe right now — this goes through the safety pathway, not this guidance: acknowledge any open safety flag immediately and follow the conversation script shown there.';

export const TEACHER_GUIDANCE_TOPICS: TeacherGuidanceTopic[] = [
  {
    id: 'low_mood_unmotivated',
    label: 'When a student seems low / unmotivated',
    section: {
      whatYouMightNotice: [
        'More tired than usual, head down in class.',
        'Less interested in previously-enjoyed activities.',
        'Says things like "What\'s the point?"',
      ],
      why:
        'Low energy and hopelessness are common signs of low mood, not character flaws or laziness. It can look like a student "not trying," when actually they\'re struggling to find energy or motivation.',
      script: [
        'Open: "I\'ve noticed you seem more tired/quiet lately. I\'m not worried about marks; I just want to know if things are okay."',
        'Listen: let them talk, don\'t rush to fix, avoid "just try harder."',
        'Close: "Thanks for telling me. You don\'t have to deal with this alone. Let\'s think about one small thing that could make this week a bit easier."',
      ],
      classroomSupports: [
        'Break tasks into smaller steps.',
        'Offer a quiet check-in option instead of putting them on the spot.',
        'Allow brief movement breaks if they seem restless or fatigued.',
      ],
      whenToInvolveOthers:
        'If low mood lasts more than 2 weeks, or you hear hopelessness/self-criticism, loop in SBST/LSA and contact parents.',
      safetyFlagBox: SAFETY_FLAG_BOX,
      remember: REMEMBER_BULLETS,
    },
  },
  {
    id: 'very_worried_stressed',
    label: 'When a student seems very worried / stressed',
    section: {
      whatYouMightNotice: [
        'Many "what if" questions, constant reassurance-seeking.',
        'Avoids speaking in class, tests, or group work.',
        'Physical signs — stomach aches, headaches before tests.',
      ],
      why:
        'Anxiety works like an overactive alarm system — it reacts to normal situations (a test, speaking up) as if they were more threatening than they are. This isn\'t weakness; it\'s a pattern that responds well to support.',
      script: [
        'Open: "I\'ve noticed tests/class seem really stressful for you. I want to understand what\'s hardest, so we can make it a bit easier."',
        'Validate: "It makes sense you\'d feel this way; lots of learners feel this."',
        'Collaborative problem-solve: "What\'s one small change that might help next time?"',
      ],
      classroomSupports: [
        'Give advance notice of tests/changes where possible.',
        'Offer seating choice.',
        'Teach a simple breathing/grounding exercise before tests (the same tools are available to the student in their own Wellbeing Tools section).',
      ],
      whenToInvolveOthers:
        'If worry is stopping them from participating, sleeping, or attending school regularly.',
      safetyFlagBox: SAFETY_FLAG_BOX,
      remember: REMEMBER_BULLETS,
    },
  },
  {
    id: 'mood_dropped_suddenly',
    label: "When a student's mood has dropped suddenly",
    section: {
      whatYouMightNotice: [
        'A marked change from their usual self over 1-2 weeks.',
        'Withdrawal, irritability, or big mood swings.',
      ],
      why:
        'A sudden change can signal a stressor — something at home, with friends, or a loss or trauma. It\'s worth taking seriously even without a clear cause yet.',
      script: [
        'Open: "I\'ve noticed a big change in how you seem lately compared to earlier this term. Has anything changed at home, with friends, or at school?"',
      ],
      classroomSupports: [
        'Prioritise a gentle, private conversation sooner rather than later.',
        'Keep routines predictable where you can — sudden changes are easier to navigate with stability elsewhere.',
      ],
      whenToInvolveOthers:
        'Consider involving SBST/LSA early, especially with red flags — mentions of self-harm, aggression, or absenteeism.',
      safetyFlagBox: SAFETY_FLAG_BOX,
      remember: REMEMBER_BULLETS,
    },
  },
  {
    id: 'one_tough_week',
    label: 'When a student seems okay but had one tough week',
    section: {
      whatYouMightNotice: [
        'One or two check-ins were a bit elevated, but nothing sustained.',
        'The student otherwise seems like themselves.',
      ],
      why:
        'This is usually a normal fluctuation, often tied to something situational — a test, an argument, a bad day. It doesn\'t need a formal conversation.',
      script: [
        'A light touch is enough: "You seemed a bit off earlier — everything okay?" in passing, not a sit-down conversation.',
      ],
      classroomSupports: [
        'No specific changes needed — just stay warm and available as usual.',
      ],
      whenToInvolveOthers:
        'Keep an eye out — if dips become frequent or start affecting participation or marks, treat it as a pattern instead (see the other guidance topics).',
      safetyFlagBox: SAFETY_FLAG_BOX,
      remember: REMEMBER_BULLETS,
    },
  },
];

export function getTeacherGuidanceTopic(id: TeacherGuidanceTopicId): TeacherGuidanceTopic | undefined {
  return TEACHER_GUIDANCE_TOPICS.find(t => t.id === id);
}
