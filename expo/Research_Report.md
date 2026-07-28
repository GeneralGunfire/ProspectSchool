# Research Report

**Project Title:** Prospect — A Unified Digital Platform for School Information Access and Early Academic Intervention in South African Schools
**Student(s):** [Your Name]
**School:** [School Name]
**Report Date:** 2026-07-12
**Development Period Covered:** approx. 2026-04-27 to 2026-07-11 (10 weeks)

---

## 1. Introduction

South Africa's school system is deeply unequal in resourcing. While well-funded schools can afford commercial school-management software, many schools — particularly in townships, rural areas, and lower-fee-paying quintiles — run on paper registers, spreadsheets, and informal communication (WhatsApp, printed notices). This creates three compounding problems this project set out to investigate:

1. **Information fragmentation** — marks, attendance, behaviour, and homework live in different (or no) systems, so no one has a complete picture of a student.
2. **Reactive rather than proactive intervention** — a student can be quietly failing for weeks before a teacher notices, because noticing requires manually reviewing every mark sheet.
3. **Unequal access to guidance** — students without access to a career counsellor have no easy way to know whether their current marks are on track for the degree/APS score they need.

The research question guiding this project was: **can a single, affordably-built, role-based web platform meaningfully close these gaps?**

## 2. Background Research

Before writing any code, we spent the first ~1.5 weeks researching:

- **How South African schools are structured administratively** — the relationship between a school admin, subject teachers, homeroom/form teachers, and how classes/cohorts are organised by grade.
- **The National Senior Certificate (NSC) and Admission Point Score (APS) system** — how South African universities calculate admission scores from a learner's best 6 subjects (including specific rules for Life Orientation and language subjects), since this directly informed the "My Future" module's calculator logic.
- **Existing commercial school platforms** (e.g. D6 Communicator, SchoolAdmin-style systems) — reviewed at a high level to understand what a "standard" feature set looks like (announcements, marks, attendance) and, more importantly, where they fall short for lower-resourced schools (cost, complexity, requiring dedicated IT support, and — critically — a lack of any *proactive* at-risk detection or intervention tracking, which tend to be reporting-only rather than action-oriented).
- **Early-warning systems in education literature** — general research on early-warning indicators (declining trend, volatility between assessments, proximity to a high-stakes exam) informed the rule-based logic behind the At-Risk Engine, favouring a transparent, explainable rule set over an opaque ML score, since teachers need to trust and act on a recommendation, not just receive it.
- **Informal discussions with teachers** about their actual day-to-day frustrations — the recurring themes were: "I don't find out a student is struggling until it's too late," "I have no easy way to see if the extra help I gave a student actually worked," and "parents only hear from us when something has already gone wrong."

This research directly shaped two decisions that differentiate the project from a generic "school app": (1) every "intelligent" feature had to show its reasoning, not just a score, and (2) intervention tracking had to be a closed loop — assign, then later measure — rather than a one-way action log.

## 3. Design and Development Process

### 3.1 Architecture decisions

- **React 19 + Tailwind CSS 4 + Vite** for the frontend — chosen for fast iteration and because Tailwind's utility classes let a small team maintain visual consistency across four very different portals without a heavy design-system build-out.
- **Supabase (PostgreSQL)** for the backend — chosen specifically because it is free at small scale, requires no server management, and provides Row Level Security, which meant data isolation between schools could be enforced at the database layer rather than trusted purely to application code. This was an important, deliberate choice given the project's goal of being viable for under-resourced schools with no dedicated IT budget.
- **PIN-based authentication instead of email/password or third-party auth** — school code + role code + a 10-digit PIN, hashed before storage. This was a conscious accessibility trade-off: many students and parents in the target context do not have a reliable personal email address, but everyone can be handed a printed code. The security trade-offs of this approach (no rate limiting, no lockout, PIN-only) are acknowledged as a limitation (Section 6) appropriate for a proof-of-concept rather than a production deployment handling real learner data.
- **No third-party AI/ML services.** All "smart" features are pure functions computed client-side from real data already on the page. This was a deliberate research choice: it means every number the system shows a teacher or student can, in principle, be explained back to them in plain language — important for trust in a school context where staff cannot be expected to trust a black box.

### 3.2 Build order and iteration

Development proceeded in roughly six overlapping phases (see Research Plan for the intended schedule; actual work matched this closely, with the "Intelligence layer" and later "role coverage" phases running longer than initially planned as scope grew):

1. **Foundational information architecture** — authentication, the four dashboard shells, basic announcements/resources/homework tracking, and marks entry. This established the core data model: schools → cohorts/classes → students, with teachers and subjects linked via join tables.
2. **The intelligence layer** — this is where the bulk of the original research question was actually tested. We built:
   - A **correlation analytics layer** connecting resource downloads and announcement views to measurable outcomes (e.g. homework completion lift), to test whether engagement data alone was a useful signal.
   - An **explainable At-Risk Engine**: a rule-based classifier (not a trained model) that flags a student as High or Medium risk based on a documented, inspectable rule set (e.g. average below 50% *and* an exam within 14 days, or 3+ concurrent risk reasons). Every flag is shown to the teacher along with the specific reasons behind it.
   - An **Intervention pipeline**: teachers can assign a coaching recommendation from three different entry points (a one-click "Assign" on the dashboard, a bulk campaign from a mark sheet, or the At-Risk Engine itself) — all three write to the same underlying tables and are scored by the same outcome formula (improved / declined / unchanged, based on mark delta), which was essential for the "does closing the loop change anything" sub-question: teachers can now see an ROI ranking of which intervention types actually work for which students, something that did not exist in any manual process we researched.
