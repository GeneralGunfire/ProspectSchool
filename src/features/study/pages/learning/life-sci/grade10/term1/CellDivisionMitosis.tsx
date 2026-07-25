// ── Life Sciences, Term 1, Topic 3 page: Cell Division: Mitosis — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { cellDivisionMitosis } from '../../../../../data/library/life-sci/grade10/term1/cellDivisionMitosis';

export default function CellDivisionMitosis({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={cellDivisionMitosis} onExit={onExit} />;
}
