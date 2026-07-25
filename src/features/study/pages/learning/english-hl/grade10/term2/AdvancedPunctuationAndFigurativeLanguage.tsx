// ── English HL, Term 2, Topic 2 page: Advanced Punctuation and Figurative Language — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { advancedPunctuationAndFigurativeLanguage } from '../../../../../data/library/english-hl/grade10/term2/advancedPunctuationAndFigurativeLanguage';

export default function AdvancedPunctuationAndFigurativeLanguage({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={advancedPunctuationAndFigurativeLanguage} onExit={onExit} />;
}
