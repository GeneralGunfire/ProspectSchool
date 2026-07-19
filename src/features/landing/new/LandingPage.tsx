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
 * Background strategy: sections alternate light/dark down the page (light
 * cream cards vs. the near-black gradient used in the Hero video, defined
 * as .section-dark-blue in index.css and inlined on QuoteSection/FinalCTA).
 * No two dark sections sit back-to-back — each is separated by at least
 * one light section so the alternation stays legible while scrolling.
 */
export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <main className="relative min-h-screen landing-page">
      <Navbar onNavigate={onNavigate} />
      <Hero onNavigate={onNavigate} />

      <LearnerFeatureCards onNavigate={onNavigate} />
      <CareerPaths onNavigate={onNavigate} />

      <QuoteSection />

      <div className="cv-auto"><StudyLibrary onNavigate={onNavigate} /></div>
      <div className="cv-auto"><RoleDestinations onNavigate={onNavigate} /></div>
      <div className="cv-auto"><Pricing onNavigate={onNavigate} /></div>
      <div className="cv-auto"><FinalCTA onNavigate={onNavigate} /></div>
      <div className="cv-auto"><Footer onNavigate={onNavigate} /></div>
    </main>
  );
}
