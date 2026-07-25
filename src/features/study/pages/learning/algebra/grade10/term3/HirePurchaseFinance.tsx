// ── Term 3, Topic 6 page: Hire Purchase & Financial Applications — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { hirePurchaseFinance } from '../../../../../data/library/algebra/grade10/term3/hirePurchaseFinance';

export default function HirePurchaseFinance({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={hirePurchaseFinance} onExit={onExit} />;
}
