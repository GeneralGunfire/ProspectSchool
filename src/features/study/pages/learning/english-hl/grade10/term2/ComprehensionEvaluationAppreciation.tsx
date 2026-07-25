// ── English HL, Term 2, Topic 3 page: Comprehension - Evaluation & Appreciation — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { comprehensionEvaluationAppreciation } from '../../../../../data/library/english-hl/grade10/term2/comprehensionEvaluationAppreciation';

export default function ComprehensionEvaluationAppreciation({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={comprehensionEvaluationAppreciation} onExit={onExit} />;
}
