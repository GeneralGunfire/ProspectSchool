// A faint film-grain texture — breaks up otherwise flat, solid-color dark
// sections so they read as tactile rather than a plain vector gradient.
// Pure CSS/SVG, no image request.
const NOISE_SVG =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>";

export const Grain = ({ opacity = 0.05 }: { opacity?: number }) => (
  <div
    aria-hidden
    className="pointer-events-none absolute inset-0 mix-blend-overlay"
    style={{ backgroundImage: `url("${NOISE_SVG}")`, opacity }}
  />
);
