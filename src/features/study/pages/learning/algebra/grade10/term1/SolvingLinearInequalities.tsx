// ── Topic 11 page: Solving Linear Inequalities — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { solvingLinearInequalities } from '../../../../../data/library/algebra/grade10/term1/solvingLinearInequalities';

export default function SolvingLinearInequalities({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={solvingLinearInequalities} onExit={onExit} />;
}
