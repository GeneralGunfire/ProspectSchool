// ── Topic 7 page: Solving Quadratic Equations — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { solvingQuadraticEquations } from '../../../../../data/library/algebra/grade10/term1/solvingQuadraticEquations';

export default function SolvingQuadraticEquations({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={solvingQuadraticEquations} onExit={onExit} />;
}
