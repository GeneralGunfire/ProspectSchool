# Prompt for Claude Code — Roll out the Student Home / Sidebar design pass to the rest of the Student portal

Copy everything below into Claude Code.

---

I want you to bring the rest of the **student portal** pages up to the same design quality as `src/pages/portal/student/StudentHomePage.tsx` and the shared sidebar in `src/pages/portal/StudentDashboard.tsx`. Those two files were just finished in a separate long session of iterative design feedback — read them first, in full, before touching anything else. They are the reference for tone, spacing, color usage, and component patterns. Do not treat this as "make it pretty from scratch" — treat it as "extend an established design system to pages that haven't received it yet."

## Do this ONE PAGE AT A TIME

Work through the student portal pages in this order, and **stop after each page** for me to review in the browser before starting the next one. Do not batch multiple pages into one pass.

1. `src/pages/portal/student/StudentAnnouncementsPage.tsx`
2. `src/pages/portal/student/StudentCalendarPage.tsx`
3. `src/pages/portal/student/StudentMarksPage.tsx`
4. `src/pages/portal/student/StudentTimetablePage.tsx`
5. `src/pages/portal/student/StudentResourcesPage.tsx`
6. `src/pages/portal/student/StudentPastPapersPage.tsx`
7. `src/pages/portal/student/LibraryPage.tsx`
8. `src/pages/portal/student/StudentTopicTestsPage.tsx`
9. `src/pages/portal/student/StudentBehaviourPage.tsx`
10. `src/pages/portal/student/StudentHomeroomPage.tsx`
11. `src/pages/portal/student/MyFuturePage.tsx`
12. `src/pages/portal/student/ApsCalculatorPage.tsx`
13. `src/pages/portal/student/SubjectSelectionPage.tsx`

For each page: read the current file, identify what's inconsistent with the reference design (see checklist below), propose the specific changes to me in plain language BEFORE editing (a short list, not a wall of text), then implement only after I say go. This mirrors how we worked on the Home page — nothing was a silent surprise rewrite; everything was proposed, sometimes debated, then applied.

**Do not touch anything outside the student portal in this pass.** Teacher, Parent, Admin, and Platform Admin dashboards come later, as separate follow-up passes once the student portal is fully done — don't get ahead of that.

## What "done" looks like — the design system, distilled

### Color tokens (already scoped, don't invent new ones)
- The student portal has its own scoped CSS block: `.student-home` in `src/index.css` (~line 725). It overrides `--color-accent`, `--color-brand-dark`, `--color-brand-border`, `--color-brand-bg`, `--color-paper-raise` locally so the rest of the app's tokens are untouched.
- `--color-accent` is currently `#1f2421` — a warm charcoal, deliberately matched to the sidebar's own "selected page" color (`bg-brand-dark`) rather than a bright/navy blue. This was an explicit choice after going back and forth on a blue accent, a maroon rebrand, and settling on charcoal for visual consistency with the sidebar. Do not reintroduce navy/blue or maroon as the primary accent — ask me first if you think a page genuinely needs a different treatment.
- Status colors (red/amber/emerald) are reserved for real signal only: overdue/urgent (red), caution (amber), success/on-track (emerald). **Never use red for a zero/empty state** — e.g. "0 items" or "no marks yet" must render in neutral gray, not red. This was a specific bug we fixed on the Home page (a homework-completion bar showed "0%" in red when a student simply had no homework yet, which reads as a punishment for new users). Check every page you touch for this same mistake — any percentage/count that defaults to 0 when there's no data must not default to a red/danger color.
- Sign Out is red (`text-red-500`, `hover:bg-red-50`) — this was deliberately restored to red after briefly trying neutral gray; the user wants logout to read as a distinct, slightly weighty action. Keep it red anywhere a sign-out/logout control appears.

### The `.paper-card` recipe (use this, don't invent new card styles)
Every card on the Home page uses the shared `.paper-card` class (defined in `src/index.css` ~line 773), which gives:
- A subtle top-to-bottom white gradient (`linear-gradient(180deg, #ffffff 0%, #fdfcfa 100%)`), not flat white
- A 1px hairline border (`var(--color-brand-border)`)
- A layered, soft shadow (inset top highlight + 3 stacked shadows for depth) instead of a single flat `box-shadow`
- A hover lift (`translateY(-5px)` with deeper shadow) and an active-press scale-down

If a page currently uses plain `bg-white rounded-lg shadow` or similar ad-hoc card styling, replace it with `paper-card rounded` (plus whatever padding the content needs, e.g. `p-5 sm:p-6`). Don't reinvent card shadows per-page.

### Sidebar (already done — just be aware of it)
`StudentDashboard.tsx` renders one continuous panel (not three separate floating cards), sized `w-72`, using the same paper-card-style gradient/border/shadow. Nav items are grouped into labeled sections ("Academic" / "Tools") with small uppercase section headers. Active nav item is `bg-brand-dark text-white` (NOT the accent color — we tried accent blue for the active state and reverted it; keep it black/charcoal). You shouldn't need to touch this file unless a specific page needs a new sidebar entry — if so, ask first.

### Typography hierarchy
- Section/card labels: `text-[11px] font-bold uppercase tracking-[0.1em] text-[rgba(31,36,33,0.45)]` (a muted charcoal, not `text-gray-400` or similar off-palette gray)
- Primary values/headings inside cards: `font-black` or `font-bold`, using `text-brand-dark` or the status color, not pure black (`#000`) or generic `text-gray-900`
- Numbers that need alignment (marks, percentages, scores) should use `style={{ fontVariantNumeric: 'tabular-nums' }}` so digits line up — we added this to the Recent Activity list on Home.
- Empty-state copy should be warm/encouraging, not clinical. E.g. "Your average will appear here once your first assessment is marked" rather than a bare "No marks yet" with no context. Check each page's empty states specifically — this was a recurring fix on Home.

