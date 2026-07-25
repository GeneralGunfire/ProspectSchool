// ── Topic 10 page: Literal Equations — thin wrapper around LessonShell ───────

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { literalEquations } from '../../../../../data/library/algebra/grade10/term1/literalEquations';

export default function LiteralEquations({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={literalEquations} onExit={onExit} />;
}
