// ── Topic registry — single source of truth for what content exists ──────────
// Each entry is metadata only (no lesson content loaded until a student
// actually opens that topic — content files are lazy-imported by the page
// wrapper, not here). This keeps grades/terms/subjects cleanly separated by
// construction: Grade 10 Algebra Term 1 topics live in their own array here
// and their own folder under data/library/algebra/grade10/term1/ — adding
// Grade 11 or 12 content later means adding new entries/folders, never
// touching existing ones.
//
// LibraryHubPage filters this registry by the logged-in student's grade so a
// Grade 10 student only ever sees Grade 10 subjects/terms/topics.

export interface TopicRegistryEntry {
  subject: string; // matches subjects.ts id
  grade: number;
  term: number;
  topicId: string;
  topicName: string;
  estimatedMinutes: [number, number];
  /** The innerPage route string LibraryPage.tsx matches to render this topic. */
  routeId: string;
}

export const TOPIC_REGISTRY: TopicRegistryEntry[] = [
  {
    subject: 'algebra',
    grade: 10,
    term: 1,
    topicId: 'real-number-system',
    topicName: 'The Real Number System',
    estimatedMinutes: [20, 30],
    routeId: 'learning-algebra-g10-t1-real-number-system',
  },
];

export function topicsForGrade(grade: number): TopicRegistryEntry[] {
  return TOPIC_REGISTRY.filter(t => t.grade === grade);
}

export function subjectsForGrade(grade: number): string[] {
  return [...new Set(topicsForGrade(grade).map(t => t.subject))];
}

export function termsForSubjectGrade(subject: string, grade: number): number[] {
  return [...new Set(TOPIC_REGISTRY.filter(t => t.subject === subject && t.grade === grade).map(t => t.term))].sort((a, b) => a - b);
}

export function topicsForSubjectGradeTerm(subject: string, grade: number, term: number): TopicRegistryEntry[] {
  return TOPIC_REGISTRY.filter(t => t.subject === subject && t.grade === grade && t.term === term);
}
