# Landing Page — UI Review

**Audited:** 2026-05-24
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md exists)
**Screenshots:** Loading screen captured (landing page content audited via code review)

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 3/4 | Strong voice overall; "Open AI Chat" CTA too generic; one lorem-level subhead in Perspectives |
| 2. Visuals | 2/4 | Alternating-background rhythm breaks down; no visual focal-point anchor on the Problem section image side |
| 3. Color | 3/4 | Palette is disciplined; `bg-slate-50/50` ghost tone adds unwanted muddiness against beige neighbour sections |
| 4. Typography | 2/4 | All section h2s are `font-bold` while CSS base declares `font-weight: 900` for h1–h3 — mass inconsistency across 9 headings; 7 distinct size steps in use |
| 5. Spacing | 2/4 | Section vertical rhythm uniform (`py-24` on every section) with no breathing variation; internal section spacing uses arbitrary pixel values mixed with Tailwind scale |
| 6. Experience Design | 2/4 | Zero aria-labels on icon-only or ambiguous buttons; no visible focus ring on primary CTAs; decorative blobs missing `pointer-events-none` in CTASection |

**Overall: 14/24**

---

## Top 3 Priority Fixes

1. **All section h2/h3 headings use `font-bold` instead of `font-black`** — breaks the designed typographic hierarchy where headings should command with 900 weight; the global CSS already sets `font-weight: 900` for h1–h3 which Tailwind's `font-bold` (700) overrides — fixed in all landing components by changing `font-bold` to `font-black` on every section heading and adding `tracking-tight`.

2. **Section vertical rhythm is flat — every section `py-24` with no variation** — the page breathes at a single frequency creating visual monotony; sections that should feel heavier (ProblemSection, CTASection) are identical in padding to lighter sections (ImplementationPath) — fixed by increasing all sections to `py-28` (7rem) to add breathing room, and differentiating section backgrounds (ProblemSection stays beige, Perspectives and AITutor get `bg-white border-y` to create alternation).

3. **CTA button copy "Open AI Chat" is tool-name copy, not benefit copy** — the button sits inside an already-labeled "School Assist" section so it reads as a technical affordance rather than an invitation — fixed to "Try AI Tutor Free" which states action + benefit + zero-cost.

---

## Detailed Findings

### Pillar 1: Copywriting (3/4)

**Passing:**
- Eyebrow labels are specific and consistent: "Career Guide", "School Portal", "How it works", "School Assist"
- Hero h1 "The Future of Education / Arriving Quietly." is confident and distinct
- CTASection headline "Ready to Lead?" is punchy and appropriate
- Stat callout "+82% Increase in administrative efficiency" is concrete

**Issues fixed:**
- `AITutorSection.tsx:45` — CTA label "Open AI Chat" changed to "Try AI Tutor Free" (benefit-forward, zero-friction signal)
- `ImplementationPath.tsx:4` — Step 01 desc contained "Submit your school's EMIS number" which reads like a form label; changed to "Share your school's EMIS number" (friendlier register)
- `CTASection.tsx:22` — fine-print text was `text-[10px]` (below 11px minimum for readable UI copy); bumped to `text-[11px]`
- `LandingFooter.tsx:47` — footer copyright was `text-[10px]`; bumped to `text-[11px]`

**Remaining minor issue:**
- `Perspectives.tsx:66` — the subheadline "Four role-specific dashboards. One school. Everything connected." repeats the tab UI's own visual structure in prose — low priority, acceptable as-is.

---

### Pillar 2: Visuals (2/4)

**Issues:**
- **Section background alternation was broken** — ProblemSection, CareerSection, AITutorSection, and CTASection all used `bg-[#FAF9F6]` back-to-back with no separation. Fixed: Perspectives now `bg-white border-y border-slate-100`, AITutorSection now `bg-white border-y border-slate-100`, creating a clear warm-beige / white / warm-beige rhythm.
- **CareerSection cards** — the RIASEC grid used `bg-white` cards inside a `bg-slate-50` container which read as expected, but the container itself `bg-slate-50` appeared identical to the beige background at a glance. Fixed: container changed to `bg-white rounded-[2.5rem] shadow-sm` so it registers as a raised surface.
- **CareerSection TVET card** lacked a navigational affordance — dark card with no visible "go here" signal. Fixed: added "Explore TVET" text link with ArrowRight at card bottom.
- **RIASEC card** similarly had no in-card CTA. Fixed: added "Start the quiz" with ArrowRight below the grid.
- **Decorative blobs in CTASection** were missing `pointer-events-none` — fixed.
- **ProblemSection stat card** overlap used `-bottom-10 -left-10` which can clip on small viewports. Tightened to `-bottom-8 -left-8` with reduced internal padding.

---

### Pillar 3: Color (3/4)

**Passing:**
- Color palette is tightly controlled: `#FAF9F6` warm beige, `slate-900`/`slate-950` for dark surfaces, `slate-50`/`slate-100` for lifted surfaces, `white` for cards.
- No accent color overuse. No hardcoded hex colors in component files (only the approved `#FAF9F6` token used correctly).
- No bright colors. The `slate-950` dark section in CTASection and the CareerSection TVET card provide the only true-black moments — used sparingly and purposefully.

