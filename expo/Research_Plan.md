# Research Plan

**Project Title:** Prospect — A Unified Digital Platform for School Information Access and Early Academic Intervention in South African Schools
**Student(s):** [Your Name]
**School:** [School Name]
**Planned Duration:** 10 weeks (approx. 2026-04-27 to 2026-07-05, development continuing to present)

---

## 1. Background and Rationale

South African schools vary enormously in resourcing. Well-resourced schools often already use commercial school information systems (e.g. D6, SchoolAdmin). Under-resourced schools frequently do not — marks live in spreadsheets or paper registers, parents hear about problems only at report-card time or a parent evening, and career/subject-choice guidance is inconsistent because dedicated counsellors are rare. We wanted to investigate whether it is possible to build something that closes this gap without requiring a school to pay for expensive software or hire IT staff.

## 2. Research Question

**Primary question:** Can a single, affordably-built, role-based web platform improve access to accurate academic information and enable earlier, evidence-based intervention for at-risk students in a South African school context?

**Sub-questions:**
1. What specific information gaps exist between what schools currently track and what teachers, students, and parents actually need to see?
2. Can "at-risk" identification be done transparently (rule-based, explainable) with data a school already has, instead of requiring a black-box AI model?
3. Does closing the loop on interventions (recording whether a coaching action actually improved a mark) change how interventions are chosen over time?
4. Can career/tertiary planning (APS score tracking, degree requirement matching) be meaningfully self-served by a student without a counsellor, using only publicly available admission requirements?

## 3. Hypothesis

If a single platform gives teachers, students, parents, and admin staff role-appropriate, real-time access to the same underlying academic data, **then** at-risk students will be identifiable earlier and more consistently than under manual/paper-based methods, **because** the cost of checking on a student (previously: manually reviewing paper mark sheets) is reduced to near-zero and made proactive rather than reactive.

## 4. Objectives

1. Identify, through research into South African school administration practices and the NSC/APS university admission system, the core information workflows a school platform must support.
2. Design a data model and role system (Admin / Teacher / Student / Parent) that reflects how a real school is structured.
3. Build and iteratively test a working system implementing: authentication, marks and analytics, an explainable at-risk engine, an intervention tracking pipeline, attendance/behaviour tracking, a timetable system, and a career/APS planning tool.
4. Evaluate the system against realistic simulated school data to assess whether it plausibly improves on manual methods.
5. Document constraints, limitations, and what would be required for real-world piloting.

## 5. Methodology

This is a **design-science / applied engineering research project**: the primary research method is iterative build-test-refine cycles, grounded in background research into (a) South African school administrative practice and (b) established software engineering and UX practice, validated through internal testing against constructed sample data rather than a live school deployment (see Limitations).

**Phases:**

| Phase | Weeks | Focus |
|---|---|---|
| 1. Background research & problem definition | 1–2 | Interviews/informal discussion with teachers, review of existing school systems, review of NSC/APS requirements, define data model |
| 2. Core information architecture | 2–3 | Auth/roles, database schema, base dashboards, marks, announcements, resources |
| 3. Intelligence layer | 3–5 | At-risk engine, intervention pipeline, outcome tracking, engagement analytics |
| 4. Full role coverage | 5–7 | Admin tooling (classes, teachers, timetable), Parent portal, Behaviour/attendance, Homeroom |
| 5. Student-facing planning tools | 6–8 | My Future (APS calculator, career quiz, degree matching), Topic Tests, Past Papers |
| 6. Polish, redesign, additional modules | 8–10 | Visual/UX redesign across all portals, Marketplace module, Subject Selection workflow, consistency pass |
| 7. Evaluation & documentation | 10 | Testing against sample data, writing up report, journal, and this plan |

## 6. Variables (Design-Science Framing)

- **Independent variable:** presence/absence of the platform's explainable at-risk engine and intervention tracking (compared conceptually against a manual "read every mark sheet" baseline).
- **Dependent variables:** time-to-identify an at-risk student; whether an intervention's effect on a mark is ever actually measured; number of information touchpoints a parent has access to.
- **Controlled elements:** identical underlying dataset (mark sheets, subjects, students) used when comparing manual review vs. engine-assisted review during testing.

## 7. Materials / Tools

- **Frontend:** React 19, Tailwind CSS 4, Vite
- **Backend/Database:** Supabase (managed PostgreSQL, Row Level Security, Storage)
- **Testing:** Playwright (automated UI testing), manual QA against constructed sample data
- **Deployment:** Vercel
- No paid APIs, no third-party AI/ML services — all analytics and "intelligence" are computed locally from first principles.

## 8. Evaluation Plan

1. Construct a realistic sample dataset: multiple classes, ~2 terms of mark sheets across several subjects, deliberately including students with declining, volatile, and consistently weak performance.
2. Compare how long it takes to identify the same at-risk students (a) by manually scanning mark sheets and (b) using the At-Risk Engine's dashboard.
3. Walk through the full intervention lifecycle (assign → student completes recommended action → outcome recorded) and confirm the effectiveness measurement is computed consistently regardless of which of the three entry points created the intervention.
4. Validate the APS calculator and degree-matching logic against real, published 2026 South African university admission requirements for a sample of programmes.
5. Conduct a UI/accessibility pass on all four portals to check for consistency and usability, particularly on mobile (given many SA households are mobile-first for internet access).

## 9. Anticipated Limitations

- No live pilot in an actual functioning school with real students during the research window — evaluation is against constructed, realistic sample data.
- The at-risk engine is rule-based, not a trained statistical/ML model — this is a deliberate transparency choice, but means it will not adapt automatically to a school's specific context over time.
- Single-developer/small-team build over 10 weeks — feature breadth was prioritised in places over exhaustive edge-case testing.
- PIN-based authentication was chosen for accessibility and simplicity for non-technical school staff, which is a deliberate security/usability trade-off discussed further in the Research Report.

## 10. Ethical Considerations

All data used in development and testing is fictional/synthetic (invented student names, invented marks). No real learner data was used at any point during the research or development period. Should the platform proceed to a real pilot, informed consent from the school, parents, and POPIA (Protection of Personal Information Act) compliance would be required before any real student data is entered.
