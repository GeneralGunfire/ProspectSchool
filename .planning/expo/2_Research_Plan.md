PROSPECT
Nizamiye Primary and High School
Computer Science / Software Engineering

Prepared by: Rajen Chetty, Njabulo Huzayfa Mkandla
Document issued: 12 July 2026


RESEARCH PLAN

A Unified Digital Platform for School Information Access and Early Academic Intervention

Planned duration: 10 weeks (27 April 2026 - 5 July 2026, development continued to 11 July 2026)


1. BACKGROUND AND RATIONALE

South African schools are resourced very unevenly. Wealthier schools can afford commercial systems like D6 or SchoolAdmin. Poorer schools usually can't - marks live in spreadsheets or paper registers, parents find out about problems at report-card time, and career guidance is inconsistent because most schools don't have a dedicated counsellor. This project looks at whether we can close that gap without asking a school to pay for expensive software or hire IT staff.

1.1 What we looked into first

Before writing any code, we researched a few things:

(a) Early-warning systems in education
Research on "early warning indicator" systems generally agrees on three useful signals: a declining trend across assessments, high volatility between assessments (a student whose marks swing around is often missed by someone just scanning for low averages), and being close to a big exam while already struggling. The research also kept pointing out that people trust and actually use these systems more when they can see the reasoning, not just a score.

(b) The NSC and APS system
South African universities work out an applicant's APS from their best six subjects, with specific rules around Life Orientation and Home Language vs First Additional Language that aren't obvious and differ by university. Because these rules and cut-offs change every year, we intended to use the actual published admission pages from real universities as our source of truth for the APS calculator, rather than relying on summaries — this validation is scheduled as the next phase of the project (see Section 8.3).

(c) Existing school platforms
We looked at commercial systems like D6 Communicator at a high level. They mostly cover the same basics - announcements, marks, attendance - but two things stood out: they're reporting-only (they show you data but don't flag risk or track whether help worked), and they usually need a paid subscription or dedicated IT support, which rules them out for a lot of schools.

