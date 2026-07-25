// ── Life Sciences, Term 1, Topic 2 page: Cells: Basic Units of Life — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { cellsBasicUnitsOfLife } from '../../../../../data/library/life-sci/grade10/term1/cellsBasicUnitsOfLife';

export default function CellsBasicUnitsOfLife({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={cellsBasicUnitsOfLife} onExit={onExit} />;
}
