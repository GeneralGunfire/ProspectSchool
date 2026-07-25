// ── Term 2, Topic 1 page: Trigonometric Ratios — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { trigonometricRatios } from '../../../../../data/library/algebra/grade10/term2/trigonometricRatios';

export default function TrigonometricRatios({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={trigonometricRatios} onExit={onExit} />;
}
