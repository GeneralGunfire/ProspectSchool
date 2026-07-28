# Site-Wide Performance, Mobile, and Visual-Unification Audit — Plan

**Status:** Planning complete. This is the spec for a multi-batch cleanup pass across the entire site. No feature behavior, content, images, or copy changes — this is presentation/performance/consistency only.

**Scope of this document:** the full site excluding the Study Library (`src/pages/portal/student/LibraryPage.tsx` and everything it renders internally via its own `innerPage` router). Landing page color scheme is explicitly excluded from re-theming (it already looks right) but IS in scope for performance/loading/scroll-smoothness fixes.

---

## Hard constraints (apply to every batch, no exceptions)

1. **Do not change images, content, or functionality.** This is a presentation/performance pass, not a redesign or feature change. If a fix requires touching what an image displays or what text says, stop and flag it instead of doing it.
2. **Do not touch the Study Library.** `src/pages/portal/student/LibraryPage.tsx` and everything reachable through it (registry-driven topic pages, the hub) is out of scope entirely — already built and tested separately.
3. **Do not re-theme the landing page's color scheme.** `src/features/landing/new/*` keeps its current colors. Landing IS in scope for loading/performance/scroll-smoothness/mobile-layout fixes — just not color unification.
4. **Match the student dashboard reference literally as it exists today** — do not "fix" or "clean up" `StudentHomePage.tsx` itself, and do not converge its raw-Tailwind-status-color / rgba-opacity patterns onto the cleaner semantic tokens that exist in `index.css` but aren't actually used there. Copy what the reference *does*, not what it *should* do. `StudentHomePage.tsx` itself is never edited in this pass.
5. **The site must still look like itself.** This is unification and polish, not a redesign. If a page currently looks meaningfully different from the reference in a way that seems intentional (not just inconsistent), flag it rather than silently overriding it.
6. **Don't change library/framework choices without a clear reason.** New dependencies are allowed if genuinely useful for this pass (see "Libraries to consider" below) but shouldn't be added speculatively.

---

## The reference spec — what "match the student dashboard" means concretely

Source: `src/pages/portal/student/StudentHomePage.tsx`, as it exists today. Every page brought into alignment should match these patterns:

**Root wrapper:** outermost element uses a `<portal>-home`-style class (this file: `.student-home`) plus `min-h-full pb-16 relative`.

**Card convention:** `.paper-card` is the universal card container class. Modifier `.focus-emphasis` stacks onto it for hero-emphasis cards. `.edge-glow` is the utility class for primary CTA buttons. Flat utility-first Tailwind on top of a small number of semantic marker classes — no BEM nesting.

**Color tokens actually used (copy these, not the fuller unused palette):**
- `var(--color-accent)`, `var(--color-accent-soft)` — accents, CTAs
- `var(--color-brand-border)` — hairline dividers/borders
- `var(--color-paper-raise)` — subtle raised-panel background fill
- `var(--color-depth)` / `var(--color-depth-soft)` / `var(--color-depth-wash)` — neutral badge states
- Text color: hand-rolled `rgba(31,36,33,0.4/0.45/0.5/0.55/0.6/0.75/0.8)` opacity steps on a charcoal base — NOT the `--color-text-primary/secondary/tertiary` tokens.
- Status/semantic colors: raw Tailwind `text-emerald-500/600`, `text-red-500/600`, `text-amber-600`, `text-blue-600`, `text-violet-700` — NOT `--color-success/warning/error/info`.
- General brand text: `text-brand-dark`, `bg-accent`, `text-stone-400/500/900`.

**Fonts:**
- `var(--font-instrument)` inline style, used sparingly for the one distinctive "display greeting" H1.
- `font-display` Tailwind class for card headline text.
- Default `font-sans` (no explicit class) for body text.

**Responsive pattern:**
- Spacing/padding scales up one increment at `sm:` (e.g. `px-5 sm:px-8`, `p-5 sm:p-6`) — tighter gutters on mobile, more breathing room on desktop.
- Grid/flex direction flips at `md:`/`lg:` (single-column stacked on mobile → multi-column on desktop) — not just resizing, actual layout restructuring.
- Some elements hide below a breakpoint rather than shrink (`hidden sm:inline-flex`, `hidden sm:block`) for secondary/decorative content.
- Only `sm`/`md`/`lg` Tailwind breakpoints used — no `xl`/`2xl`.
- Type scale is mostly static across breakpoints except the hero H1.

**Loading state:** dedicated per-page skeleton (`StudentHomeSkeleton` in this file) that renders the real layout shape (hero band + `Shimmer`-block placeholders matching the real card grid) rather than a generic spinner — mounts immediately, swaps to real content once data resolves, no blank/spinner-only flash.

---

## Known existing issues to fix as part of this pass (not new scope — these ARE the bugs the user reported)

