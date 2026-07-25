// ── English HL, Term 3, Topic 2 page: Reading Formal and Critical Texts — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { readingFormalAndCriticalTexts } from '../../../../../data/library/english-hl/grade10/term3/readingFormalAndCriticalTexts';

export default function ReadingFormalAndCriticalTexts({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={readingFormalAndCriticalTexts} onExit={onExit} />;
}
