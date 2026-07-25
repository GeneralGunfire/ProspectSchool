// ── Topic 6 page: Solving Linear Equations — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { solvingLinearEquations } from '../../../../../data/library/algebra/grade10/term1/solvingLinearEquations';

export default function SolvingLinearEquations({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={solvingLinearEquations} onExit={onExit} />;
}
