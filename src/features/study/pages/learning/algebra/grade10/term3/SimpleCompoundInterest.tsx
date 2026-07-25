// ── Term 3, Topic 5 page: Simple and Compound Interest — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { simpleCompoundInterest } from '../../../../../data/library/algebra/grade10/term3/simpleCompoundInterest';

export default function SimpleCompoundInterest({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={simpleCompoundInterest} onExit={onExit} />;
}
