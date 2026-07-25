// ── English HL, Term 1, Topic 4 page: Introduction to Poetic Devices and Theme — thin wrapper around LessonShell ──

import { LessonShell } from '../../../../../components/lesson/LessonShell';
import { poeticDevicesAndTheme } from '../../../../../data/library/english-hl/grade10/term1/poeticDevicesAndTheme';

export default function PoeticDevicesAndTheme({ onExit }: { onExit?: () => void }) {
  return <LessonShell content={poeticDevicesAndTheme} onExit={onExit} />;
}
