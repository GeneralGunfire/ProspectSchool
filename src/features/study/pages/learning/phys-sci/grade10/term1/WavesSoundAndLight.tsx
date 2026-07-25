// ── Physical Sciences, Term 1, Topic 1 page: Waves, Sound and Light — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { wavesSoundAndLight } from '../../../../../data/library/phys-sci/grade10/term1/wavesSoundAndLight';

export default function WavesSoundAndLight({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={wavesSoundAndLight} onExit={onExit} />;
}