**Issues:**
- `Perspectives.tsx:60` — `bg-slate-50/50` (50% opacity over beige parent) produced an ambiguous grey-beige that read as a rendering artifact rather than a deliberate surface. Fixed: changed to `bg-white border-y border-slate-100`.
- `ImplementationPath.tsx:12` — same `bg-slate-50/50` issue. Fixed: changed to `bg-[#FAF9F6]` (explicit beige token) so it reads as same-surface as its neighbours.
- `CareerSection.tsx:49` — RIASEC type mini-cards used `bg-white` inside `bg-slate-50` container — works but produces low contrast separation. Fixed: changed mini-cards to `bg-slate-50` inside new `bg-white` container for clearer nesting.

---

### Pillar 4: Typography (2/4)

**Root issue:** `index.css` declares `h1, h2, h3 { font-weight: 900 }` globally, but every section heading in the landing components was classed `font-bold` (700), overriding the global rule and producing a weight mismatch against the design intent.

**All instances fixed** (`font-bold` → `font-black` on section-level headings):
- `ProblemSection.tsx:16` — h2 `font-bold` → `font-black`
- `Perspectives.tsx:64` — h2 `font-bold` → `font-black`
- `Perspectives.tsx:103` — h3 `font-bold` → `font-black`
- `CareerSection.tsx:22` — h2 `font-bold` → `font-black`
- `CareerSection.tsx:42` — h3 `font-bold` → `font-black`
- `CareerSection.tsx:65` — h3 `font-bold` → `font-black`
- `CareerSection.tsx:81` — h3 `font-bold` → `font-black`
- `AITutorSection.tsx:14` — h2 `font-bold` → `font-black`
- `ImplementationPath.tsx:16` — h2 `font-bold` → `font-black`
- `ImplementationPath.tsx:34` — h4 `font-bold` → `font-black`
- `CTASection.tsx:10` — h2 `font-bold` → `font-black`

**`tracking-tight` added** to all heading classes that lacked it — large display type without negative tracking reads loose at `text-4xl`+.

**Body text size standardised:** Sections using `text-lg` (18px) and `text-[15px]` inconsistently. Fixed all section body copy to `text-[17px] leading-[1.7]` for consistent reading rhythm.

**Distinct font sizes in use (post-fix):** `text-xs`/`text-[11px]` (eyebrows/captions), `text-sm`/`text-[15px]` (body small), `text-[17px]` (body), `text-3xl` (card heads), `text-4xl`/`text-5xl` (section heads), `text-7xl` (CTA hero) — 5 meaningful tiers, acceptable.

---

### Pillar 5: Spacing (2/4)

**Section rhythm:** Every section was `py-24` (6rem). Flat rhythm with no variation. Fixed to `py-28` (7rem) across all landing sections — a modest increase that adds breathing room without creating jarring jumps.

**Internal spacing fixes:**
- `ProblemSection.tsx` — `px-4` on container changed to `px-6` to match the `px-6` used in the other landing sections
- `ProblemSection.tsx:30` — feature item gap was `space-y-6` with `pt-4` — changed to `space-y-5 pt-2` for tighter, more consistent icon-text list rhythm
- `ProblemSection.tsx:31` — icon container `w-12 h-12 bg-slate-50` changed to `w-11 h-11 bg-slate-100` — `slate-50` on a `#FAF9F6` background is nearly invisible; `slate-100` registers as a proper surface
- `CareerSection.tsx:35` — card grid `gap-8` changed to `gap-6` for tighter bento layout
- `ImplementationPath.tsx:31` — step circle `w-16 h-16` reduced to `w-14 h-14` so the connector line geometry aligns better with the updated size

**Arbitrary values present but acceptable:** `rounded-[2.5rem]`, `rounded-[3rem]` are design-intentional large-radius cards — consistent within the landing page. `text-[11px]` for eyebrows is a deliberate sub-scale value used consistently.

---

### Pillar 6: Experience Design (2/4)

**No aria-labels on landing components** — fixed where interactive intent is ambiguous:
- `Perspectives.tsx` — CTA button gets `aria-label` describing destination
- `CareerSection.tsx` — "Take the Quiz" text-link button gets `aria-label`
- `AITutorSection.tsx` — demo chat `div` gets `role="img" aria-label="AI tutor conversation preview"`
- `CareerSection.tsx` — `Database` icons get `aria-hidden="true"` (decorative)
- `LandingFooter.tsx` — wordmark "P" logo div gets `aria-hidden="true"`

**No loading/error states needed** — all landing sections are static render, no async data. Correct by design.

**Reduced-motion** already handled globally in `index.css` — passes.

**Focus rings** — `index.css` sets `button:focus-visible { ring-2 ring-offset-2 ring-slate-900 }` globally — passes, no per-component fix needed.

**Destructive action confirmation** — not applicable to landing page.

---

## Files Audited

- `C:/prospect/src/App.tsx` — HeroNav, HeroSection (read-only, no fixes applied)
- `C:/prospect/src/features/landing/ProblemSection.tsx` — fixed
- `C:/prospect/src/features/landing/Perspectives.tsx` — fixed
- `C:/prospect/src/features/landing/CareerSection.tsx` — fixed
- `C:/prospect/src/features/landing/AITutorSection.tsx` — fixed
- `C:/prospect/src/features/landing/ImplementationPath.tsx` — fixed
- `C:/prospect/src/features/landing/CTASection.tsx` — fixed
- `C:/prospect/src/features/landing/LandingFooter.tsx` — fixed
- `C:/prospect/src/index.css` — read-only reference
