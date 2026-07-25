PROSPECT
Nizamiye Primary and High School
Computer Science / Software Engineering

Prepared by: Rajen Chetty, Njabulo Huzayfa Mkandla
Document issued: 12 July 2026


RESEARCH REPORT

A Unified Digital Platform for School Information Access and Early Academic Intervention

Development period covered: 27 April 2026 - 11 July 2026 (10 weeks)


1. INTRODUCTION

South Africa's school system isn't resourced evenly. Well-funded schools can afford commercial school-management software, but a lot of schools - especially in townships, rural areas, and lower-fee schools - run on paper registers, spreadsheets, and WhatsApp groups. This creates three problems we wanted to look into:

1. Information is scattered - marks, attendance, behaviour, and homework live in different places (or nowhere), so nobody has the full picture of a student.
2. Help comes too late - a student can be quietly failing for weeks before a teacher notices, because noticing means manually going through every mark sheet.
3. Guidance isn't equal - students without a tutor or career counsellor have no easy way to know if their marks are on track for the degree they want.

The question guiding this project: can one affordable, role-based web platform actually close these gaps?

2. BACKGROUND RESEARCH

Before writing any code, we spent about 1.5 weeks researching four areas (more detail in the Research Plan, Section 1.1).

2.1 How South African schools are structured
We looked into how a school admin, subject teachers, and homeroom teachers relate to each other, and how classes are organised by grade. This directly shaped our data model: schools contain cohorts/classes, which contain students, with teachers and subjects linked through join tables.

2.2 The NSC/APS system
South African universities calculate admission scores from a learner's best six subjects, with specific rules around Life Orientation and Home Language vs First Additional Language. Because these rules and cut-offs change every year and differ by institution, the intention from the outset was to validate the APS calculator against real, published admission pages rather than relying on summaries. This validation had not yet been carried out at the time of writing (see Section 4.4 and Recommendations).

2.3 Existing commercial school platforms
We looked at systems like D6 Communicator at a high level to see what a "normal" feature set looks like - announcements, marks, attendance - and where they fall short for under-resourced schools: cost, needing dedicated IT support, and almost never doing anything proactive about at-risk students. They're built to report data, not act on it. That gap became a key part of what we tried to do differently.

2.4 Early-warning research in education
General research on early-warning systems points to three reliable signals: a declining trend, volatility between assessments, and being close to an exam while already struggling. It also consistently found that people trust and use these systems more when the reasoning is visible, not hidden behind a score. This is what pushed us toward a rule-based (not machine-learned) At-Risk Engine - one a teacher can actually inspect and trust.

2.5 Talking to teachers
We had informal conversations with two practising teachers, and three things kept coming up: struggling students are usually noticed too late to help effectively; there's no easy way to know if extra help actually worked; and parents usually only hear from the school once something has already gone wrong. This wasn't a formal study - just conversations that shaped what we prioritised.

This research led to two decisions that shaped the whole project: every "smart" feature had to show its reasoning, not just a score, and intervention tracking had to be a closed loop (assign help, then actually check later if it worked) instead of a one-way list.

3. DESIGN AND DEVELOPMENT

3.1 Why we built it this way

- React 19 + Tailwind + Vite for the frontend - fast to iterate on, and Tailwind let two people keep five different portals visually consistent without building a whole design system from scratch.
- Supabase (Postgres) for the backend - it's free at small scale, needs no server management, and Row Level Security means data stays isolated between schools at the database level, not just trusted to the app code. Important for a project aimed at schools with no IT budget.
- PIN-based login (school code + role code + a 10-digit PIN, hashed with SHA-256) instead of email/password - a deliberate trade-off, since a lot of students and parents in this context don't have a reliable personal email, but everyone can be handed a printed code. The security trade-offs here (no rate limiting, no lockout) are a real limitation for a production system, discussed in Section 6.
- No third-party AI - every "smart" feature is a plain function running in the browser on real data already on the page, so any number shown to a teacher or student can be explained in plain language if they ask.

3.2 How the build actually went

