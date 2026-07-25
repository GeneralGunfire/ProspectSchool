// ── English HL, Term 4, Topic 1 page: Visual Literacy and Persuasive Techniques — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { visualLiteracyAndPersuasiveTechniques } from '../../../../../data/library/english-hl/grade10/term4/visualLiteracyAndPersuasiveTechniques';

export default function VisualLiteracyAndPersuasiveTechniques({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={visualLiteracyAndPersuasiveTechniques} onExit={onExit} />;
}
