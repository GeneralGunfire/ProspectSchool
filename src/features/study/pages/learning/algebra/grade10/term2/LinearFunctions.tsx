// ── Term 2, Topic 3 page: Linear Functions — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { linearFunctions } from '../../../../../data/library/algebra/grade10/term2/linearFunctions';

export default function LinearFunctions({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={linearFunctions} onExit={onExit} />;
}
