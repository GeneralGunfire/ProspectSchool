// ── Life Sciences, Term 3, Topic 1 page: The Biosphere and Biomes — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { biosphereAndBiomes } from '../../../../../data/library/life-sci/grade10/term3/biosphereAndBiomes';

export default function BiosphereAndBiomes({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={biosphereAndBiomes} onExit={onExit} />;
}
