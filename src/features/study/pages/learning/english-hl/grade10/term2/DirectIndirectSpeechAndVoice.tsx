// ── English HL, Term 2, Topic 1 page: Direct/Indirect Speech and Active/Passive Voice — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { directIndirectSpeechAndVoice } from '../../../../../data/library/english-hl/grade10/term2/directIndirectSpeechAndVoice';

export default function DirectIndirectSpeechAndVoice({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={directIndirectSpeechAndVoice} onExit={onExit} />;
}
