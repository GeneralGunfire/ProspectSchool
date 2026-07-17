import { Navbar } from './Navbar';
import { Hero } from './Hero';
import { LearnerFeatureCards } from './LearnerFeatureCards';
import { RoleDestinations } from './RoleDestinations';
import { CareerPaths } from './CareerPaths';
import { StudyLibrary } from './StudyLibrary';
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
    <main className="relative min-h-screen landing-page">
      <Navbar onNavigate={onNavigate} />
      <Hero onNavigate={onNavigate} />

      <LearnerFeatureCards onNavigate={onNavigate} />
      <CareerPaths onNavigate={onNavigate} />
      <div className="cv-auto"><StudyLibrary onNavigate={onNavigate} /></div>
      <div className="cv-auto"><RoleDestinations onNavigate={onNavigate} /></div>

      <QuoteSection />

      <div className="cv-auto"><Pricing onNavigate={onNavigate} /></div>
      <div className="cv-auto"><FinalCTA onNavigate={onNavigate} /></div>
      <div className="cv-auto"><Footer onNavigate={onNavigate} /></div>
    </main>
  );
}
