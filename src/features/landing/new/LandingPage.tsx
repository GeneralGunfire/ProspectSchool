import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { StatsBar } from './StatsBar';
import { AudienceSection } from './AudienceSection';
import { StudentDeepDive } from './StudentDeepDive';
import { StudyLibrary } from './StudyLibrary';
import { TeacherTools } from './TeacherTools';
import { QuoteSection } from './QuoteSection';
import { Pricing } from './Pricing';
import { FinalCTA } from './FinalCTA';
import { Footer } from './Footer';

type Page = string;

interface LandingPageProps {
  onNavigate: (page: Page) => void;
}

/**
 * Prospect Landing Page
 * Wraps all sections and threads onNavigate through for portal/quiz CTAs.
 */
export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <main className="relative min-h-screen" style={{ background: '#F5F0E8' }}>
      <Navbar onNavigate={onNavigate} />
      <Hero onNavigate={onNavigate} />
      <StatsBar />
      <AudienceSection onNavigate={onNavigate} />
      <StudentDeepDive onNavigate={onNavigate} />
      <StudyLibrary onNavigate={onNavigate} />
      <TeacherTools onNavigate={onNavigate} />
      <QuoteSection />
      <Pricing onNavigate={onNavigate} />
      <FinalCTA onNavigate={onNavigate} />
      <Footer onNavigate={onNavigate} />
    </main>
  );
}
