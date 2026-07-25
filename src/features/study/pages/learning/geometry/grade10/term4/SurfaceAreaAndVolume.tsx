// ── Geometry, Term 4, Topic 1 page: Surface Area and Volume — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { surfaceAreaAndVolume } from '../../../../../data/library/geometry/grade10/term4/surfaceAreaAndVolume';

export default function SurfaceAreaAndVolume({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={surfaceAreaAndVolume} onExit={onExit} />;
}
