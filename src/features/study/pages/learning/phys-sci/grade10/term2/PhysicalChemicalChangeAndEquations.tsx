// ── Physical Sciences, Term 2, Topic 4 page: Physical/Chemical Change and Equations — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { physicalChemicalChangeAndEquations } from '../../../../../data/library/phys-sci/grade10/term2/physicalChemicalChangeAndEquations';

export default function PhysicalChemicalChangeAndEquations({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={physicalChemicalChangeAndEquations} onExit={onExit} />;
}
