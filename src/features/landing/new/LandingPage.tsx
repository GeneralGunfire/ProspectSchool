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

      <div style={{ background: 'linear-gradient(180deg, #F1F5F9 0%, #FAF9F6 35%, #F8FAFC 100%)' }}>
        <AudienceSection onNavigate={onNavigate} />
        <CareerPaths onNavigate={onNavigate} />
        <StudentDeepDive onNavigate={onNavigate} />
        <StudyLibrary onNavigate={onNavigate} />
        <TeacherTools onNavigate={onNavigate} />
      </div>

      <QuoteSection />

      <div style={{ background: 'linear-gradient(180deg, #F1F5F9 0%, #FAF9F6 40%, #FAF9F6 100%)' }}>
        <Pricing onNavigate={onNavigate} />
        <FinalCTA onNavigate={onNavigate} />
        <Footer onNavigate={onNavigate} />
      </div>
    </main>
  );
}
