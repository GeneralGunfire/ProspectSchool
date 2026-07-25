// ── English HL, Term 1, Topic 2 page: Tenses and Punctuation — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { tensesAndPunctuation } from '../../../../../data/library/english-hl/grade10/term1/tensesAndPunctuation';

export default function TensesAndPunctuation({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={tensesAndPunctuation} onExit={onExit} />;
}