### Buttons
- Primary CTA: filled, `background: var(--color-accent)`, `color: var(--color-accent-foreground)` (white), `rounded`, with `whileHover={{ y: -1 }}` and `whileTap={{ scale: 0.97 }}` (motion/react) for tactile feedback. Hover background should darken slightly via `var(--color-accent-soft)`, not a hardcoded hex.
- Secondary/outline buttons: `var(--color-paper-raise)` background, `border border-brand-border`, `text-brand-dark`, hover to `hover:bg-brand-border`.
- When a design has multiple buttons in the same row/context (e.g. two cards each with a bottom-right action button), make sure they're **actually identical** in padding, font size, and border-radius — not just "close." We had to fix this twice on Home because buttons that looked similar at a glance turned out to have different padding/alignment when compared side by side. Check this explicitly, don't eyeball it.
- Icon size inside buttons: `w-3.5 h-3.5` to `w-4 h-4` depending on button size, `ArrowUpRight` for "go to full page" actions.

### Mobile responsiveness — go through every page like we did on Home
For each page, actually check the mobile viewport (not just assume Tailwind's responsive classes are enough) for:
- Any `hidden sm:block` (or similar) that hides real content on mobile rather than just resizing it — we found the hero's APS/Goal badge was fully hidden on mobile and fixed it to show a smaller version instead of vanishing. Audit every page for this pattern.
- Any `flex` row (not `flex-col`) that stays horizontal below a reasonable breakpoint and gets cramped — check ring/icon + text combinations especially; we found one in the Progress panel that needed `flex-col sm:flex-row lg:flex-col` instead of `flex lg:flex-col`.
- Long text (subject names, titles) next to a fixed-width value (marks, timestamps, percentages) — make sure these can wrap (`flex-wrap` with `gap-x/gap-y`) rather than relying purely on `truncate` to save a cramped layout.
- Touch targets: buttons/interactive rows should have enough padding to be comfortably tappable (roughly 40px+ tall), not compressed just to save vertical space.
- Do NOT introduce a bottom tab bar or otherwise change the navigation pattern — we explicitly decided to keep the existing hamburger + slide-in drawer and just polish it, not redesign the nav paradigm.

### Interaction / motion conventions
- All cards/sections fade+slide in on mount: `initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease, delay: <staggered> }}` — stagger the delay slightly (0.05–0.08s increments) between sibling cards so things feel sequenced, not simultaneous.
- Use `motion/react` (not `framer-motion` directly — check the existing import path in Home for the correct package name in this project).
- Loading states use a `Shimmer` component (moving gradient sweep) instead of a spinner — check if `src/pages/portal/student/StudentHomePage.tsx`'s exported `Shimmer` component or a similar shared one should be reused rather than duplicated per-page.

## How we actually worked — copy this process, not just the output

This matters as much as the visual spec above:

1. **Small, reviewable changes.** Every round was one specific, scoped ask ("make the hero less dominant," "the 3 buttons look inconsistent," "shrink the nav text"). Nothing was "redesign this page" as a single giant diff. Emulate that: for each student page, break your own work into a few concrete proposed changes, not one sweeping rewrite.
2. **Confirm before big/ambiguous moves.** When a change was genuinely a judgment call with real tradeoffs (e.g. "should we rebrand the accent color," "should nav be a bottom tab bar or a drawer"), the assistant asked a clarifying question with 2-3 concrete options rather than guessing. Do the same — if you're not sure whether a page-specific quirk should be kept, dropped, or changed, ask rather than assume.
3. **When told to revert, revert precisely.** At one point a broad "maroon rebrand" experiment was undone but a couple of adjacent kept changes (sidebar active-state color, empty-state red-to-gray fix) were explicitly preserved rather than reverted along with everything else. When you get corrective feedback, figure out exactly what should change and what should stay — don't nuke everything back to the original file out of caution.
4. **Verify claims with the actual code, not assumption.** Several times an assumption about a color/value ("the background is beige #EAE8E1") turned out to be wrong once the actual CSS was read (it was `#FAFAFA`/`#eeece5` in this codebase, not what a pasted design critique claimed). Before making a change based on "X is currently Y," grep/read the actual current value first.
5. **Keep scope tight to what's asked.** Several requests (a long external design critique, a call to redesign navigation into a bottom tab bar, a call to hide/redesign the Progress ring) were explicitly NOT applied wholesale — only the parts that were confirmed as wanted got implemented. Don't treat a broad critique or reference screenshot as license to change everything it mentions; extract only what's relevant and confirm the rest.
6. **One page, stop, review, continue.** This prompt's ordering (see list above) exists so the user can sanity-check each page in a real browser before you move to the next — don't skip ahead even if you're confident.

## Before you start

1. Read `src/pages/portal/student/StudentHomePage.tsx` and `src/pages/portal/StudentDashboard.tsx` in full.
2. Read the `.student-home`-scoped CSS block and the `.paper-card` / `.edge-glow` / `.focus-emphasis` rules in `src/index.css`.
3. Then read `src/pages/portal/student/StudentAnnouncementsPage.tsx` (page #1 above) and come back to me with a short list of what you'd change and why, before editing anything.
