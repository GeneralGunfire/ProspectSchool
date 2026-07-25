// ── Geometry, Term 4, Topic 1 page: Lines and Angles — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { linesAndAngles } from '../../../../../data/library/geometry/grade10/term4/linesAndAngles';

export default function LinesAndAngles({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={linesAndAngles} onExit={onExit} />;
}
