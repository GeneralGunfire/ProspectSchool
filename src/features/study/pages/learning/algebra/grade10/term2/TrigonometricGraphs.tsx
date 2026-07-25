// ── Term 2, Topic 7 page: Trigonometric Graphs — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { trigonometricGraphs } from '../../../../../data/library/algebra/grade10/term2/trigonometricGraphs';

export default function TrigonometricGraphs({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={trigonometricGraphs} onExit={onExit} />;
}
