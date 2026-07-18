<!-- converted from Prospect_Research_Plan.docx -->



+Research Plan
A Unified Digital Platform for School Information Access and Early Academic Intervention
Planned duration: 10 weeks (27 April 2026 – 5 July 2026; development continuing to 11 July 2026)





# + 1. BACKGROUND AND RATIONALE
South African schools vary enormously in resourcing. Well-resourced schools often already use commercial school-information systems such as D6 Communicator or SchoolAdmin-style platforms. Under-resourced schools frequently do not: marks live in spreadsheets or paper registers, parents hear about problems only at report-card time or a parent evening, and career and subject-choice guidance is inconsistent because dedicated counsellors are rare outside well-funded quintiles. This project investigates whether it is possible to close this gap without requiring a school to pay for expensive software or hire dedicated IT staff.
## 1.1 Literature and Prior Work Review
Three bodies of prior work informed the design of this project.
### (a) Early-warning systems in education
Education-technology research on “early warning indicator systems” (EWIS) consistently identifies three signal types as reliable predictors of eventual academic failure: (i) a declining performance trend across consecutive assessments, (ii) high volatility between assessments (a student whose marks swing widely is at similar risk to one who is consistently low, but is far more easily missed by a human reviewer scanning for low averages), and (iii) proximity to a high-stakes assessment combined with either of the above. This literature also consistently reports that EWIS tools are adopted more readily, and used more consistently, when the system exposes its reasoning to the end user rather than presenting an unexplained composite score — the same trust dynamic we later observed directly in our own testing (Section 4 of the Research Report).
### (b) The National Senior Certificate (NSC) and Admission Point Score (APS) system
South African public universities calculate an applicant's APS from their best six recognised NSC subjects, with specific, non-obvious rules governing Life Orientation (typically weighted or excluded depending on the institution) and the treatment of a learner's Home Language versus First Additional Language marks. Because these rules differ meaningfully between institutions and faculties, and because published requirements change from one admissions cycle to the next, we treated the Department of Higher Education and Training's published NSC/APS guidance and individual universities' own published 2026 admission requirement pages as the ground truth against which the APS calculator and degree-matching logic were validated, rather than relying on second-hand summaries.
### (c) Existing commercial school-management platforms
A high-level review of commercial systems such as D6 Communicator and comparable SchoolAdmin-style platforms found a broadly consistent feature set — announcements, digital mark capture, attendance — but two consistent gaps relevant to this project's research question: these systems are almost universally reporting-only (they surface data but do not proactively flag risk or track whether an intervention worked), and they typically require either a paid subscription tier, dedicated on-site IT support, or both, which places them out of reach for many under-resourced schools.
### (d) POPIA and data protection context
The Protection of Personal Information Act (POPIA) governs the lawful processing of personal information in South Africa, including that of minors, and requires a defined lawful basis, purpose limitation, and appropriate security safeguards for any system that would process real learner data. This directly shaped the project's decision to use only synthetic data during development (Section 10) and to explicitly flag POPIA compliance as a precondition for any future real-school pilot.
# + 2. RESEARCH QUESTION
Primary question: Can a single, affordably-built, role-based web platform improve access to accurate academic information and enable earlier, evidence-based intervention for at-risk students in a South African school context?
Sub-questions:
- What specific information gaps exist between what schools currently track and what teachers, students, and parents actually need to see?
- Can “at-risk” identification be done transparently (rule-based, explainable) using data a school already has, instead of requiring a black-box AI model?
- Does closing the loop on interventions — recording whether a coaching action actually improved a mark — change how interventions are chosen over time?
- Can career and tertiary planning (APS score tracking, degree requirement matching) be meaningfully self-served by a student without a counsellor, using only publicly available admission requirements?
# + 3. HYPOTHESIS
If a single platform gives teachers, students, parents, and admin staff role-appropriate, real-time access to the same underlying academic data, then at-risk students will be identifiable earlier and more consistently than under manual, paper-based methods, because the marginal cost of checking on a student — previously, manually reviewing paper mark sheets — is reduced to near zero and made proactive rather than reactive.
## 3.1 Falsifiability
This hypothesis would be falsified if, on an identical dataset, a manual reviewer identified the same at-risk students in equal or less time than the At-Risk Engine dashboard, or if the engine's flags did not correspond to students who were later confirmed (by the dataset's designed profiles) to be genuinely at risk. Section 8 defines the specific measurements used to test this.
# + 4. OBJECTIVES
- Identify, through research into South African school administration practice and the NSC/APS system, the core information workflows a school platform must support.
- Design a data model and role system (Admin / Teacher / Student / Parent) that reflects how a real school is structured.
- Build and iteratively test a working system implementing authentication, marks and analytics, an explainable at-risk engine, an intervention-tracking pipeline, attendance/behaviour tracking, a timetable system, and a career/APS planning tool.
- Evaluate the system against realistic simulated school data, using defined, repeatable measurements, to assess whether it plausibly improves on manual methods.
- Document constraints, limitations, and what would be required for real-world piloting.
# + 5. METHODOLOGY
This is a design-science / applied engineering research project. The primary research method is iterative build-test-refine cycles, grounded in background research into South African school administrative practice, NSC/APS admissions requirements, and established early-warning-system and software engineering practice, validated through structured internal testing against constructed sample data rather than a live school deployment (see Section 9, Limitations).
## 5.1 Phases
# + 6. VARIABLES (DESIGN-SCIENCE FRAMING)
- Independent variable: presence or absence of the platform's explainable At-Risk Engine and intervention tracking, compared against a manual “read every mark sheet” baseline.
- Dependent variables: time-to-identify an at-risk student (minutes); proportion of designed at-risk profiles correctly identified (recall); number of information touchpoints a parent has access to.
- Controlled elements: an identical underlying dataset (mark sheets, subjects, students) is used for both the manual-review condition and the engine-assisted condition during testing.
# + 7. MATERIALS / TOOLS
- Frontend: React 19, Tailwind CSS 4, Vite
- Backend / Database: Supabase (managed PostgreSQL, Row Level Security, Storage)
- Testing: Playwright (automated UI testing), manual QA and timed comparison testing against constructed sample data
- Deployment: Vercel
No paid APIs and no third-party AI/ML services were used — all analytics and “intelligence” are computed locally, from first principles, as pure functions.
# + 8. EVALUATION PLAN
## 8.1 Dataset construction
A synthetic dataset was constructed comprising 4 classes, 2 subjects per class, and 12 assessment events per subject spanning two academic terms (96 student-subject performance records in total across 32 individual students). Fourteen of the 32 students were deliberately engineered to match one of three at-risk profiles identified in the literature review (Section 1.1a): 6 consistently weak (average below 50% throughout), 4 gradually declining (a downward trend of at least 15 percentage points across the term), and 4 high-volatility (swings of 20+ percentage points between consecutive assessments despite an average above the conventional “fail” threshold). The remaining 18 students were given stable, non-at-risk performance profiles to test for false positives.
## 8.2 Comparison procedure
- Condition A (manual): a reviewer is given only printed/exported mark sheets for the dataset and asked to identify every at-risk student, timed from start to completion.
- Condition B (engine-assisted): a reviewer opens the At-Risk Engine's teacher dashboard against the identical dataset and is timed from login to having identified the same set of students.
- Both conditions are scored for recall (proportion of the 14 designed at-risk students correctly identified) and false-positive rate (stable students incorrectly flagged).
## 8.3 Additional validation steps
- Walk through the full intervention lifecycle (assign → student completes recommended action → outcome recorded) and confirm the effectiveness measurement is computed consistently regardless of which of the three entry points created the intervention.
- Validate the APS calculator and degree-matching logic against real, published 2026 South African university admission requirements for a sample of at least 10 programmes across at least 4 institutions.
- Conduct a structured UI/accessibility pass on all four portals to check for consistency and usability, particularly on mobile devices, given that South African households are disproportionately mobile-first for internet access.
# + 9. ANTICIPATED LIMITATIONS
- No live pilot in an actual functioning school with real students during the research window — evaluation is against constructed, realistic sample data, which cannot fully capture real classroom noise (inconsistent data entry, partial adoption, absentee teachers).
- The At-Risk Engine is rule-based, not a trained statistical or machine-learning model — a deliberate transparency choice, but one that means it will not adapt automatically to a specific school's context over time without manual threshold recalibration.
- Single-developer / small-team build over ten weeks — feature breadth was, in places, prioritised over exhaustive automated edge-case testing.
- PIN-based authentication was chosen for accessibility and simplicity for non-technical school staff and learners without reliable personal email — a deliberate security/usability trade-off discussed further in the Research Report.
- The synthetic dataset, while designed against real early-warning-indicator literature, is necessarily smaller (32 students) than a real school cohort, which may understate false-positive risk at scale.
# + 10. ETHICAL CONSIDERATIONS
All data used in development and testing is fictional and synthetic — invented student names, invented marks, no real learner records at any point during the research or development period. Should the platform proceed to a real pilot, informed consent from the school and parents, and full compliance with the Protection of Personal Information Act (POPIA) — including a defined lawful basis for processing, purpose limitation, data minimisation, and appropriate technical security safeguards — would be required before any real student data is entered into the system.
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
| Phase | Weeks | Focus |
| --- | --- | --- |
| 1. Background research & problem definition | 1–2 | Teacher discussions, review of existing school systems, review of NSC/APS requirements, data model definition |
| 2. Core information architecture | 2–3 | Auth/roles, database schema, base dashboards, marks, announcements, resources |
| 3. Intelligence layer | 3–5 | At-risk engine, intervention pipeline, outcome tracking, engagement analytics |
| 4. Full role coverage | 5–7 | Admin tooling (classes, teachers, timetable), Parent portal, Behaviour/attendance, Homeroom |
| 5. Student-facing planning tools | 6–8 | My Future (APS calculator, career quiz, degree matching), Topic Tests, Past Papers |
| 6. Polish, redesign, additional modules | 8–10 | Visual/UX redesign across all portals, Marketplace module, Subject Selection workflow, consistency pass |
| 7. Evaluation & documentation | 10 | Testing against sample data, writing up report, journal, and this plan |