Development happened across six overlapping phases (full week-by-week detail is in the Journal). The Intelligence Layer and Full Role Coverage phases both ran longer than planned as the scope grew.

Phase 1 - Core system: login, five dashboards, basic announcements/resources/homework tracking, and marks entry. This set up the core data model.

Phase 2 - The intelligence layer: this is where the actual research question got tested. We built a correlation layer connecting resource downloads and announcement views to outcomes like homework completion; an At-Risk Engine that flags students High or Medium risk using a documented rule set (e.g. a low average combined with an upcoming exam, or several risk reasons at once) and always shows the reasons; and an intervention pipeline where teachers can assign coaching help from three different entry points (a one-click Assign button, a bulk campaign from a mark sheet, or the At-Risk Engine itself), all scored the same way afterward.

Phase 3 - Full role coverage: admin tools (managing classes, teachers, students), a drag-and-drop Timetable Builder with clash detection, a strictly read-only parent portal (deliberately read-only, to avoid disputes over changed records), and behaviour/homeroom attendance tracking.

Phase 4 - Student planning tools: "My Future" - an APS calculator, a career-interest quiz, and degree matching. This directly targets the guidance gap, since this kind of tool is normally only available through a paid counsellor.

Phase 5 - Extra modules: Topic Tests (CAPS-aligned, with sub-skill-level feedback rather than just a percentage), a Marketplace for secondhand school supplies, and a Grade 9-to-10 Subject Selection workflow (student selection, teacher approval, and admin oversight).

Phase 6 - Polish: a full visual redesign across all five portals so they felt like one product, with extra attention to mobile, since a lot of households access the internet mainly through a phone.

4. FINDINGS

4.1 Feature completeness and functional verification

Every module described in Section 3.2 is built and operating: the At-Risk Engine, the intervention pipeline with outcome tracking, digital mark sheets, attendance and behaviour tracking, the timetable builder, the parent portal, the My Future career/APS toolkit, Topic Tests, the Marketplace, and Subject Selection. Functional correctness was verified through a combination of automated end-to-end browser tests (Playwright) simulating real user sessions, and manual testing of each portal by both team members.

4.2 Explaining the reasoning changed how much people trusted it, in informal testing

Early versions of the At-Risk Engine showed only a risk percentage. Once we changed it to show the actual reason for a flag instead - for example, a specific drop in average alongside a nearby exam date - both of us, testing it informally on ourselves and each other, were noticeably more willing to trust and act on a flag with a stated reason than on a bare number. This is consistent with what the early-warning-system literature we reviewed in Section 2.4 predicted, but it was not tested formally with independent teacher participants, and should be treated as an informal, internal observation rather than a measured result.

4.3 Closed-loop intervention tracking is a genuine gap in existing systems

Because the intervention pipeline records whether help was assigned, started, completed, and whether the outcome afterward actually improved, the system can in principle surface which type of intervention tends to help which kind of struggling student - something none of the manual or commercial systems we reviewed in Section 2.3 do at all. This capability exists in the built system; a data-backed analysis of which intervention types are most effective would require real usage data over time, which the project has not yet collected.

4.4 Planned evaluations not yet conducted

Two evaluations were planned from the outset of this project but had not been carried out by the time of writing, and are reported here honestly rather than with invented figures:

- A controlled, timed comparison of manual mark-sheet review against At-Risk Engine-assisted review, using a synthetic dataset of 32 students (14 deliberately built to be at-risk), as described in the Research Plan, Section 8. The synthetic dataset itself has not yet been built.
- A systematic check of the APS calculator and degree-matching logic against current, published university admission requirements across multiple institutions. This validation is necessary before the APS tool's output can be presented as reliable, and is the top priority before any pilot use by real students.

Both are identified as immediate next steps in Section 8 (Recommendations) and Research Plan Section 8.

4.5 One shared data model helps everyone at once

Because every role reads from the same underlying tables, a mark entered once by a teacher shows up immediately (properly scoped by role and permissions) for the student and their parent, and feeds both the At-Risk Engine and the APS tracker - with no extra data entry needed anywhere. This architectural property was verified functionally (entering a mark as a teacher and confirming it appears correctly in the student and parent views) but was not separately quantified.

