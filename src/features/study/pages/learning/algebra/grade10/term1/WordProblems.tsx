// ── Topic 9 page: Word Problems (Linear and Quadratic) — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { wordProblems } from '../../../../../data/library/algebra/grade10/term1/wordProblems';

export default function WordProblems({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={wordProblems} onExit={onExit} />;
}
