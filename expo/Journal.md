# Development & Research Journal

**Project:** Prospect — A Unified Digital Platform for School Information Access and Early Academic Intervention
**Student(s):** [Your Name]
**Period:** Week 1 (approx. 2026-04-27) to Week 10 (approx. 2026-07-11)

*Note: early weeks (research, planning, data modelling) predate the first commit and are reconstructed from planning notes and memory, since not everything we did lives in git history. Later weeks are cross-referenced against actual commits where possible.*

---

## Week 1 — 2026-04-27 to 2026-05-03: Problem definition & background research

- Decided on the project topic: information accessibility and academic support in South African schools.
- Discussed informally with two teachers about their day-to-day frustrations with tracking student performance and communicating with parents. Recurring theme: problems are only noticed once a report card is already bad.
- Researched existing commercial school management systems at a high level to understand standard feature sets and where they fall short for lower-resourced schools (cost, complexity, lack of proactive intervention tools).
- Started reading up on the National Senior Certificate (NSC) and Admission Point Score (APS) system, since career/subject guidance kept coming up as a gap.
- Wrote a rough problem statement and initial research question draft.

## Week 2 — 2026-05-04 to 2026-05-10: Data modelling & architecture decisions

- Sketched the core entity relationships on paper: schools → cohorts/classes → students, teachers linked to subjects and classes, parents linked to students.
- Decided against building a custom backend server — evaluated Supabase (managed Postgres + Row Level Security) as a way to keep the project realistically deployable for a school with no IT budget.
- Decided against traditional email/password auth. Landed on a school-code + role-code + PIN model as the accessible option for students/parents without reliable personal email.
- Chose the frontend stack: React + Tailwind + Vite, for fast iteration across four very different portal UIs.
- Set up the repository and project scaffolding.

## Week 3 — 2026-05-11 to 2026-05-17: Early build environment & scaffolding

- Iterated on the database schema in a sandbox before writing any real migrations — mostly whiteboard/notes work refining how marks, mark sheets, and term weighting should relate.
- Built the very first working skeleton: routing-free dashboard shells for each role, a placeholder login screen.
- Ran into early friction with how to keep four different portals visually consistent without duplicating a lot of CSS — decided on a shared Tailwind design-token approach rather than four separate stylesheets.
- This week's work isn't fully reflected in the earliest commit (`Initial commit`) since a lot of it was scaffolding and false starts that got reset before the first real commit was made.

## Week 4 — 2026-05-18 to 2026-05-24: First real functionality

