// ── Geometry, Term 2, Topic 2 page: Gradient and Equations of Lines — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { gradientAndEquationsOfLines } from '../../../../../data/library/geometry/grade10/term2/gradientAndEquationsOfLines';

export default function GradientAndEquationsOfLines({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={gradientAndEquationsOfLines} onExit={onExit} />;
}
