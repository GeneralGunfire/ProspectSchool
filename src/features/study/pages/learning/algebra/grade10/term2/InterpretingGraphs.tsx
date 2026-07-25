// ── Term 2, Topic 8 page: Interpreting and Comparing Graphs — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { interpretingGraphs } from '../../../../../data/library/algebra/grade10/term2/interpretingGraphs';

export default function InterpretingGraphs({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={interpretingGraphs} onExit={onExit} />;
}
