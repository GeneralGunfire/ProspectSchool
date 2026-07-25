// ── Term 2, Topic 4 page: Quadratic Functions — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { quadraticFunctions } from '../../../../../data/library/algebra/grade10/term2/quadraticFunctions';

export default function QuadraticFunctions({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={quadraticFunctions} onExit={onExit} />;
}
