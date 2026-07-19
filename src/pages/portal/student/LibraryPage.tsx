import { lazy, Suspense } from 'react';
import type { StudentSession } from '../../../lib/auth';
import { StudySessionProvider } from '../../../providers/StudySessionContext';
import LibraryHubPage from '../../../features/study/pages/LibraryHubPage';

const RealNumberSystem = lazy(() => import('../../../features/study/pages/learning/algebra/grade10/term1/RealNumberSystem'));

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
  return (
    <StudySessionProvider value={{ student_id: session.student_id, school_id: session.school_id }}>
      {innerPage === 'learning-algebra-g10-t1-real-number-system' ? (
        <Suspense fallback={<Spinner />}>
          <RealNumberSystem />
        </Suspense>
      ) : (
        <LibraryHubPage session={session} onNavigate={onNavigate} />
      )}
    </StudySessionProvider>
  );
}
