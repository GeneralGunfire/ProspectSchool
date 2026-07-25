// ── Topic 4 page: Factorisation — thin wrapper around LessonShell ────────────

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { factorisation } from '../../../../../data/library/algebra/grade10/term1/factorisation';

export default function Factorisation({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={factorisation} onExit={onExit} />;
}
