// ── Physical Sciences, Term 1, Topic 2 page: Electrostatics — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { electrostatics } from '../../../../../data/library/phys-sci/grade10/term1/electrostatics';

export default function Electrostatics({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={electrostatics} onExit={onExit} />;
}