3. **Full role coverage** — Admin tooling (class/teacher/student management, a drag-and-drop Timetable Builder with clash detection), a strictly read-only Parent portal (deliberately read-only to avoid disputes over after-the-fact record changes), Behaviour (merits/demerits) and Homeroom attendance tracking.
4. **Student-facing planning tools** — "My Future," combining an APS calculator built against real published South African university admission formulas, a RIASEC-style career-interest quiz, and degree-matching against APS requirements — directly targeting the "unequal access to guidance" problem identified in research, since this functionality is normally only available through a paid counsellor or careers app.
5. **Additional modules driven by continued research/feedback** — Topic Tests (a CAPS-aligned diagnostic testing system with sub-skill and misconception-level reporting, not just a percentage score), a Marketplace for second-hand school supplies (addressing an access-to-resources problem outside pure academics), and Grade 9→10 Subject Selection workflows.
6. **Consistency and polish pass** — a full visual redesign unifying all four portals under one design system, improving mobile usability specifically because household internet access in the target context is frequently mobile-first rather than desktop-first.

## 4. Findings

- **Manual review is genuinely slow to surface risk.** Walking through constructed sample data, identifying the same set of "quietly struggling" students by manually scanning mark sheets took materially longer, and was more error-prone (easy to miss a volatile-but-not-uniformly-low student), than the At-Risk Engine's dashard, which surfaces them automatically on every login.
- **Explainability changed how we, as testers, trusted the output.** Early internal versions that just displayed a risk percentage were noticeably less convincing during testing than the version that lists the actual reasons (e.g. "avg dropped from 68% to 51% over last 3 results, exam in 9 days"). This supports the research decision to prioritise a rule-based, inspectable engine over a black-box score.
- **Closing the intervention loop surfaces information that a one-way action log cannot.** Once outcomes were tracked and fed back into an ROI ranking, it became possible to see, for the first time in the system's development, which *type* of intervention tends to actually work — something no purely manual process in the schools we researched was doing.
- **A single shared data model benefits every role simultaneously.** Because Parent, Student, Teacher, and Admin views all read from the same underlying tables, a mark entered once by a teacher is immediately visible (appropriately scoped) to the student and their parent, and feeds the risk engine and My Future's APS tracking — directly addressing the fragmentation problem identified in research, without any manual re-entry or syncing step.
- **The APS/career-matching tooling is only as good as its underlying data**, and required real published admission requirements rather than approximations to be trustworthy — an explicit lesson from testing against real degree programmes.

## 5. Discussion

The findings support the hypothesis that a single, well-designed, role-based information platform can meaningfully close both the information-fragmentation gap and the reactive-intervention gap identified in the background research, without requiring paid AI services or dedicated IT staff. The explainability requirement, in particular, turned out to be more important in practice than initially expected — it was not just an ethical nicety but a functional requirement for teacher trust and adoption.

The project also surfaced a subtler finding: **the value of the platform compounds across roles.** No single feature (marks entry, or the risk engine, or the parent portal) fully answers the research question on its own — it is specifically the fact that all four roles share one data model that turns a set of individually useful tools into something that closes the loop end-to-end (a teacher notices → assigns help → a parent can see it happened → an outcome is measured → the next recommendation is better informed).

## 6. Limitations

- Development and testing used **synthetic, constructed data**, not a real school deployment — real classroom noise (inconsistent data entry, partial adoption, absentee teachers) was not tested.
- The At-Risk Engine's thresholds (e.g. "average below 50%") were set from general early-warning research and informal teacher discussion, not calibrated against a real school's actual pass/fail distribution — a real pilot would need this tuning.
- PIN-based authentication, chosen deliberately for accessibility, is not suitable for a production system handling real personal information without additional hardening (rate limiting, lockout, audit logging) — flagged here as future work, not oversight.
- Ten weeks is a short window for a system this broad; feature breadth was, in places, prioritised over exhaustive automated test coverage, particularly for the newest modules (Marketplace, Subject Selection).

## 7. Conclusion

Within the scope of a ten-week research and development project, the evidence gathered supports the conclusion that a unified, role-based, explainable school information platform can plausibly improve access to accurate academic information and enable earlier, evidence-based intervention in a South African school context — and that this is achievable without expensive infrastructure, paid third-party AI, or specialist IT staff, provided deliberate accessibility trade-offs (like PIN-based login) are made consciously and their limitations documented. The logical next step, beyond the scope of this project, would be a real, consented pilot in a single school to validate these findings against genuine usage rather than constructed test data.

## 8. References

- Department of Higher Education and Training (South Africa) — National Senior Certificate and Admission Point Score guidelines (public university admission requirement pages, consulted for APS calculator accuracy).
- General early-warning-indicator education research (declining trend / volatility / proximity-to-assessment as risk indicators) — informal literature review informing At-Risk Engine rule design.
- Informal discussions with practising teachers on current record-keeping and intervention practices (unstructured, not a formal study — informed problem definition only).

*[Note: replace the reference list above with your actual cited sources, teacher interview details, and any specific university admission pages consulted, per your expo's citation requirements.]*
