// ── Term 2, Topic 2 page: Solving Right-Angled Triangles — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { solvingRightAngledTriangles } from '../../../../../data/library/algebra/grade10/term2/solvingRightAngledTriangles';

export default function SolvingRightAngledTriangles({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={solvingRightAngledTriangles} onExit={onExit} />;
}