1. **Duplicate `Shimmer` implementation.** `src/shared/components/Shimmer.tsx` is the real shared component; `StudentHomePage.tsx` also defines an identical local copy instead of importing it. Every other page should import the shared one — don't propagate the duplication.
2. **No reusable `Spinner` component exists.** Only a hardcoded inline spinner in `App.tsx`'s top-level Suspense fallback. Pages currently falling back to a blank screen or a generic/inconsistent spinner during data loads need either a proper per-page skeleton (preferred, matching the reference pattern) or, at minimum, a shared, consistent `Spinner` component — extract one from the existing inline markup rather than inventing a new visual style.
3. **No per-inner-page code splitting inside dashboards.** Only the top-level `App.tsx` routes are `React.lazy`-split; everything inside each dashboard (student/teacher/admin/parent) is statically imported, meaning a user pays the bundle cost of every page in that portal upfront. This is very likely a real contributor to "things take way too long to load."
4. **No responsive image-serving pattern exists anywhere** (no `<picture>`/`srcSet` usage) despite the user's note that "most mobile and desktop have different images set." Whatever mechanism currently swaps mobile/desktop images (likely CSS `background-image` swapping or conditional `<img src>` via a breakpoint check) should be audited per-page for whether it's actually working correctly and loading efficiently (not double-loading both images, not causing layout shift).
5. **Landing page performance/scroll smoothness** — the user specifically flagged this. Likely culprits given the page composition (15+ section components per the survey, heavy `motion`/animation usage typical of this codebase's style): unoptimized scroll-triggered animations, large unoptimized media, lack of `will-change`/GPU-acceleration hints on animated elements, or simply too much mounted/animating at once. Needs actual profiling, not just guessing — see verification requirements per batch.

---

## Batches

Each batch is its own build prompt, own verification pass, own checkpoint before the next starts. Order:

### Batch 1 — Landing page
`src/features/landing/new/*` and the top-level `App.tsx` shell/routing. Performance and mobile-layout focus (color scheme excluded per constraint 3). This is the batch the user specifically called out for loading speed and scroll smoothness — treat it as the highest-priority batch to get right.

### Batch 2 — Student portal (excluding Library)
The 14 direct page components under `src/pages/portal/student/*.tsx` (per the survey) minus `LibraryPage.tsx`. Full scope: performance, mobile layout, visual unification against the reference spec above (these pages are *in the same portal as the reference*, so this is the most direct "make it consistent with its own sibling pages" batch).

### Batch 3 — Teacher portal
The 17 routes under `src/pages/portal/teacher/*.tsx` plus `TeacherDashboard.tsx` shell. Full scope, same as Batch 2, but unifying against the student-dashboard reference spec across a different portal (teacher's current visual baseline may differ more from the reference than the student portal's siblings do — expect more real changes here).

### Batch 4 — Admin + Parent portals
Admin: 12 routes under `src/pages/portal/admin/*.tsx` plus `AdminDashboard.tsx` shell. Parent: 8 routes under `src/pages/portal/parent/*.tsx` plus `ParentDashboard.tsx` shell. Combined into one batch since both are smaller than Student/Teacher individually. Note: `SchoolSubjectsAdminPage.tsx` was already recently touched in an unrelated change — read its current state fresh rather than assuming.

---

## Libraries to consider (per user's "install anything useful" instruction)

Evaluate and propose in the Batch 1 prompt's response (don't pre-commit to these — the build session should confirm actual need against real profiling, not install speculatively):

- **A virtualization library** (e.g. `react-window` or similar) — only if any list-heavy page (student directories, marks tables, timetable grids) is rendering large unvirtualized lists that could be a real performance cost. Check before adding.
- **An intersection-observer-based lazy-mount helper** (or hand-rolled via the native `IntersectionObserver` API — may not need a library at all) for landing-page sections below the fold, so `motion` scroll-animations and heavy sections don't all mount/animate-ready at once on initial load.
- **`react-lazy-load-image-component` or equivalent** — only if genuinely useful for the image-loading issues found; native `loading="lazy"` on `<img>` tags may already cover most of this without a dependency.
- Explicitly do NOT add a new animation library — `motion` (Framer Motion successor, already in use throughout) stays as the animation library; performance fixes should tune its usage (fewer simultaneous animations, `viewport={{ once: true }}` on scroll-triggered reveals, appropriate `will-change`), not replace it.

---

## Verification requirements (every batch)

1. `npx tsc --noEmit` clean (pre-existing unrelated errors in shadcn demo components are OK, no new ones).
2. `npx vite build` succeeds.
3. Actual performance verification, not just "should be faster" — use the `run` skill or equivalent to launch the dev server and do a real check: Lighthouse/Chrome DevTools performance trace if tooling allows, or at minimum a description of what was measured before/after (bundle size per route via the build output, count of simultaneous mounted animations, etc.). Vague claims of "this should help" are not acceptable verification for a performance-focused pass.
4. Manual description of what changed on mobile viewport widths (e.g. 375px, 390px) per page touched — since mobile layout is a primary goal, the build session should describe (with specifics, not just "improved") what was actually restructured at small viewports, and confirm no button/interactive-element overlap was introduced or fixed.
5. Confirm zero changes to: image sources, copy/text content, data-fetching logic, business logic, the Study Library.
6. Confirm `StudentHomePage.tsx` itself has zero diff (it's the reference, not a target).

## Cross-reference checklist for each batch's build

- [ ] Every touched page's root wrapper follows the `<portal>-home` + `min-h-full pb-16 relative` pattern.
- [ ] Cards use `.paper-card` (and `.focus-emphasis`/`.edge-glow` where semantically appropriate), not ad-hoc equivalent Tailwind combos.
- [ ] Color usage matches the reference's actual token/raw-Tailwind mix (see spec above) — not the fuller unused semantic palette.
- [ ] `font-display`/`var(--font-instrument)` used the same sparing way as the reference, not applied wholesale.
- [ ] Responsive pattern matches: spacing bump at `sm:`, layout restructuring (not just resizing) at `md:`/`lg:`, only `sm`/`md`/`lg` breakpoints.
- [ ] Every touched page has a real per-page loading skeleton (or at minimum the shared `Spinner`) — no blank-screen-then-pop-in.
- [ ] The shared `Shimmer` component is imported, never redefined locally.
- [ ] No horizontal scrollbars or overlapping buttons at common mobile widths (375-430px range).
- [ ] Landing page color scheme is untouched.
- [ ] `StudentHomePage.tsx` has zero diff.
- [ ] Study Library is completely untouched.
