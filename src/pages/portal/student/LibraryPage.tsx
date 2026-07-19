import { lazy, Suspense, type ComponentType } from 'react';
import type { StudentSession } from '../../../lib/auth';
import { StudySessionProvider } from '../../../providers/StudySessionContext';
import LibraryHubPage from '../../../features/study/pages/LibraryHubPage';

// ── routeId -> lazy page component ────────────────────────────────────────────
// Keyed by TopicRegistryEntry.routeId (see data/library/registry.ts). Adding a
// new topic means adding one entry to the registry AND one entry here — no
// other routing code changes.
const TOPIC_PAGES: Record<string, ComponentType<{ onExit?: () => void }>> = {
  'learning-algebra-g10-t1-real-number-system': lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term1/RealNumberSystem')),
};

interface LibraryPageProps {
  session: StudentSession;
  innerPage: string;
  onNavigate: (page: string) => void;
}

const Spinner = () => (
  <div className="flex items-center justify-center py-24">
    <div className="w-5 h-5 border-2 border-brand-border border-t-accent rounded-full animate-spin" />
  </div>
);

export default function LibraryPage({ session, innerPage, onNavigate }: LibraryPageProps) {
  const TopicPage = TOPIC_PAGES[innerPage];

  return (
    <StudySessionProvider value={{ student_id: session.student_id, school_id: session.school_id }}>
      {TopicPage ? (
        <Suspense fallback={<Spinner />}>
          <TopicPage onExit={() => onNavigate('library')} />
        </Suspense>
      ) : (
        <LibraryHubPage session={session} onNavigate={onNavigate} />
      )}
    </StudySessionProvider>
  );
}
