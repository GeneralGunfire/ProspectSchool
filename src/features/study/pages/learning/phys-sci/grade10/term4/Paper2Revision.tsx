// ── Physical Sciences, Term 4 page: Paper 2 Revision — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { paper2Revision } from '../../../../../data/library/phys-sci/grade10/term4/paper2Revision';

export default function Paper2Revision({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={paper2Revision} onExit={onExit} />;
}
