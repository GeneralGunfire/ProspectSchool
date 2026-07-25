// ── Life Sciences, Term 2, Topic 1 page: Plant and Animal Tissues — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { plantAndAnimalTissues } from '../../../../../data/library/life-sci/grade10/term2/plantAndAnimalTissues';

export default function PlantAndAnimalTissues({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={plantAndAnimalTissues} onExit={onExit} />;
}
