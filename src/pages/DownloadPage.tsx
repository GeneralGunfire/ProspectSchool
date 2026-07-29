import { motion, useReducedMotion } from 'motion/react';
import { Monitor, Apple, Smartphone, Download, Zap, WifiOff, RefreshCw, ShieldCheck, ChevronDown, LucideIcon } from 'lucide-react';
import { Navbar } from '../features/landing/new/Navbar';
import { Footer } from '../features/landing/new/Footer';
import { FadeIn, useSpotlight, SpotlightGlow } from '../features/landing/new/Animations';
import { MagicCard } from '../features/downloads/components/MagicCard';

type Page = string;

const EASE = [0.23, 1, 0.32, 1] as const;

// Pinned to specific release tags, NOT GitHub's /releases/latest/download/
// shortcut — that endpoint resolves against the single most recent release
// *repo-wide*, not "latest per platform". Desktop and Android release
// independently (desktop-v*, android-v* tags), so whichever shipped last
// silently broke the other platform's "latest" link once both existed
// (confirmed: an android-v0.1.0 release after desktop-v0.1.4 made the
// Windows link 404). Update BOTH values by hand after cutting a new
// desktop-v*/android-v* tag — see DESKTOP.md / MOBILE.md for the exact
// filenames (Windows: derived from tauri.conf.json's "version"; Android:
// android/app/build.gradle's custom outputFileName, Prospect-<versionName>-
// debug.apk — was the Gradle-default app-debug.apk until this was added).
const DOWNLOAD_URLS: { windows?: string; android?: string } = {
  windows: 'https://github.com/GeneralGunfire/ProspectSchool/releases/download/desktop-v0.1.5/Prospect_0.1.0_x64-setup.exe',
  android: 'https://github.com/GeneralGunfire/ProspectSchool/releases/download/android-v0.1.2/Prospect-1.0-debug.apk',
};

