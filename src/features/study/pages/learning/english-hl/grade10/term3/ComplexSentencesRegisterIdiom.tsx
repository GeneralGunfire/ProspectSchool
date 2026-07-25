// ── English HL, Term 3, Topic 1 page: Complex Sentences, Register and Idiom — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { complexSentencesRegisterIdiom } from '../../../../../data/library/english-hl/grade10/term3/complexSentencesRegisterIdiom';

export default function ComplexSentencesRegisterIdiom({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={complexSentencesRegisterIdiom} onExit={onExit} />;
}
