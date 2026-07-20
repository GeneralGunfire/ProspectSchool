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
 * cream cards vs. the near-black .section-dark-blue gradient). Order:
 * Hero(light, desktop) → LearnerFeatureCards(dark) → CareerPaths(light) →
 * QuoteSection(dark) → StudyLibrary(light) → RoleDestinations(dark) →
 * Pricing(light — dark inverted card as the focal element) →
 * FinalCTA(dark, intentional back-to-back so the closing CTA stays punchy)
 * → Footer(light). Navbar and Hero's mobile video variant are unaffected —
 * mobile hero stays dark, so Navbar keeps a dark-glass style below `md:`
 * and switches to light-glass at `md:` to match the desktop hero.
 */
export default function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <main className="relative min-h-screen landing-page">
      <Navbar onNavigate={onNavigate} />
      <Hero onNavigate={onNavigate} />

      {/* Light section — sits directly under the dark Hero, carrying all
          nine student-account features on the light surface so the two
          don't sit back-to-back dark. */}
      <LearnerFeatureCards onNavigate={onNavigate} />
      <div className="cv-auto"><CareerPaths onNavigate={onNavigate} /></div>

      <div className="cv-auto"><QuoteSection /></div>

      <div className="cv-auto"><StudyLibrary onNavigate={onNavigate} /></div>
      <div className="cv-auto"><RoleDestinations onNavigate={onNavigate} /></div>
      <div className="cv-auto"><Pricing onNavigate={onNavigate} /></div>
      <div className="cv-auto"><FinalCTA onNavigate={onNavigate} /></div>
      <div className="cv-auto"><Footer onNavigate={onNavigate} /></div>
    </main>
  );
}
