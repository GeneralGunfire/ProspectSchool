// ── English HL, Term 1, Topic 3 page: Comprehension Strategies — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { comprehensionStrategies } from '../../../../../data/library/english-hl/grade10/term1/comprehensionStrategies';

export default function ComprehensionStrategies({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={comprehensionStrategies} onExit={onExit} />;
}
