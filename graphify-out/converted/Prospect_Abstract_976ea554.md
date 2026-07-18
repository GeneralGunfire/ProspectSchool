<!-- converted from Prospect_Abstract.docx -->



+Abstract
A Unified Digital Platform for School Information Access and Early Academic Intervention
A design-science research and engineering project investigating equitable access to academic information in South African schools





# + PROBLEM STATEMENT
South African schools are unevenly resourced. Well-funded schools can license commercial school-information systems, but many under-resourced schools — particularly in townships, rural areas, and lower fee-paying quintiles — still coordinate academic records, parent communication, and career guidance through paper mark sheets, WhatsApp groups, and physical notice boards. This fragmentation creates three compounding problems: teachers cannot easily see which students are quietly falling behind until a report card is already poor; parents have no visibility into day-to-day progress between formal reporting periods; and students without access to a private tutor or career counsellor have no reliable way to know whether their current marks are on track for the degree or career they want.
# + RESEARCH QUESTION
Can a single, low-cost, role-based web platform meaningfully improve access to accurate academic information and enable earlier, evidence-based intervention for at-risk students in a South African school context, without requiring specialist IT infrastructure or paid third-party services?
# + APPROACH
To investigate this question, we designed and built Prospect, a role-based web application serving four user types — Teacher, Student, Parent, and School Admin — from a single shared database. Development ran over approximately ten weeks and combined background research into South African school administration, the National Senior Certificate (NSC) and Admission Point Score (APS) university admission system, and general early-warning-indicator research from the education literature, with an iterative build-test-refine engineering process.
The resulting system includes: digital mark sheets with live class analytics; a transparent, rule-based At-Risk Engine that shows teachers the specific reasons behind a flag rather than an opaque score; a closed-loop intervention pipeline that records whether a coaching action measurably improved a student's mark; attendance, behaviour, and timetable management; a strictly read-only parent dashboard; and a student-facing “My Future” module that matches a learner's current marks against real, published South African degree entry requirements.
The platform was built using React, Tailwind CSS, and Supabase (PostgreSQL), deliberately avoiding paid authentication or infrastructure services to keep the solution affordable for schools with constrained budgets. All “intelligent” features — risk scoring, intervention effectiveness, and career matching — are computed transparently as pure functions from real school data rather than through opaque third-party AI services, so that every recommendation shown to a teacher, student, or parent can be explained and audited in plain language.
# + METHOD
Because no live school deployment was possible within the research window, the system was evaluated against a constructed, realistic synthetic dataset: four classes across two subjects, two terms of assessment data (12 assessment events per class), and a deliberately engineered mix of student performance profiles — consistently weak, gradually declining, and high-volatility learners — designed to stress-test whether the At-Risk Engine could surface genuinely at-risk students that a manual review would miss. Both a simulated “manual mark-sheet review” process and the At-Risk Engine dashboard were timed and compared against this identical dataset (see Research Plan and Research Report for full methodology and results).
# + KEY FINDINGS
- Across the constructed dataset (n = 96 student-subject records), the At-Risk Engine identified all 14 students with a genuine risk profile in under one minute of dashboard review, compared with a simulated manual review of the same data, which missed 4 of the 14 (all volatile-but-not-uniformly-low profiles) and took approximately 9x longer to complete.
- Displaying the specific reasons behind a flag (e.g. “average dropped from 68% to 51% over the last 3 assessments; exam in 9 days”) rather than a bare risk score measurably increased tester confidence in, and willingness to act on, the recommendation during internal usability testing.
- Closing the intervention feedback loop (assign → measure outcome) made it possible, for the first time in the system's development, to rank which intervention types were actually effective for which students — a capability absent from every manual process reviewed during background research.
- Because all four roles read from one shared data model, a mark entered once by a teacher is immediately and correctly visible to the relevant student and parent, and simultaneously feeds both the At-Risk Engine and the APS/career-planning tool, without any manual re-entry step.
# + CONCLUSION
Within the scope of a ten-week research and development project, the evidence gathered supports the conclusion that a unified, explainable, role-based school information platform can plausibly improve access to accurate academic information and enable earlier, evidence-based intervention in a South African school context — and that this is achievable without expensive infrastructure, paid third-party AI, or specialist IT staff. The most significant and least anticipated finding was that explainability itself, not raw predictive accuracy, was the binding constraint on whether teachers trusted and acted on the system's output. The logical next step beyond the scope of this project is a real, consented pilot in a single school to validate these findings against genuine day-to-day usage rather than constructed test data.
# + KEYWORDS
EdTech · South Africa · academic early-warning system · explainable AI · accessibility · information systems · Supabase · React · school administration · APS/NSC career planning
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