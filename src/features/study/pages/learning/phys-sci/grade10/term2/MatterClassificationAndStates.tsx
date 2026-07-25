// ── Physical Sciences, Term 2, Topic 1 page: Matter Classification and States — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { matterClassificationAndStates } from '../../../../../data/library/phys-sci/grade10/term2/matterClassificationAndStates';

export default function MatterClassificationAndStates({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={matterClassificationAndStates} onExit={onExit} />;
}
