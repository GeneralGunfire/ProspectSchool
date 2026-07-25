// ── Physical Sciences, Term 3, Topic 3 page: Motion in One Dimension — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { motionInOneDimension } from '../../../../../data/library/phys-sci/grade10/term3/motionInOneDimension';

export default function MotionInOneDimension({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={motionInOneDimension} onExit={onExit} />;
}
