// ── English HL, Term 1, Topic 1 page: Word Classes and Sentence Structures — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { wordClassesAndSentenceStructures } from '../../../../../data/library/english-hl/grade10/term1/wordClassesAndSentenceStructures';

export default function WordClassesAndSentenceStructures({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={wordClassesAndSentenceStructures} onExit={onExit} />;
}