(d) POPIA and data protection
POPIA governs how personal information (including minors' data) can be processed in South Africa. This is part of why we only ever used made-up data during development, and why any real pilot would need proper consent and compliance before touching real student information.

2. RESEARCH QUESTION

Main question: Can a single, affordable, role-based web platform improve access to accurate school information and help teachers step in earlier for at-risk students?

Sub-questions:
1. What information gaps actually exist between what schools track and what teachers, students, and parents need to see?
2. Can "at-risk" flagging be done transparently - using rules a teacher can understand - instead of a black-box model?
3. Does tracking whether an intervention actually worked change how teachers choose interventions over time?
4. Can career and university planning be handled by the student themselves, without a counsellor, using only public admission requirements?

3. HYPOTHESIS

If teachers, students, parents, and admin staff all get real-time access to the same underlying data through one platform, at-risk students should be identifiable earlier and more consistently than with manual, paper-based methods - because checking on a student stops being a manual chore and becomes something the system can flag proactively.

This would be proven wrong if a manual reviewer identified the same at-risk students in the same or less time than the dashboard, or if the engine's flags didn't actually match students who were genuinely struggling. Testing this hypothesis requires a controlled comparison (Section 8.2), which is planned but had not been carried out at the time of writing.

4. OBJECTIVES

1. Work out, through research into South African schools and the NSC/APS system, what a school platform actually needs to do.
2. Design a data model and role system (Admin / Teacher / Student / Parent) that matches how a real school works.
3. Build and test a working system: login, marks and analytics, an at-risk engine, intervention tracking, attendance/behaviour, a timetable, and a career/APS tool.
4. Test the system against realistic sample data to see whether it can outperform manual methods.
5. Be honest about the limitations and what a real pilot would need.

5. METHODOLOGY

This is a design-and-build research project - we built the system iteratively, testing and refining as we went, grounded in research into South African schools, the NSC/APS system, and early-warning-system practice. Functional and automated testing were carried out throughout development; the controlled comparison described in Section 8 against constructed sample data is planned as the next phase, since a live school deployment was not possible within this timeframe (see Limitations).

5.1 Phases

Phase 1 - Background research (Weeks 1-2): teacher discussions, reviewing existing school systems, researching NSC/APS rules, defining the data model.

Phase 2 - Core system (Weeks 2-3): login/roles, database, basic dashboards, marks, announcements, resources.

Phase 3 - Intelligence layer (Weeks 3-5): the At-Risk Engine, the intervention pipeline, outcome tracking, engagement analytics.

Phase 4 - Full role coverage (Weeks 5-7): admin tools (classes, teachers, timetable), the parent portal, behaviour/attendance, homeroom.

Phase 5 - Student planning tools (Weeks 6-8): My Future (APS calculator, career quiz, degree matching), Topic Tests, Past Papers.

Phase 6 - Polish and extra features (Weeks 8-10): visual redesign across all portals, the Marketplace, Subject Selection, consistency pass.

Phase 7 - Evaluation and writing up (Week 10): functional and automated testing, writing the report, journal, and this plan. The controlled evaluation in Section 8 is scheduled to follow this submission.

6. VARIABLES

Independent variable: whether the At-Risk Engine and intervention tracking are used, compared against manually reading every mark sheet.

Dependent variables: how long it takes to spot an at-risk student, how many of the genuinely at-risk students actually get caught, and how many information touchpoints a parent has access to.

Controlled: the same dataset would be used for both the manual review and the engine-assisted review, once this comparison is run.

7. MATERIALS / TOOLS

Frontend: React 19, Tailwind CSS 4, Vite
Backend/Database: Supabase (Postgres, Row Level Security, Storage)
Testing: Playwright for automated UI tests, plus manual functional testing
Deployment: Vercel
No paid APIs and no third-party AI - all the "smart" features are computed locally from first principles.

8. EVALUATION PLAN

8.1 Building the test dataset

The plan is to build a synthetic dataset: 4 classes, 2 subjects per class, 12 assessments per subject across two terms - 96 student-subject records across 32 students. Fourteen of the 32 would be deliberately built to look at-risk: 6 consistently weak (always under 50%), 4 gradually declining (dropping 15+ percentage points over the term), and 4 high-volatility (swinging 20+ points between assessments despite an okay average). The remaining 18 would be kept stable, to check the system does not flag students who do not need it. As of this submission, this dataset has not yet been built.

8.2 Comparing manual vs engine-assisted review

Condition A (manual): a reviewer is given only the mark sheets and asked to find every at-risk student, timed from start to finish.
Condition B (engine-assisted): a reviewer opens the At-Risk Engine dashboard on the same dataset, timed the same way.
Both would be scored on recall (how many of the 14 designed at-risk students are found) and false positives (stable students wrongly flagged). This comparison has not yet been conducted.

8.3 Other checks

- Walk through the full intervention flow (assign help, student does it, outcome gets recorded) and confirm the effectiveness calculation works the same no matter which of the three ways an intervention was created.
- Check the APS calculator and degree-matching against real, published current admission requirements across multiple universities and programmes. This validation has not yet been conducted.
- Go through all five portals for consistency and usability, especially on mobile, since a lot of South African households access the internet mainly through a phone.

9. LIMITATIONS WE EXPECT

- No real school has used the platform during the research window - it has been tested against realistic but made-up data, which cannot fully capture real classroom messiness (inconsistent entry, partial adoption, teachers who don't use it).
- The At-Risk Engine uses fixed rules, not a trained model - that's deliberate, for transparency, but it means it won't automatically adjust to a specific school's situation without someone manually tuning the thresholds.
- It was a small team building for ten weeks, so in places we prioritised getting features working over exhaustive edge-case testing and over the controlled evaluation described in Section 8.
- PIN-based login was chosen for accessibility, which is a real trade-off - discussed further in the Research Report.
- A 32-student dataset, once built, would still be much smaller than a real school, which could hide false-positive problems that would show up at real scale.

10. ETHICS

All data used in development and testing was made up - invented names, invented marks, no real student data at any point. If this were ever piloted in a real school, we'd need informed consent from the school and parents, and full compliance with POPIA (South Africa's data protection law) before any real student data went anywhere near the system.
