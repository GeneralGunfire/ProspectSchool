// ── Life Sciences, Term 2, Topic 2 page: Support and Transport Systems in Plants — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { supportAndTransportSystemsInPlants } from '../../../../../data/library/life-sci/grade10/term2/supportAndTransportSystemsInPlants';

export default function SupportAndTransportSystemsInPlants({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={supportAndTransportSystemsInPlants} onExit={onExit} />;
}