// ── Hero — same treatment as the landing page Hero (huge display headline,
// gradient accent phrase, light surface), but static/no video since there's
// no footage for this yet. First section, so page starts light → the
// platform-cards section right below goes dark to keep the alternation.
const DownloadHero = () => {
  const reduced = useReducedMotion();
  return (
    <section
      className="relative overflow-hidden min-h-screen flex items-center justify-center px-5 py-24"
      style={{
        backgroundImage: 'url(/backgrounds/hero-bg-desktop.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(70% 60% at 50% 35%, color-mix(in srgb, var(--color-accent) 8%, transparent), transparent 70%)' }}
      />
      <motion.div
        initial={reduced ? undefined : { opacity: 0, y: 16 }}
        animate={reduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="relative z-10 max-w-4xl mx-auto text-center"
      >
        <FadeIn delay={0.1}>
          <span className="eyebrow">DESKTOP APP</span>
        </FadeIn>
        <FadeIn delay={0.2}>
          <h1
            className="text-brand-dark text-[clamp(2.75rem,13vw,5.5rem)] leading-none tracking-[-0.03em] font-extrabold text-balance mt-5"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span className="relative inline-block">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-sky-500 via-sky-600 to-blue-600">
                Downloads.
              </span>
              <svg
                aria-hidden="true"
                viewBox="0 0 320 14"
                className="absolute left-0 -bottom-3 w-full h-3 text-amber-500/70"
                preserveAspectRatio="none"
              >
                <path d="M2 9C60 3 180 2 318 8" stroke="currentColor" strokeWidth="3.5" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </h1>
        </FadeIn>
        <FadeIn delay={0.3}>
          <p className="mt-6 sm:mt-8 text-brand-eyebrow text-[15px] sm:text-[18px] leading-relaxed max-w-2xl mx-auto px-2">
            Prospect, installed on your machine. Same account, same marks and data — just faster to open, and it stays up to date on its own.
          </p>
        </FadeIn>
      </motion.div>

      <FadeIn delay={0.6} className="absolute bottom-8 left-0 right-0 flex justify-center">
        <ChevronDown className="w-5 h-5 text-brand-eyebrow/40 animate-bounce" aria-hidden="true" />
      </FadeIn>
    </section>
  );
};

interface Platform {
  id: keyof typeof DOWNLOAD_URLS | 'mac' | 'android';
  label: string;
  icon: LucideIcon;
  blurb: string;
  note: string;
}

const platforms: Platform[] = [
  {
    id: 'windows',
    label: 'Windows',
    icon: Monitor,
    blurb: 'Installer for Windows 10 and 11.',
    note: "Unsigned build — click \"More info\" → \"Run anyway\" if SmartScreen prompts you.",
  },
  {
    id: 'mac',
    label: 'Mac',
    icon: Apple,
    blurb: 'Native app for macOS, Apple Silicon and Intel.',
    note: 'Right-click the app → Open on first launch to bypass Gatekeeper.',
  },
  {
    id: 'android',
    label: 'Android',
    icon: Smartphone,
    blurb: 'Install directly as an APK, no Play Store needed.',
    note: "You'll need to allow installs from unknown sources.",
  },
];

const PlatformCard = ({ platform, index }: { platform: Platform; index: number }) => {
  const Icon = platform.icon;
  const downloadUrl = platform.id === 'windows' ? DOWNLOAD_URLS.windows
    : platform.id === 'android' ? DOWNLOAD_URLS.android
    : undefined;
  const available = Boolean(downloadUrl);

  return (
    <FadeIn delay={index * 0.08}>
      <MagicCard
        className="card-premium-dark paper-card-dark overflow-hidden rounded-2xl p-6 sm:p-8 flex flex-col h-full"
        gradientColor={available ? '#38bdf8' : '#64748b'}
      >
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
            <Icon className="w-5.5 h-5.5 text-white" />
          </div>
          <span
            className={`text-[10px] font-black uppercase tracking-[0.14em] px-2.5 py-1 rounded-full ${
              available
                ? 'bg-linear-to-r from-sky-500/20 to-blue-600/20 text-sky-300 border border-sky-400/30'
                : 'bg-white/8 text-white/40 border border-white/10'
            }`}
          >
            {available ? 'Available' : 'Coming soon'}
          </span>
        </div>

        <h3 className="font-black text-[19px] tracking-tight text-white mt-5">{platform.label}</h3>
        <p className="text-[13px] leading-relaxed font-medium text-white/60 mt-2 flex-1">{platform.blurb}</p>

        {available ? (
          <a
            href={downloadUrl}
            download
            rel="noopener"
            className="mt-6 w-full rounded-xl px-6 py-3 font-black text-[13px] tracking-wide transition-all flex items-center justify-center gap-2 bg-linear-to-r from-sky-500 via-sky-600 to-blue-600 text-white hover:brightness-110 active:scale-[0.97] cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Download for {platform.label}
          </a>
        ) : (
          <button
            disabled
            className="mt-6 w-full rounded-xl px-6 py-3 font-black text-[13px] tracking-wide flex items-center justify-center gap-2 bg-white/8 text-white/35 cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            Coming soon
          </button>
        )}

        <p className="mt-3.5 text-[11px] text-white/40 font-medium leading-snug">{platform.note}</p>
      </MagicCard>
    </FadeIn>
  );
};

const PlatformCardsSection = () => (
  <section className="section-dark-blue py-16 sm:py-20 lg:py-28 px-5">
    <div className="relative max-w-5xl mx-auto">
      <FadeIn className="text-center max-w-xl mx-auto mb-10 sm:mb-12 lg:mb-16">
        <span className="eyebrow" style={{ borderColor: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)' }}>
          CHOOSE YOUR PLATFORM
        </span>
        <h2 className="text-white text-[clamp(1.65rem,6.5vw,2.75rem)] tracking-tight mt-3 leading-[1.15] font-black">
          Available for every device.
        </h2>
        <p className="mt-4 text-slate-400 text-[13.5px] sm:text-[15px] leading-relaxed max-w-md mx-auto font-medium px-2">
          Windows and Android are ready now — Mac is on the way.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {platforms.map((platform, i) => (
          <PlatformCard key={platform.id} platform={platform} index={i} />
        ))}
      </div>
    </div>
  </section>
);

// ── "Why desktop" — light section, mirrors LearnerFeatureCards' pacing but
// with a lighter card style since the surrounding section is light, not dark.
interface Reason {
  title: string;
  description: string;
  icon: LucideIcon;
}

const reasons: Reason[] = [
  {
    title: 'Launches instantly',
    description: 'Pinned to your taskbar or dock — open Prospect in one click, no browser tabs to hunt through.',
    icon: Zap,
  },
  {
    title: 'Feels native',
    description: 'A real desktop window with its own icon and shortcuts, not a browser tab pretending to be an app.',
    icon: Monitor,
  },
  {
    title: 'Updates itself',
    description: 'New versions install automatically in the background — you always have the latest features.',
    icon: RefreshCw,
  },
  {
    title: 'Same secure login',
    description: 'Your school account, marks, and data work exactly as they do on the web — nothing new to set up.',
    icon: ShieldCheck,
  },
];

const ReasonTile = ({ reason }: { reason: Reason }) => {
  const Icon = reason.icon;
  const { ref, onMouseEnter, onMouseMove } = useSpotlight<HTMLDivElement>();
  return (
    <div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseMove={onMouseMove}
      className="group group/spot relative overflow-hidden rounded-2xl p-6"
      style={{
        background: 'color-mix(in srgb, white 65%, transparent)',
        backdropFilter: 'blur(16px) saturate(160%)',
        WebkitBackdropFilter: 'blur(16px) saturate(160%)',
        border: '1px solid color-mix(in srgb, white 60%, var(--color-brand-border))',
        boxShadow: '0 8px 24px -12px rgba(11,29,51,0.12)',
      }}
    >
      <SpotlightGlow />
      <div className="w-11 h-11 rounded-xl bg-brand-dark/5 flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
        <Icon className="w-5 h-5 text-brand-dark" />
      </div>
      <h4 className="font-black text-[14px] tracking-tight text-brand-dark">{reason.title}</h4>
      <p className="text-[13px] leading-relaxed font-medium text-brand-eyebrow/80 mt-2">{reason.description}</p>
    </div>
  );
};

const WhyDesktopSection = () => (
  <section className="bg-brand-bg py-16 sm:py-20 lg:py-28 px-5">
    <div className="relative max-w-5xl mx-auto">
      <FadeIn className="text-center max-w-xl mx-auto mb-10 sm:mb-12 lg:mb-16">
        <span className="eyebrow">WHY GO NATIVE</span>
        <h2 className="text-brand-dark text-[clamp(1.65rem,6.5vw,2.75rem)] tracking-tight mt-3 leading-[1.15] font-black">
          The same Prospect, built to feel faster.
        </h2>
        <p className="mt-4 text-brand-eyebrow text-[13.5px] sm:text-[15px] leading-relaxed max-w-md mx-auto font-medium px-2">
          A thin wrapper around the platform you already know — with the conveniences a browser tab can't give you.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {reasons.map((reason, i) => (
          <FadeIn key={reason.title} delay={i * 0.06}>
            <ReasonTile reason={reason} />
          </FadeIn>
        ))}
      </div>
    </div>
  </section>
);

