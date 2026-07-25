// ── Physical Sciences, Term 4 page: Paper 1 Revision — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { paper1Revision } from '../../../../../data/library/phys-sci/grade10/term4/paper1Revision';

export default function Paper1Revision({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={paper1Revision} onExit={onExit} />;
}
