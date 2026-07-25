// ── Term 2, Topic 6 page: Exponential Functions — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { exponentialFunctions } from '../../../../../data/library/algebra/grade10/term2/exponentialFunctions';

export default function ExponentialFunctions({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={exponentialFunctions} onExit={onExit} />;
}
