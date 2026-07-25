// ── Term 4, Topic 1 page: Arithmetic Sequences — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { arithmeticSequences } from '../../../../../data/library/algebra/grade10/term4/arithmeticSequences';

export default function ArithmeticSequences({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={arithmeticSequences} onExit={onExit} />;
}
