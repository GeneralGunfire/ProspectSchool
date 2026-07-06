import { PremiumBackground } from '../../../shared/components/PremiumBackground';
import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { StatsBar } from './StatsBar';
import { HowItWorks } from './HowItWorks';
import { AudienceSection } from './AudienceSection';
import { CareerPaths } from './CareerPaths';
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
 *
 * Background strategy: the page is light end-to-end (cream, matching the
 * brand background) rather than alternating dark/light blocks — texture and
 * "life" come from the Constellation node/line decoration scattered across
 * several sections and the gradient washes below, not from solid dark fills.
 * QuoteSection is the one deliberate dark beat on the page, for contrast.
 */
export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <main className="relative min-h-screen">
      <PremiumBackground />
      <Navbar onNavigate={onNavigate} />
      <Hero onNavigate={onNavigate} />
      <HowItWorks />
      <StatsBar />

      <div style={{ background: 'linear-gradient(180deg, #FBF2E2 0%, #F5F0E8 35%, #EEF3F1 100%)' }}>
        <AudienceSection onNavigate={onNavigate} />
        <CareerPaths onNavigate={onNavigate} />
        <StudentDeepDive onNavigate={onNavigate} />
        <StudyLibrary onNavigate={onNavigate} />
        <TeacherTools onNavigate={onNavigate} />
      </div>

      <QuoteSection />

      <div style={{ background: 'linear-gradient(180deg, #FBF2E2 0%, #F5F0E8 40%, #F5F0E8 100%)' }}>
        <Pricing onNavigate={onNavigate} />
        <FinalCTA onNavigate={onNavigate} />
        <Footer onNavigate={onNavigate} />
      </div>
    </main>
  );
}
