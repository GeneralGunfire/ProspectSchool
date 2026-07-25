// ── Geometry, Term 2, Topic 1 page: Distance and Midpoint — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { distanceAndMidpoint } from '../../../../../data/library/geometry/grade10/term2/distanceAndMidpoint';

export default function DistanceAndMidpoint({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={distanceAndMidpoint} onExit={onExit} />;
}
