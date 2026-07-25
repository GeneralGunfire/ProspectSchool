// ── Term 2, Topic 5 page: Hyperbolic Functions — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { hyperbolicFunctions } from '../../../../../data/library/algebra/grade10/term2/hyperbolicFunctions';

export default function HyperbolicFunctions({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={hyperbolicFunctions} onExit={onExit} />;
}
