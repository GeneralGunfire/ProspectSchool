// ── Physical Sciences, Term 3, Topic 2 page: Vectors and Scalars — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { vectorsAndScalars } from '../../../../../data/library/phys-sci/grade10/term3/vectorsAndScalars';

export default function VectorsAndScalars({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={vectorsAndScalars} onExit={onExit} />;
}
