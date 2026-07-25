// ── Topic 8 page: Solving Simultaneous Equations — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { solvingSimultaneousEquations } from '../../../../../data/library/algebra/grade10/term1/solvingSimultaneousEquations';

export default function SolvingSimultaneousEquations({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={solvingSimultaneousEquations} onExit={onExit} />;
}
