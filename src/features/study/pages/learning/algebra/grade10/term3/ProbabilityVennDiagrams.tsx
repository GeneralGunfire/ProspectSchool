// ── Term 3, Topic 3 page: Probability Basics & Venn Diagrams — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { probabilityVennDiagrams } from '../../../../../data/library/algebra/grade10/term3/probabilityVennDiagrams';

export default function ProbabilityVennDiagrams({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={probabilityVennDiagrams} onExit={onExit} />;
}
