// ── Term 3, Topic 4 page: Tree Diagrams & Combined Events — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { treeDiagramsCombinedEvents } from '../../../../../data/library/algebra/grade10/term3/treeDiagramsCombinedEvents';

export default function TreeDiagramsCombinedEvents({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={treeDiagramsCombinedEvents} onExit={onExit} />;
}
