// ── Physical Sciences, Term 3, Topic 5 page: Energy — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { energy } from '../../../../../data/library/phys-sci/grade10/term3/energy';

export default function Energy({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={energy} onExit={onExit} />;
}
