// ── Life Sciences, Term 3, Topic 2 page: Ecosystems and Ecological Relationships — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { ecosystemsAndEcologicalRelationships } from '../../../../../data/library/life-sci/grade10/term3/ecosystemsAndEcologicalRelationships';

export default function EcosystemsAndEcologicalRelationships({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={ecosystemsAndEcologicalRelationships} onExit={onExit} />;
}