5. DISCUSSION

The functional completeness of the system supports the feasibility of the underlying idea: that one well-designed, role-based platform can unify school administration and career guidance without needing paid AI or dedicated IT staff. The informal observation in Section 4.2 - that explainability affected our own willingness to trust a flag - is consistent with the literature reviewed in Section 2.4, but because it was observed by the two people who built the system rather than by independent test users, it cannot be treated as evidence on its own. A proper test would involve teachers who did not build the system reacting to both an unexplained and an explained version of the same flag.

Similarly, while the shared data model in Section 4.5 is real and functionally verified, no claim is made here about how much time it would actually save a real teacher, since that has not been measured against a real alternative workflow.

5.1 Where this could be wrong

- Because the comparative evaluation in Section 4.4 has not been run, the core hypothesis in the Research Plan - that the engine identifies at-risk students faster and more completely than manual review - remains untested, not confirmed. The system's design is grounded in general research on early-warning indicators, but that research was conducted in other contexts, not validated against this specific implementation.
- Our informal trust observation in Section 4.2 involved only the two of us and is a weak form of evidence; a real test would need independent teachers unfamiliar with the system's internals.
- The APS calculator's outputs should not be treated as accurate for real student decisions until the validation described in Section 4.4 is completed.

6. LIMITATIONS

- All testing to date has used made-up data, not a real school - real classroom messiness (inconsistent entry, partial adoption, teachers who don't use it) has not been tested.
- The controlled manual-vs-engine comparison and the APS validation against published requirements, both planned from the start of the project, were not completed within the ten-week window (see Section 4.4).
- The At-Risk Engine's thresholds came from general research and a couple of informal conversations with teachers, not from a real school's actual data - a real pilot would need this tuned properly.
- PIN-based login, while good for accessibility, isn't secure enough for real personal data without more work (rate limiting, lockouts, audit logs) - this is flagged as future work, not something we missed.
- Ten weeks isn't much time for a system this broad, so in a few newer areas (Marketplace, Subject Selection) feature coverage was prioritised over exhaustive testing.

7. CONCLUSION

Within this ten-week project, a fully functional, role-based platform was designed and built that unifies school administration and career guidance, demonstrating that this is achievable without expensive infrastructure or a dedicated IT team, as long as trade-offs like PIN-based login are made deliberately and documented honestly. What this project has not yet established is whether the At-Risk Engine measurably outperforms manual review, or whether the APS calculator's figures match current published requirements - both are necessary, concrete next steps before any claim of real-world impact can be made, and both are achievable in the short term given that the underlying system is already built and functional. The obvious next step beyond that is a real pilot in an actual school with a larger, more varied group of students.

8. RECOMMENDATIONS

It is recommended that: (a) the synthetic 32-student dataset described in Research Plan Section 8.1 be built and the timed manual-vs-engine comparison be actually conducted before any quantitative claim of the engine's advantage is made public; (b) the APS calculator and degree-matching logic be validated against current, published university admission requirements before it is used by real students to make subject or application decisions; (c) a pilot deployment be arranged with at least one South African high school to gather real usage data; (d) a formal security and POPIA compliance review be conducted before any pilot involving real student data; and (e) automated test coverage be extended to the more recently added modules (Marketplace, Subject Selection) to match the coverage of earlier features.

9. REFERENCES

[Replace the placeholders below with the actual sources, teacher details, and specific admission pages used, according to your expo's citation rules.]

- Department of Higher Education and Training (South Africa) - National Senior Certificate and Admission Point Score guidelines. [Insert specific URL/publication and access date.]
- General early-warning-indicator education research. [Insert specific paper(s), author(s), year(s).]
- Protection of Personal Information Act (POPIA), Republic of South Africa. [Insert Act number/citation.]
- Informal conversations with two practising teachers about record-keeping and intervention practices - not a formal study, used only to inform the problem definition. [Insert anonymised role/context if your expo's ethics rules require it.]
