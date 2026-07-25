// ── Term 3, Topic 1 page: Measures of Central Tendency & Spread — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { centralTendencySpread } from '../../../../../data/library/algebra/grade10/term3/centralTendencySpread';

export default function CentralTendencySpread({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={centralTendencySpread} onExit={onExit} />;
}
