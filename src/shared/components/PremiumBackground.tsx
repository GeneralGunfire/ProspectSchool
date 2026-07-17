import { Grain } from './Grain';

// Sits behind all page content: multiple radial gradients, blurred glow
// blobs that slowly drift/rotate, a barely-visible grid, and film grain.
// Pure CSS animation (already covered by the site-wide prefers-reduced-motion
// rule in index.css) — no scroll listeners, so it costs nothing to have
// mounted for the whole page. Never opaque enough to compete with content;
// every layer here is either very low opacity or heavily blurred.
export const PremiumBackground = () => (
  <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" style={{ background: '#eaebec' }}>
    {/* -z-10 is required, not optional: `position: fixed` puts this element in
        the browser's "positioned, z-index:auto" paint layer, which renders
        ABOVE ordinary (non-positioned) content regardless of DOM order — so
        without a negative z-index, this silently painted over any section
        whose own container isn't itself `position: relative` (e.g. the
        StudentDeepDive stat card had no `position` set and vanished behind
        this exact div). `main` has no opaque background of its own (removed
        deliberately in LandingPage.tsx), so -z-10 here correctly drops this
        below all in-flow content instead of being hidden behind a parent bg. */}
    {/* Faint grid */}
    <div className="absolute inset-0 bg-grid-faint opacity-60" style={{ maskImage: 'linear-gradient(to bottom, black, transparent 70%)' }} />

    {/* Glow blobs — warm gold + dark, drifting at different rates.
        Animation is desktop-only (md:animate-*): a blurred element being
        transformed every frame forces the browser to re-rasterize the blur
        bitmap each time, which is cheap on desktop GPUs but was a real
        source of scroll jank on mobile. The blobs stay visible on mobile
        as a static backdrop, just without the continuous motion. */}
    <div
      className="absolute -top-40 -left-32 w-175 h-175 rounded-full blur-3xl opacity-30 md:animate-drift md:animate-glow-rotate"
      style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 40%, transparent), transparent 70%)' }}
    />
    <div
      className="absolute top-[30vh] -right-40 w-150 h-150 rounded-full blur-3xl opacity-20 md:animate-drift-slow"
      style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--color-brand-dark) 30%, transparent), transparent 70%)' }}
    />
    <div
      className="absolute bottom-[-10%] left-1/3 w-130 h-130 rounded-full blur-3xl opacity-20 md:animate-drift"
      style={{ background: 'radial-gradient(circle, color-mix(in srgb, var(--color-accent) 30%, transparent), transparent 70%)', animationDelay: '-8s' }}
    />

    <Grain opacity={0.035} />
  </div>
);
