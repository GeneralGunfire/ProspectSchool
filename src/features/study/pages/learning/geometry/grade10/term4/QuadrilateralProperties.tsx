// ── Geometry, Term 4, Topic 3 page: Quadrilateral Properties and Proofs — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { quadrilateralProperties } from '../../../../../data/library/geometry/grade10/term4/quadrilateralProperties';

export default function QuadrilateralProperties({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={quadrilateralProperties} onExit={onExit} />;
}
