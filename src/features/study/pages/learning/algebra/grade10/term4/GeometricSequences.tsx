// ── Term 4, Topic 2 page: Geometric Sequences — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { geometricSequences } from '../../../../../data/library/algebra/grade10/term4/geometricSequences';

export default function GeometricSequences({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={geometricSequences} onExit={onExit} />;
}
