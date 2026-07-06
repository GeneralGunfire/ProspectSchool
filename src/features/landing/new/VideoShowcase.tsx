import { useRef } from 'react';
import { FadeIn } from './Animations';

// The source file is a full 5-minute walkthrough — for an ambient loop we only
// want a short, visually-active slice of it, not the whole narrated video.
const LOOP_START = 4;
const LOOP_END = 16;

/**
 * Product showcase — a short looping slice of the demo video, contained in a
 * small framed card (not full-bleed) so it's easy to relocate later. Swap the
 * src / LOOP_START / LOOP_END below once a real short demo cut exists;
 * video1.mp4 is the closest thing available today.
 */
export const VideoShowcase = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleLoaded = () => {
    const v = videoRef.current;
    if (v) v.currentTime = LOOP_START;
  };

  // Self-correcting: whatever event actually managed to seek us, timeupdate
  // fires often enough during playback to snap back inside the loop window
  // even if the initial loadedmetadata seek didn't stick (e.g. because not
  // enough data was buffered yet to seek precisely with preload="metadata").
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (v && (v.currentTime >= LOOP_END || v.currentTime < LOOP_START)) {
      v.currentTime = LOOP_START;
    }
  };

  return (
    <section className="relative bg-brand-bg py-24 px-5 overflow-hidden">
      <FadeIn className="text-center mb-12">
        <span className="eyebrow">SEE IT IN ACTION</span>
        <h2 className="text-brand-dark text-[clamp(1.75rem,3.5vw,2.5rem)] tracking-tight mt-3 leading-[1.2] font-black">
          Everything your school needs, in one dashboard.
        </h2>
      </FadeIn>

      <div className="relative max-w-xl mx-auto">
        <FadeIn delay={0.1}>
          <div
            className="relative rounded-2xl overflow-hidden border border-amber-300/25"
            style={{ boxShadow: '0 20px 60px -15px rgba(28,25,23,0.25), 0 0 40px -8px color-mix(in srgb, var(--color-accent) 30%, transparent)' }}
          >
            <div className="relative overflow-hidden bg-black aspect-video">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                preload="metadata"
                onLoadedMetadata={handleLoaded}
                onTimeUpdate={handleTimeUpdate}
                className="w-full h-full object-cover"
                style={{ filter: 'saturate(1.15) contrast(1.05)' }}
                src="/videos/video1.mp4"
              />
              {/* Single soft warm wash — ties the footage back to the site's
                  amber/dark palette without muddying it like a double-blend did. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 mix-blend-soft-light"
                style={{ background: 'color-mix(in srgb, var(--color-accent) 22%, transparent)' }}
              />
              {/* Edge vignette so the frame reads as one contained object */}
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_36px_14px_rgba(0,0,0,0.4)]" />
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
};
