// ── Geometry, Term 4, Topic 2 page: Triangle Properties and Congruency — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { triangleProperties } from '../../../../../data/library/geometry/grade10/term4/triangleProperties';

export default function TriangleProperties({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={triangleProperties} onExit={onExit} />;
}