// ── Closing note — dark strip, small trust/context line before the Footer,
// mirrors the tone of Pricing's dark focal card without duplicating it.
const NoteSection = () => (
  <section className="section-dark-blue py-14 sm:py-16 lg:py-20 px-5">
    <FadeIn className="relative max-w-2xl mx-auto text-center">
      <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mx-auto">
        <WifiOff className="w-5 h-5 text-white/70" />
      </div>
      <h3 className="text-white text-[clamp(1.3rem,5vw,1.9rem)] tracking-tight mt-5 leading-[1.2] font-black">
        Not sure which to pick?
      </h3>
      <p className="mt-3 text-slate-400 text-[13.5px] sm:text-[14px] leading-relaxed max-w-md mx-auto font-medium px-2">
        The web app at this same address always works too — the desktop app is just a faster, native front door to it, no download required if you'd rather not.
      </p>
    </FadeIn>
  </section>
);

export default function DownloadPage({ onNavigate }: { onNavigate: (p: Page) => void }) {
  return (
    <main className="relative min-h-screen landing-page">
      <Navbar onNavigate={onNavigate} />
      <DownloadHero />
      <div className="cv-auto"><PlatformCardsSection /></div>
      <div className="cv-auto"><WhyDesktopSection /></div>
      <div className="cv-auto"><NoteSection /></div>
      <div className="cv-auto"><Footer onNavigate={onNavigate} /></div>
    </main>
  );
}
