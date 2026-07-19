// ── Topic 1 page: The Real Number System — thin wrapper around LessonShell ────

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { realNumberSystem } from '../../../../../data/library/algebra/grade10/term1/realNumberSystem';

export default function RealNumberSystem({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={realNumberSystem} onExit={onExit} />;
}