- `2026-05-28` — **Initial commit.**
- `2026-05-29` — Added resources, announcements, a homework tracker, a marks chart, and the first real home dashboards for each role. This was the first time the app felt like a real product rather than a shell.
- `2026-05-29` — Fixed the first deployment issues getting the app live on Vercel (wrong repo linked, missing SPA rewrite rule so routes 404'd on refresh).
- `2026-05-29` — Fixed a couple of build-breaking bugs (`missing mapService for careers map feature`, `careersFullAudited`/`careersFullData`) — the first sign that the career/APS planning feature was going to be more data-heavy than expected.
- `2026-05-29` — Fixed blank portal pages by moving to a `switch`/`renderPage` pattern so page transitions always had a child to animate — an early lesson in how fragile animation libraries can be around conditional rendering.
- Tested logging in as each of the four roles for the first time end-to-end.

## Week 5 — 2026-05-25 to 2026-05-31: Learning content, landing page, and early portal redesign

- `2026-06-01` — Completed "Phase 2": redesigned the learning page and enriched content across all 35 topics — this was where the CAPS-aligned subject content backbone (later feeding Topic Tests) really started taking shape.
- `2026-06-01` — Built a new landing page design, redesigned the portal entry page and all three login pages that existed at the time, and unified the site's colour palette (beige) for the first time.
- `2026-06-01` — Shipped the first version of the APS Goal Planner ("Phase 4a"), the Bursary match score + application tracker ("Phase 4b"), and Past Papers smart filters with self-marking mode ("Phase 4c") — this cluster of work was the direct output of the Week 1 research into APS/NSC and the "students without a counsellor" problem.
- `2026-06-01` — Did a UI audit pass to tighten spacing and fix mobile nav — deliberately motivated by the research finding that many South African households are mobile-first for internet access.
- `2026-06-01` — Fixed several broken routes and crashes discovered during this rapid feature push (My Future routes, APS calculator crash from a `framer-motion` → `motion/react` library migration, a Quiz page crash from an undefined prop).
- Reflected at the end of the week that student-facing planning tools were coming together faster than expected, but the "intelligence"/at-risk side for teachers — the actual core of the research question — hadn't been started yet.

## Week 6 — 2026-06-01 to 2026-06-02 (intensive multi-day push): The intelligence layer

*This was, by a wide margin, the most research-driven and technically dense week of the whole project — nearly all of the "explainable at-risk" and "intervention pipeline" work landed in this window.*

- Built the Dashboard "mission control" upgrade, an overhauled Calendar planning system, and Marks action-center upgrades — the goal was to make the dashboard proactive (tell the student/teacher what to do next) rather than a passive stats page.
- Overhauled Resources, Past Papers, and Announcements — added engagement measurement (resource download tracking, announcement view tracking) as a first step toward correlating engagement with outcomes.
- Shipped "Phase 6": the **Student Intelligence Engine** — the `computeStudentInsights()` pure function that turns raw marks/homework/events into exam risk per subject, revision suggestions, and (eventually) the Academic Journey status score.
- Wired the Intelligence Engine across all student pages, then built the **Intervention & Outcome Tracking System** — this is the direct implementation of the "close the loop" idea from Week 1's teacher interviews.
- Built Outcome Recording, Impact Analytics, and a Growth Timeline so an improvement could be traced back to the intervention that (plausibly) caused it.
- Refactored the engines for purity (interventions passed in as parameters rather than fetched internally) after realising the original implementation made testing the risk/outcome logic in isolation unnecessarily hard — a good lesson in why side-effect-free functions matter when you need to trust a number.
- Migrated interventions and outcomes from localStorage to Supabase — an important correctness fix, since local-only storage meant a parent or teacher on a different device would never see the same data.
- Did a full visual redesign of the Teacher portal to match the Student portal, added teacher-side analytics, and hardened the schema.
- Built the correlation analytics layer: Intervention ROI, Resource Effectiveness, and Announcement Impact, each annotated with sample size (n=) after realising early versions of these correlations were misleading with very small n.
- Added explainability directly onto interventions — a rationale field — and reworked recommendation logic to be evidence-based/ROI-ranked rather than arbitrary. This was the week the "explainability matters more than we expected" finding (see Research Report, Section 4) really became apparent through testing.

## Week 7 — 2026-06-03 to 2026-07-04: Consolidation (lower-visibility period)

- `2026-06-03` — Shipped Sprint 1+2: intervention assign flow, a follow-up queue, an assessment gap detector, bulk campaigns, comparison views, and performance-tier grouping for rosters — this is the point where the At-Risk Engine and Intervention pipeline described in the Research Report were feature-complete in their first form.
- The gap in commit history between `2026-06-03` and `2026-07-05` reflects a period of internal testing, informal feedback gathering, and research reading rather than a pause in work — this is where we constructed the synthetic test dataset described in the Research Plan (multiple classes, two terms of marks, deliberately including declining/volatile/consistently-weak student profiles) and used it to compare manual mark-sheet review against the At-Risk Engine dashboard, per the evaluation plan.
- Also used this period to read published South African university admission requirement pages in detail to validate the APS calculator and degree-matching logic against real 2026 entry requirements, rather than approximations.
- Some smaller UI inconsistencies and edge cases noticed during this testing period were queued up rather than fixed immediately, to avoid interrupting the evaluation process.

## Week 8 — 2026-07-05 to 2026-07-08: Full role coverage & remaining core features

- `2026-07-05` — Implemented hash-based browser history for proper back-button navigation, and migrated parent contact logs into the database.
- `2026-07-06` — Large redesign push: premium SaaS-style landing page, Sprint 3 (interventions/notifications), a full visual redesign of Student/Teacher/Admin portals, a hero-flip showcase on the landing page, and several rounds of login/portal redesign (glassmorphism, then a lighter theme, then better icon contrast) — this was as much a design-iteration week as an engineering one.
- `2026-07-06` — Added the teacher **At-Risk Students** page as its own dedicated view with the explainable risk pipeline surfaced directly, rather than only appearing as dashboard cards — feedback from testing suggested teachers wanted a place to see *all* at-risk students at once, not just the top few on Home.
- `2026-07-07` — Added the Assign Student flow (linking a student who already exists under one teacher onto another teacher's roster without duplicating their record), weighted final marks (term-weight calculations), the Topic Tests system, and Library polish.
- `2026-07-07` — Added teacher deletion (admin-side), and substantially expanded the Grade 10 Topic Tests catalog.
- `2026-07-07` — Built the Homeroom system and expanded Admin tooling for class/student/teacher management, plus the first version of the Platform Admin (owner-level) dashboard.
- `2026-07-07` — Added the Behaviour (merits/demerits) system and Parent Accounts — this is what unlocked a real Parent portal, since parents can't be linked to anything until behaviour/attendance/marks all exist to show them.
- `2026-07-07` — Added the Timetable feature (per-cell breaks, drag-and-drop, copy) — the most structurally complex Admin feature, since it required real-time teacher clash detection.
- `2026-07-07` — Another landing page redesign pass (blue palette, more accurate feature descriptions matching what the app actually did by this point, since earlier marketing copy had drifted from reality), plus fixes to mobile hamburger menu bugs and PIN autofill issues.

## Week 9 — 2026-07-08 to 2026-07-09: Timetable maturity & new modules

- `2026-07-08` — Added per-school stats drill-down and unified navigation across Platform Admin.
- `2026-07-08` — Cleaned up the Student portal UI and consolidated APS + University matching into the single "My Future" page, rather than having them as separate scattered pages — a direct usability fix based on testing confusion about where career-planning tools lived.
- `2026-07-08` — Fixed a cluster of timetable editing, drag/drop, and copy UX bugs found during testing, and added a batch-edit mode with a macOS-Calendar-style redesign and a dedicated mobile day view (again motivated by the mobile-first access research finding).
- `2026-07-08` — Made Student Assignments cards expandable in the admin view, and did a full overhaul of Topic Tests plus the Grade 9→10 Subject Selection workflow — this is the feature that lets homeroom teachers approve or reject a student's proposed subject choices for the following year, closing another real gap identified in Week 1 research (subject choice guidance being inconsistent without a counsellor).
- `2026-07-09` — Added the Marketplace module: listings, wanted requests, and a school supply guide — this came out of a research tangent noticing that "access to information" extends beyond academics to access to affordable school supplies and textbooks, which is itself a real barrier in lower-income households.

## Week 10 — 2026-07-10 to 2026-07-12: Final consistency pass & evaluation

- `2026-07-10` — Redesigned the Student portal with crested hero banners and a unified "paper-card" visual system.
- `2026-07-11` — Rolled the same unified design system out to Teacher, Admin, and Parent portals, and harmonised the sidebar background and profile card across every dashboard — the goal of this final pass was making all four portals feel like one coherent product rather than four separately-designed apps stitched together, which had become a genuine risk after ten weeks of feature-driven, sometimes rushed, redesign work.
- Ran a full walkthrough of the At-Risk Engine vs. manual review comparison described in the Research Plan's evaluation section, using the constructed sample dataset, and recorded findings for the Research Report.
- Cross-checked the APS calculator and degree-matching results against real published university admission pages for a sample of programmes.
- Wrote up the Research Report, Research Plan, Abstract, and this Journal for the expo submission.
- Noted remaining known limitations honestly rather than hiding them: no real-school pilot yet, At-Risk Engine thresholds are not calibrated against a real school's actual data distribution, and PIN-based auth needs hardening before handling real personal information.

---

## Reflections on the process

Looking back, the project's shape ended up matching the original research question more by continual course-correction than by a rigid week-by-week plan — several "weeks" above (especially Week 6 and Week 8) were really multi-day intensive pushes rather than evenly-paced work, and the gap around Week 7 was genuine research/evaluation time that doesn't show up as commits but was necessary to be able to honestly answer the research question rather than just assume the platform helped. The biggest unplanned finding was how much *explainability itself* mattered — we went in assuming the hard part would be getting the risk-detection logic right, and came out realising that a correct-but-unexplained flag is much less useful to a teacher than a slightly simpler, fully-explained one.
