// ── English HL, Term 2, Topic 4 page: Analysing Short Stories — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { analysingShortStories } from '../../../../../data/library/english-hl/grade10/term2/analysingShortStories';

export default function AnalysingShortStories({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={analysingShortStories} onExit={onExit} />;
}
