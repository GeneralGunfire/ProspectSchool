# Abstract

**Project Title:** Prospect — A Unified Digital Platform for School Information Access and Early Academic Intervention in South African Schools

**Student(s):** [Your Name]
**School:** [School Name]
**Grade/Level:** [Grade]
**Category:** Computer Science / Software Engineering

## Abstract

Many South African schools, particularly under-resourced ones, rely on fragmented and manual systems — paper mark sheets, WhatsApp groups, physical notice boards, and word-of-mouth — to manage academic records, communicate with parents, and guide learners toward tertiary study. This fragmentation makes it difficult for teachers to notice which students are falling behind before it is too late, for parents to stay informed about their child's actual day-to-day progress, and for students — especially those without access to a private tutor or a career counsellor — to understand what marks they need for the degree or career they want.

This project asks: **can a single, low-cost, role-based web platform meaningfully improve access to accurate academic information and enable earlier, evidence-based intervention for at-risk students in a South African school context, without requiring specialist IT infrastructure or paid third-party services?**

To investigate this, we designed and built Prospect, a web application serving four user roles — Teacher, Student, Parent, and School Admin — from a single shared database. Over approximately ten weeks, we researched the specific pain points of South African schools (large class sizes, under-resourced admin, the National Senior Certificate APS system, limited school IT budgets), then iteratively designed and implemented a system covering: digital mark sheets with live class analytics, a transparent rule-based "at-risk" detection engine that shows teachers *why* a student is flagged rather than an opaque score, a coaching/intervention tracking pipeline with measurable outcomes, a timetable and attendance system, parent-facing read-only dashboards, and a student-facing career and APS-planning tool ("My Future") that matches a learner's current marks against real South African degree entry requirements.

The platform was built using React, Tailwind CSS, and Supabase (PostgreSQL), deliberately avoiding paid authentication or infrastructure services to keep the solution affordable for schools with constrained budgets. All "intelligent" features — risk scoring, intervention effectiveness, career matching — are computed transparently in the browser from real school data rather than through opaque third-party AI services, so every recommendation can be explained and audited by a teacher.

Testing across simulated school data (multiple classes, subjects, and a term's worth of marks) showed that the at-risk engine surfaced struggling students substantially earlier than a manual "check everyone's marks by hand" approach would, and that giving teachers a one-click way to log and later measure the outcome of an intervention created a feedback loop that did not previously exist. We conclude that a single well-designed, role-aware information system can materially close the accessibility and information-quality gap in a resource-constrained school, and that transparency in how "at-risk" decisions are made is achievable without expensive machine learning infrastructure.

**Keywords:** EdTech, South Africa, academic early-warning system, accessibility, information systems, Supabase, React, school administration
