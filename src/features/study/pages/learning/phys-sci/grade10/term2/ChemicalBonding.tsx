// ── Physical Sciences, Term 2, Topic 3 page: Chemical Bonding — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { chemicalBonding } from '../../../../../data/library/phys-sci/grade10/term2/chemicalBonding';

export default function ChemicalBonding({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={chemicalBonding} onExit={onExit} />;
}
