// ── English HL, Term 3, Topic 3 page: Structuring a Literary Response — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { structuringLiteraryResponse } from '../../../../../data/library/english-hl/grade10/term3/structuringLiteraryResponse';

export default function StructuringLiteraryResponse({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={structuringLiteraryResponse} onExit={onExit} />;
}
