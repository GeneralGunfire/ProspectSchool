// ── Topic 5 page: Simplifying Algebraic Fractions — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { algebraicFractions } from '../../../../../data/library/algebra/grade10/term1/algebraicFractions';

export default function AlgebraicFractions({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={algebraicFractions} onExit={onExit} />;
}
