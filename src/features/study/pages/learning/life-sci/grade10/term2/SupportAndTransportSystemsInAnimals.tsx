// ── Life Sciences, Term 2, Topic 3 page: Support and Transport Systems in Animals — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { supportAndTransportSystemsInAnimals } from '../../../../../data/library/life-sci/grade10/term2/supportAndTransportSystemsInAnimals';

export default function SupportAndTransportSystemsInAnimals({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={supportAndTransportSystemsInAnimals} onExit={onExit} />;
}
