// ── Life Sciences, Term 3, Topic 3 page: Human Impact on the Environment — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { humanImpactOnTheEnvironment } from '../../../../../data/library/life-sci/grade10/term3/humanImpactOnTheEnvironment';

export default function HumanImpactOnTheEnvironment({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={humanImpactOnTheEnvironment} onExit={onExit} />;
}
