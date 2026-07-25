// ── Life Sciences, Term 1, Topic 1 page: Chemistry of Life — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { chemistryOfLife } from '../../../../../data/library/life-sci/grade10/term1/chemistryOfLife';

export default function ChemistryOfLife({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={chemistryOfLife} onExit={onExit} />;
}
