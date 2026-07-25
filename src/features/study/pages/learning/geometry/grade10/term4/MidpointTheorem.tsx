// ── Geometry, Term 4, Topic 4 page: The Midpoint Theorem — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { midpointTheorem } from '../../../../../data/library/geometry/grade10/term4/midpointTheorem';

export default function MidpointTheorem({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={midpointTheorem} onExit={onExit} />;
}
