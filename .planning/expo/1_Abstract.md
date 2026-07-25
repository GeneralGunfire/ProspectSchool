PROSPECT
Nizamiye Primary and High School
Computer Science / Software Engineering

Prepared by: Rajen Chetty, Njabulo Huzayfa Mkandla
Document issued: 12 July 2026


ABSTRACT

A Unified Digital Platform for School Information Access and Early Academic Intervention

Development period: 27 April 2026 - 11 July 2026 (10 weeks)


PROBLEM STATEMENT

South African schools don't all have the same resources. Well-funded schools can afford commercial school-management software, but a lot of under-resourced schools - especially in townships, rural areas, and lower-fee schools - still run on paper mark sheets, WhatsApp groups, and notice boards. This causes a few real problems: teachers often don't notice a student is struggling until it shows up on a report card, parents only hear from the school when something has already gone wrong, and students who don't have access to a tutor or career counsellor have no easy way to know if their marks are actually good enough for the degree they want.

RESEARCH QUESTION

Can a single, low-cost, role-based web platform actually improve access to accurate school information and help teachers step in earlier for at-risk students - without needing expensive IT infrastructure or paid software?

APPROACH

To test this, we built Prospect - a web app with five role-based portals (Teacher, Student, Parent, School Admin, and a multi-school Platform Admin) all pulling from one shared database. We spent the first part of the project researching how South African schools are actually run, how the NSC/APS university admission system works, and what existing school platforms get wrong. Then we built the system iteratively over about ten weeks.

What we ended up with: digital mark sheets with live class stats, an At-Risk Engine that tells a teacher exactly why a student is flagged (not just a score), a coaching system that tracks whether an intervention actually worked, attendance and behaviour tracking, a timetable builder, a read-only parent dashboard, a "My Future" tool that checks a student's marks against South African university entry requirements, a Subject Selection workflow for the Grade 9-to-10 transition, and a school supply Marketplace.

We built it with React, Tailwind, and Supabase, and deliberately avoided any paid services - the goal was something a school with no IT budget could actually use. Every "smart" feature is a plain, rule-based function that runs on real data already in the system, not a black-box AI model, so a teacher can always see why the system said what it said.

KEY FINDINGS

Every module described above is built and functional, verified through automated end-to-end browser testing (Playwright) and manual functional testing across all five portals. The At-Risk Engine correctly surfaces its reasoning (e.g. a declining mark trend, an upcoming exam, or a low average) alongside every flag rather than a bare score, which was a deliberate design response to research showing that explainability drives trust and uptake in early-warning systems.

A formal, timed comparison of the At-Risk Engine against manual mark-sheet review, and a systematic check of the APS calculator against published university admission requirements, were planned but not completed within the ten-week development window; these are documented as the immediate next steps before any real-school pilot (see Research Report, Recommendations).

CONCLUSION

Within a ten-week project, a fully functional, role-based platform was designed and built that unifies school administration and career guidance without requiring expensive infrastructure or a dedicated IT person. The system's design was deliberately shaped by research into early-warning systems, which showed that explaining reasoning - not just producing an accurate flag - is critical to whether teachers actually trust and act on a recommendation. The obvious next steps are a controlled evaluation of the At-Risk Engine against manual review, formal validation of the APS calculator against current published requirements, and ultimately a real pilot in an actual school.

KEYWORDS
EdTech, South Africa, early-warning system, explainable AI, accessibility, Supabase, React, school administration, APS/NSC career planning
