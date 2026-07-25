// ── Physical Sciences, Term 3, Topic 4 page: Equations of Motion — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { equationsOfMotion } from '../../../../../data/library/phys-sci/grade10/term3/equationsOfMotion';

export default function EquationsOfMotion({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={equationsOfMotion} onExit={onExit} />;
}
