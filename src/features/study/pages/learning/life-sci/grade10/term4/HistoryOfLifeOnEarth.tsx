// ── Life Sciences, Term 4, Topic 2 page: History of Life on Earth — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { historyOfLifeOnEarth } from '../../../../../data/library/life-sci/grade10/term4/historyOfLifeOnEarth';

export default function HistoryOfLifeOnEarth({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={historyOfLifeOnEarth} onExit={onExit} />;
}
