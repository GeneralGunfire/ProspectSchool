// ── Term 3, Topic 2 page: Box-and-Whisker Plots — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { boxAndWhiskerPlots } from '../../../../../data/library/algebra/grade10/term3/boxAndWhiskerPlots';

export default function BoxAndWhiskerPlots({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={boxAndWhiskerPlots} onExit={onExit} />;
}
