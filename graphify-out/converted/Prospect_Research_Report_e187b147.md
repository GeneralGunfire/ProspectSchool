<!-- converted from Prospect_Research_Report.docx -->



+Research Report
A Unified Digital Platform for School Information Access and Early Academic Intervention
Development period covered: 27 April 2026 – 11 July 2026 (10 weeks)





# + 1. INTRODUCTION
South Africa's school system is deeply unequal in resourcing. While well-funded schools can afford commercial school-management software, many schools — particularly in townships, rural areas, and lower-fee-paying quintiles — run on paper registers, spreadsheets, and informal communication such as WhatsApp groups and printed notices. This creates three compounding problems that this project set out to investigate:
- Information fragmentation — marks, attendance, behaviour, and homework live in different, or no, systems, so no single person has a complete picture of a student.
- Reactive rather than proactive intervention — a student can be quietly failing for weeks before a teacher notices, because noticing requires manually reviewing every mark sheet.
- Unequal access to guidance — students without access to a career counsellor have no easy way to know whether their current marks are on track for the degree or APS score they need.
The research question guiding this project was: can a single, affordably-built, role-based web platform meaningfully close these gaps?
# + 2. LITERATURE REVIEW AND BACKGROUND RESEARCH
Before writing any code, approximately 1.5 weeks were spent on structured background research across four areas, summarised below and expanded in the Research Plan (Section 1.1).
## 2.1 South African school administrative structure
Research into how South African schools are structured administratively clarified the relationship between a school admin, subject teachers, homeroom/form teachers, and how classes and cohorts are organised by grade — this directly shaped the platform's core data model (schools → cohorts/classes → students, with teachers and subjects linked via join tables).
## 2.2 The NSC / APS admissions system
The National Senior Certificate and Admission Point Score system determines how South African universities calculate admission scores from a learner's best six subjects, including specific rules for Life Orientation and Home Language versus First Additional Language marks. Because these rules and the specific point cut-offs vary by institution and are updated annually, the published 2026 admission requirement pages of individual universities were used as the ground-truth source for validating the APS calculator, rather than relying on generalised summaries (validation results in Section 4.5).
## 2.3 Existing commercial school platforms
Commercial systems such as D6 Communicator and comparable SchoolAdmin-style platforms were reviewed at a high level to understand what a “standard” feature set looks like — announcements, marks, attendance — and, more importantly, where they fall short for lower-resourced schools: licensing cost, implementation complexity requiring dedicated IT support, and a near-universal lack of proactive at-risk detection or intervention tracking. These systems tend to be reporting-only rather than action-oriented, which became a key differentiator for this project's design.
## 2.4 Early-warning indicators in education research
General education-technology literature on early-warning indicator systems (EWIS) identifies declining trend, inter-assessment volatility, and proximity to a high-stakes exam as reliable, well-established risk signals, and consistently reports that transparent, explainable systems achieve higher end-user trust and adoption than opaque scoring models. This literature directly informed the rule-based (rather than machine-learned) design of the At-Risk Engine, prioritising a transparent, explainable rule set that a teacher can inspect and trust over a statistically optimised but opaque score.
## 2.5 Informal teacher consultation
Informal discussions with two practising teachers surfaced three recurring frustrations that shaped the product's priorities: that struggling students are typically noticed only once it is already too late to intervene effectively; that there is no existing way to determine whether extra help given to a student actually worked; and that parents typically only hear from the school once a problem has already become serious. These themes are not treated as a formal qualitative study — they informed problem definition and prioritisation only, and are flagged as such in the References (Section 8).
This research directly shaped two decisions that differentiate the project from a generic school app: first, that every “intelligent” feature had to show its reasoning rather than only a score; second, that intervention tracking had to be a closed loop — assign, then later measure — rather than a one-way action log.
# + 3. DESIGN AND DEVELOPMENT PROCESS
## 3.1 Architecture decisions
- React 19 + Tailwind CSS 4 + Vite for the frontend, chosen for fast iteration and because Tailwind's utility classes let a small team maintain visual consistency across four different portals without a heavy custom design-system build.
- Supabase (PostgreSQL) for the backend, chosen because it is free at small scale, requires no server management, and provides Row Level Security — meaning data isolation between schools can be enforced at the database layer rather than trusted purely to application code. This was a deliberate choice given the project's goal of remaining viable for under-resourced schools with no dedicated IT budget.
- PIN-based authentication (school code + role code + a 10-digit PIN, hashed before storage) instead of email/password or third-party auth — a conscious accessibility trade-off, since many students and parents in the target context do not have a reliable personal email address, but everyone can be handed a printed code. The security trade-offs of this approach (no rate limiting, no lockout, PIN-only) are acknowledged as a limitation (Section 6) appropriate for a proof-of-concept rather than a production deployment handling real learner data.
- No third-party AI/ML services — all “smart” features are pure functions computed client-side from real data already on the page, so that every number shown to a teacher or student can, in principle, be explained back to them in plain language.
## 3.2 Build order and iteration
Development proceeded across six overlapping phases (full week-by-week detail in the accompanying Development Journal). The Intelligence Layer and later Full Role Coverage phases ran longer than initially scheduled as scope grew organically from testing feedback.
### Phase 1 — Foundational information architecture
Authentication, the four dashboard shells, basic announcements/resources/homework tracking, and marks entry. This established the core data model: schools → cohorts/classes → students, with teachers and subjects linked via join tables.
### Phase 2 — The intelligence layer
This is where the bulk of the original research question was actually tested. Three components were built:
- A correlation analytics layer connecting resource downloads and announcement views to measurable outcomes (e.g. homework completion lift), testing whether engagement data alone was a useful signal.
- An explainable At-Risk Engine: a rule-based classifier (not a trained model) flagging a student as High or Medium risk based on a documented, inspectable rule set — for example, an average below 50% combined with an exam within 14 days, or three or more concurrent risk reasons. Every flag is shown to the teacher alongside the specific reasons behind it.
- An intervention pipeline: teachers can assign a coaching recommendation from three entry points — a one-click “Assign” on the dashboard, a bulk campaign from a mark sheet, or the At-Risk Engine itself — all writing to the same underlying tables and scored by the same outcome formula (improved / declined / unchanged, based on mark delta).
### Phase 3 — Full role coverage
Admin tooling (class/teacher/student management, a drag-and-drop Timetable Builder with real-time clash detection), a strictly read-only Parent portal (deliberately read-only to avoid disputes over after-the-fact record changes), and Behaviour (merits/demerits) and Homeroom attendance tracking.
### Phase 4 — Student-facing planning tools
“My Future,” combining an APS calculator built against real published South African university admission formulas, a RIASEC-style career-interest quiz, and degree-matching against APS requirements — directly targeting the “unequal access to guidance” problem identified in research, since this functionality is normally only available through a paid counsellor or commercial careers app.
### Phase 5 — Additional modules driven by continued research and feedback
Topic Tests (a CAPS-aligned diagnostic testing system with sub-skill and misconception-level reporting, not just a percentage score), a Marketplace for second-hand school supplies (addressing an access-to-resources problem outside pure academics), and Grade 9→9’s to 10 Subject Selection workflows.
### Phase 6 — Consistency and polish pass
A full visual redesign unifying all four portals under one design system, with particular attention to mobile usability, given that household internet access in the target context is frequently mobile-first rather than desktop-first.
# + 4. FINDINGS
## 4.1 Manual review versus the At-Risk Engine (quantified comparison)
Following the evaluation procedure defined in the Research Plan (Section 8), both conditions were run against the identical 32-student, 96-record synthetic dataset, in which 14 students were deliberately engineered to match a known at-risk profile (6 consistently weak, 4 gradually declining, 4 high-volatility).
The manual condition missed all four high-volatility profiles — students whose marks swung widely but whose average remained above the conventional “fail” threshold — which matches the education-literature finding (Section 2.4) that volatility is a risk signal humans reliably under-weight when scanning for low averages. The engine surfaced these correctly because volatility is one of its explicit, documented rule conditions rather than something a reviewer must notice unaided.
## 4.2 Explainability changed tester trust in the output
Early internal builds displayed only a numeric risk percentage. During internal usability testing, testers were noticeably more hesitant to act on a bare percentage than on the later version, which lists the specific reasons behind a flag (for example, “average dropped from 68% to 51% over the last 3 results; exam in 9 days”). This observation directly supports the research decision to prioritise a rule-based, inspectable engine over a black-box score, and is consistent with the adoption/trust finding reported in the EWIS literature reviewed in Section 2.4.
## 4.3 Closing the intervention loop surfaces information a one-way log cannot
Once outcomes were tracked and fed back into an ROI ranking, it became possible, for the first time in the system's development, to see which type of intervention tended to actually work for a given kind of struggling student — a capability that was absent from every manual process encountered during background research (Section 2.5).
## 4.4 A single shared data model benefits every role simultaneously
Because Parent, Student, Teacher, and Admin views all read from the same underlying tables, a mark entered once by a teacher is immediately visible, appropriately scoped, to the student and their parent, and simultaneously feeds the At-Risk Engine and the My Future APS tracker — directly addressing the fragmentation problem identified in research, without any manual re-entry or syncing step.
## 4.5 APS / career-matching validation
The APS calculator and degree-matching logic were checked against real, published 2026 admission requirement pages for 10 programmes across 4 South African universities. All 10 produced a correct APS requirement match, though this validation surfaced an explicit lesson: the calculator is only as trustworthy as its underlying data, and required real published figures rather than approximations to be usable with confidence.
# + 5. DISCUSSION
The findings support the hypothesis that a single, well-designed, role-based information platform can meaningfully close both the information-fragmentation gap and the reactive-intervention gap identified in the background research, without requiring paid AI services or dedicated IT staff. The explainability requirement, in particular, turned out to be more important in practice than initially expected — it was not merely an ethical nicety but a functional requirement for teacher trust and adoption, directly reflected in the trust difference observed between the bare-score and reasoned-flag versions of the At-Risk Engine (Section 4.2).
A subtler finding also emerged: the value of the platform compounds across roles. No single feature — marks entry, or the risk engine, or the parent portal — fully answers the research question on its own; it is specifically the fact that all four roles share one data model that turns a set of individually useful tools into something that closes the loop end-to-end: a teacher notices, assigns help, a parent can see that it happened, an outcome is measured, and the next recommendation is better informed.
## 5.1 Threats to validity
- Internal validity: the synthetic dataset was designed by the same person who built the At-Risk Engine, which risks the rule set being implicitly tuned to the test cases it was validated against. This is mitigated only partially by grounding the rule thresholds in independent EWIS literature rather than post-hoc fitting them to the dataset.
- External validity: a 32-student synthetic dataset cannot capture the scale, noise, and adoption variance of a real school with hundreds of students and multiple teachers of varying data-entry diligence.
- Construct validity: “time to identify at-risk students” is a reasonable proxy for real-world proactive intervention capacity, but was not tested against an actual behavioural outcome (e.g. whether a real teacher, under real time pressure, would in fact check the dashboard).
# + 6. LIMITATIONS
- Development and testing used synthetic, constructed data, not a real school deployment — real classroom noise (inconsistent data entry, partial adoption, absentee teachers) was not tested.
- The At-Risk Engine's thresholds (e.g. “average below 50%”) were set from general early-warning research and informal teacher discussion, not calibrated against a real school's actual pass/fail distribution — a real pilot would need this tuning.
- PIN-based authentication, chosen deliberately for accessibility, is not suitable for a production system handling real personal information without additional hardening (rate limiting, lockout, audit logging) — flagged here as future work, not oversight.
- Ten weeks is a short window for a system this broad; feature breadth was, in places, prioritised over exhaustive automated test coverage, particularly for the newest modules (Marketplace, Subject Selection).
- The quantified comparison in Section 4.1 was conducted by a single reviewer on a single dataset; a larger, blinded, multi-reviewer study would be needed to generalise the specific timing and recall figures reported.
# + 7. CONCLUSION
Within the scope of a ten-week research and development project, the evidence gathered supports the conclusion that a unified, role-based, explainable school information platform can plausibly improve access to accurate academic information and enable earlier, evidence-based intervention in a South African school context — and that this is achievable without expensive infrastructure, paid third-party AI, or specialist IT staff, provided deliberate accessibility trade-offs (like PIN-based login) are made consciously and their limitations documented. The logical next step, beyond the scope of this project, would be a real, consented pilot in a single school, with a larger and more diverse student population, to validate these findings against genuine usage rather than constructed test data.
# + 8. REFERENCES
[Note: replace the placeholders below with your actual cited sources, teacher interview details, and the specific university admission pages consulted, per your expo's citation requirements.]
- Department of Higher Education and Training (South Africa) — National Senior Certificate and Admission Point Score guidelines. [Insert specific URL/publication and access date.]
- Individual South African university admission requirement pages (2026 intake), consulted for the 10-programme APS validation described in Section 4.5. [Insert specific institution names, faculties, and URLs.]
- General early-warning-indicator education research (declining trend / volatility / proximity-to-assessment as risk indicators). [Insert specific paper(s), author(s), and year(s) consulted.]
- Protection of Personal Information Act (POPIA), Republic of South Africa — consulted regarding lawful processing requirements for learner data (Research Plan, Section 10). [Insert Act number/citation.]
- Informal discussions with two practising teachers on current record-keeping and intervention practices — unstructured, not a formal study; informed problem definition only. [Insert anonymised role/context if permitted by your expo's ethics requirements.]
| PROSPECT
Nizamye Primary and High School
Computer Science / Software Engineering | Rajen Chetty
Njabulo Huzayfa Mkandla |
| --- | --- |
| PREPARED BY
Rajen Chetty
Njabulo Huzayfa Mkandla
Nizamye Primary and High School | DOCUMENT ISSUED
12 July 2026
CATEGORY
Computer Science / Software Engineering |
| --- | --- |
| Metric | Manual mark-sheet review | At-Risk Engine dashboard |
| --- | --- | --- |
| Time to complete review | ≈ 27 minutes | ≈ 3 minutes |
| At-risk students correctly identified (recall) | 10 / 14 (71%) | 14 / 14 (100%) |
| Stable students incorrectly flagged (false positives) | 1 / 18 | 1 / 18 |
| Volatile-profile students missed | 4 / 4 missed | 0 / 4 missed |