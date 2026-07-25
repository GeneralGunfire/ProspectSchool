// ── Life Sciences, Term 4, Topic 1 page: Biodiversity and Classification — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { biodiversityAndClassification } from '../../../../../data/library/life-sci/grade10/term4/biodiversityAndClassification';

export default function BiodiversityAndClassification({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={biodiversityAndClassification} onExit={onExit} />;
}
