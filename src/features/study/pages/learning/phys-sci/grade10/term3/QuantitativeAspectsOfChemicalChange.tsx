// ── Physical Sciences, Term 3, Topic 1 page: Quantitative Aspects of Chemical Change — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { quantitativeAspectsOfChemicalChange } from '../../../../../data/library/phys-sci/grade10/term3/quantitativeAspectsOfChemicalChange';

export default function QuantitativeAspectsOfChemicalChange({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={quantitativeAspectsOfChemicalChange} onExit={onExit} />;
}
