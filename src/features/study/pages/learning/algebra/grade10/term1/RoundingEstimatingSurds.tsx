// ── Topic 2 page: Rounding & Estimating Surds — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { roundingEstimatingSurds } from '../../../../../data/library/algebra/grade10/term1/roundingEstimatingSurds';

export default function RoundingEstimatingSurds({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={roundingEstimatingSurds} onExit={onExit} />;
}
