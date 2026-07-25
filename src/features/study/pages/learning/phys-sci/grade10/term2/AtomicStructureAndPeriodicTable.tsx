// ── Physical Sciences, Term 2, Topic 2 page: Atomic Structure and the Periodic Table — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { atomicStructureAndPeriodicTable } from '../../../../../data/library/phys-sci/grade10/term2/atomicStructureAndPeriodicTable';

export default function AtomicStructureAndPeriodicTable({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={atomicStructureAndPeriodicTable} onExit={onExit} />;
}
