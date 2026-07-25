// ── Term 4, Topic 3 page: Function Transformations and Inverses — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { functionTransformationsInverses } from '../../../../../data/library/algebra/grade10/term4/functionTransformationsInverses';

export default function FunctionTransformationsInverses({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={functionTransformationsInverses} onExit={onExit} />;
}
