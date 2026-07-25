// ── Topic 3 page: Algebraic Products — thin wrapper around LessonShell ───────

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { algebraicProducts } from '../../../../../data/library/algebra/grade10/term1/algebraicProducts';

export default function AlgebraicProducts({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={algebraicProducts} onExit={onExit} />;
}
