# Future Feature Specs — Deep Dives (Not Yet Started)

Captured from research/planning session. These are **specs to reference later**, not commitments or in-progress work. Nothing here has been built. Cross-reference against the priority list at the bottom before starting any of it.

---

## 1. AI-Powered, CAPS-Aligned Tutoring & Study Companion

### Problem & Opportunity
- Overcrowded classrooms, limited 1:1 teacher time, accumulating foundational gaps, English-medium instruction vs. home-language barriers, no structured on-demand support outside school hours.
- Platform already has content (library, past papers, topic tests) and diagnostic data (marks, topic-test results, interventions) but no adaptive conversational tutor.
- Differentiator vs. generic ChatGPT: strict CAPS/IEB/ATP alignment, integration with each learner's real marks/topic-tests/interventions, multilingual + low-bandwidth design.
- Built with Groq, different languages passed through translator before answered. Cheap, not really a very in depth feature. Reference a topic list for CAPS/IED cirriuculums for accurate answers

### Design Principles
- Grounded, not generic — RAG over study library, CAPS docs, teacher-created resources; cite/link specific lessons.
- Misconception-sensitive — leverage diagnostic topic tests/item bank to detect common misconceptions, give targeted counter-examples not just "the right answer."
- Scaffolded/Socratic dialogue — hints and probing questions, not full solutions immediately.
- Multilingual & ESL-aware — English + isiZulu, isiXhosa, Afrikaans, Sesotho; allow code-switching.
- Low-bandwidth first — text-first, optional voice/image later, cache conversations locally for offline review.

### System Architecture
- **Content Index (RAG corpus):** study library lessons/worked examples, topic test question banks + explanations, CAPS policy docs/ATPs/exemplar papers. Chunked per lesson/topic/concept, embedded, stored in a vector DB (pgvector on Supabase or dedicated vector store).
- **LLM Orchestrator:** receives learner query + context (grade, subject, recent performance), calls retrieval service for top-k chunks, pulls student model, constructs system+context+query prompt. -- important to note
- **Student Model Integration:** pulls from `study_progress`, `topic_test_attempts`/`topic_test_answers`, `assessment_results`. Computes per-topic mastery (BKT-style or moving average) and known misconceptions from repeated sub-skill errors. Adjusts explanation depth and practice prioritization. --important
- **Conversation Store:** `ai_tutor_sessions` (id, student_id, subject_id, topic_id, started_at, last_active_at), `ai_tutor_messages` (id, session_id, role, content_text, metadata jsonb, created_at). --important
- **Safety & Guardrails Layer:** blocks off-topic/harmful queries, prevents direct answers to high-stakes exam questions without scaffolding, POPIA-safe disclaimers. Learner cant query and request backend server side information.

### Key Workflows
- **A. Learner asks a question** — entry points on library pages, topic test results, past papers, global Tutor tab. Query + context → retrieval → LLM → stored + returned. Chat UI with "similar practice question" and "simpler language / another language" toggles.
- **B. Post-topic-test review** — "Ask AI to explain" on incorrect answers → targeted misconception explanation + 1-2 similar practice questions.
- **C. Personalized practice generation** — requests practice on topic X → LLM generates 5-10 questions calibrated to mastery level, stored as a dynamic practice set (not static item bank), auto-graded where possible or flagged for teacher review.

### Data Model Additions
```
ai_tutor_sessions { id, student_id, subject_id?, topic_id?, started_at, last_active_at }
ai_tutor_messages { id, session_id, role, content_text, metadata jsonb, created_at }
ai_practice_sets { id, student_id, subject_id, topic_id, difficulty_level, questions jsonb, created_at }
ai_practice_attempts { id, practice_set_id, student_id, responses jsonb, score_pct, completed_at }
```

### Algorithms & Intelligence
- Hybrid retrieval: keyword (BM25) + vector similarity, re-ranked by grade relevance/subject match/recency.
- Lightweight student modeling to start (avg of last 3 topic-test + library quiz scores per topic; flag repeated sub-skill misses as misconceptions); BKT-style probability later.
- Difficulty adjustment: mastery > 0.8 → harder/multi-step questions; mastery < 0.5 → scaffold backwards to foundations.

### Safety, Ethics, POPIA
- Data minimization — only send necessary context to LLM, no raw marks unless needed.
- Log prompts/responses for QA with anonymization option.
- No direct answers to live exam questions; effort-encouraging language.
- Host LLM in-region if possible; clear privacy policy; allow learners to delete conversation history.


### Integration Points
Topic Tests, Library, Past Papers, Interventions (AI-suggested actions), My Future (career → required topic mapping).

---

## 2. Whole-School Wellbeing & Mental-Health Tracking

*(Numbering follows source material — item 2 was not included in this research pass.)*

### Problem & Opportunity
- High stress/anxiety/depression/trauma among SA adolescents, limited access to professional mental health services, fragmented/reactive support (only after crises).
- Schools lack systematic wellbeing tracking, rely on ad hoc teacher intuition, worry about stigma/confidentiality.
- Platform already tracks behaviour incidents/interventions and has student/teacher/admin roles to build on.

### Design Principles
- Low-friction check-ins (10-20 seconds), simple scales, optional anonymous mode.
- Privacy by design — teachers see aggregate trends only, counsellors/welfare get individual data under strict controls, clear consent flows (parent + learner).
- Actionable, not just data — suggested check-ins, referral pathways, intervention integration.
- Culturally appropriate — language options, avoid pathologizing normal stress, include protective factors not just problems.
- Correlate with academics — marks, attendance, behaviour combined for holistic risk detection.

### Core Features
- **A. Learner Check-In:** 2-3x/week default (school-configurable) + anytime "I need help now" button. Mood/energy/stress sliders (1-5), multi-select tags (exams, friends, family, money, safety, health), optional free text (can be anonymous), occasional safety question with immediate referral pathway if flagged. Channels: web/app, SMS/USSD for low-data contexts. --Research on how to determine mental state and how to help (quiz based checkups maybe) Heavy Research
- **B. Class & Grade Dashboards (Teacher View):** aggregated only — weekly trends, % high stress/low mood, breakdowns by tag/grade, action prompts and suggested actions. No individual data unless a learner explicitly opts to share with a specific teacher.
- **C. Counsellor/Welfare Officer Dashboard:** individual timelines, pattern detection (declining mood, stress around exams), correlation with marks/attendance/behaviour, case management (log interactions, follow-ups, outcomes), "Wellbeing support" as an intervention type, automatic risk flags with escalation workflow. --Change this into the students profile can be viewed by homeroom teacher who can (only homeroom teacher) can see this kind of information.
- **D. Resources & Self-Help:** in-app library (articles/videos/exercises), breathing/grounding exercises, external helplines (Childline SA, Lifeline) with click-to-call/WhatsApp.

### Data Model
```
wellbeing_checkins { id, student_id, school_id, mood int2, energy int2, stress int2, tags text[], notes?, is_anonymous, channel, created_at }
wellbeing_cases { id, student_id, school_id, assigned_to, status, opened_at, closed_at? }
wellbeing_case_interactions { id, case_id, user_id, interaction_type, notes, created_at }
wellbeing_resources { id, school_id?, title, content, type, topics text[], language }
```

### Algorithms & Intelligence
- Trend detection: rolling 7/14-day averages per student, slope detection for 2-3 week declines; class/grade aggregate averages and exam-period spikes.
- Optional advanced risk scoring: combine wellbeing trend + academic decline + attendance drop + behaviour incidents into a holistic low/medium/high score, feeding the existing intervention system.
- Correlation analysis (admin view): wellbeing vs. marks by grade, stress vs. absenteeism — surfaces systemic issues like assessment load.

### Safety, Ethics, POPIA
- Explicit parent/learner consent explaining what's collected, who sees it, how it's used; opt-in (or opt-out per school policy).
- Access control tiers: teachers aggregate-only, counsellors individual-for-caseload, admin high-level stats only.
- Encrypt at rest/in transit, minimize retention (delete raw check-ins after X months, keep aggregates).
- Clear crisis protocols for self-harm indicators/abuse disclosures, automatic helpline display on flagged responses.

### Integration Points
Interventions (new type + outcome tracking), At-Risk Identification (additional signal), Home/Calendar (gentle check-in reminders), My Future (wellbeing journey in growth timeline).

---

## 5. Peer Tutoring & Study-Group Matching

### Problem & Opportunity
- Large class sizes limit individual attention; private tutoring is expensive/inaccessible; learners don't know who could help them; informal study groups are ad hoc and unstructured.
- Opportunity: AI-matched peer tutoring/study-group platform connecting learners by complementary strengths/needs, with structured session tools, tracking, and recognition (badges/portfolio), scaling support without added teacher load.

### Design Principles
- Mutual benefit — tutors reinforce knowledge, tutees get targeted help, both get recognition.
- Safe and supervised — teacher-moderated, clear code of conduct, reporting mechanisms.
- Flexible formats — 1:1 or small groups, in-person/online/hybrid.
- Integrated with academics — matching based on real marks/topic-test data, sessions tied to specific subjects/topics.
- Low-friction sign-up and minimal teacher admin.

### Core Features
- **A. Tutor & Tutee Profiles:** tutor = subjects (self + system-suggested), strengths from marks/topic tests, availability, mode, languages. Tutee = subjects/topics needed, availability, preferences (gender/language).
- **B. Matching Algorithm:** inputs = subject/topic need-vs-strength match, grade compatibility, availability overlap, language preference, past ratings. Scoring combines subject match + availability overlap + proximity (same school/class) + diversity balance (avoid always-same pairs). Output: ranked suggested matches, request 1:1 or join/create study group.
- **C. Session Tools:** 1:1 — built-in chat or external link (WhatsApp/Zoom), shared whiteboard (phase 2), session agenda/goals. Study groups — creation with subject/topic focus, max size, schedule, group chat, shared resource space. Session logging — tutor logs topics/duration/notes, tutee rates usefulness 1-5 with optional feedback.
- **D. Recognition & Incentives:** tutor badges ("Certified Peer Tutor – Maths", "10-Hour Tutor"), portfolio entries, school-managed rewards (certificates, recommendation letters). Tutee progress tracking (topics covered, optional correlation with mark improvement).

### Data Model
```
peer_tutors { id, student_id, school_id, subjects uuid[], topics text[], availability jsonb, modes text[], languages text[], is_verified, verified_by? }
peer_tutees { id, student_id, school_id, subjects uuid[], topics text[], availability jsonb, preferences jsonb }
peer_matches { id, tutor_id, tutee_id, status, created_at }
peer_sessions { id, match_id, session_type, datetime, duration_minutes, topics_covered text[], notes?, tutee_rating?, tutee_feedback? }
peer_study_groups { id, school_id, subject_id, topics text[], max_members, meeting_schedule jsonb, creator_id }
peer_group_members { group_id, student_id, joined_at }
```

### Workflows
- **A. Becoming a tutor:** select subjects/topics → system checks marks/topic tests and that gets displayed for teacher approval → profile live (if teacher approved)
- **B. Requesting a tutor:** select subject/topic → ranked recommended tutors shown → request → accept/decline → match created → scheduling UI.
- **C. Study group creation:** learner or teacher creates group (subject/topic/schedule) → others join via browse or invite link → group chat/resource space enabled.

### Safety & Moderation
- Teacher oversight of all matches/groups with suspend/disable ability, clear code of conduct, easy "report issue" button, no personal contact info shared unless both agree (prefer in-platform chat initially).

### Integration Points
Topic Tests & Marks (informs matching, measures impact), Interventions ("peer tutoring" as a type with tracked outcomes), Portfolio & Badges (tutoring hours/badges appear), Wellbeing (peer support may reduce isolation).

---

## Cross-Feature Notes

- All four features assume the existing Prospect data model (schools, students, teachers, subjects, marks, topic tests, interventions) as their foundation — none of them are standalone products.
- All four lean on the same underlying pattern already established by the At-Risk engine and Topic Test system: explainable logic, teacher-in-the-loop verification, and integration with real captured data rather than a separate silo.
- POPIA compliance and data minimization are recurring requirements across every feature that touches personal/sensitive data (AI Tutor conversations, Wellbeing check-ins, Portfolio evidence, Peer Tutoring contact info) — this should be treated as one shared compliance workstream, not four separate ones, when any of these are eventually scoped for real.
- None of these are scheduled. See priority order below.

---

## Priority Order & Timeline (established earlier, unchanged)

**1. Immediate**
- Topic Tests — heavy research, grounded content, manual testing -- done; expand more subjects later *Huzayfa?
- Teacher-side intervention / at-risk flagging --today *Groq/AI backend? ****CHECK LATER*****
- Future career tests + APS calculator — accuracy and reliability testing *Huzayfa
- Grade 9 subject selection forms — review, narrow down, make more useful for students *Huzayfa

**2. Then — ongoing/parallel**
- Implement new features *(this document is part of that output)* 
- Library rebuild* *Huzayfa
- Restart systematically, starting with Algebra
- Research topics together, build first 2 (Grade 10, Term 1)
- Validate format, refine desktop/mobile layout
- Scale same method across subjects/terms for Grade 10
- Hand off list + method to partner to build the rest via Claude Code
- Content note: build first topics without AI; partner later uses NVIDIA's free open-source models for term/content breakdowns — documented for the report

**3. Then — long-term, not locked in**
- Separate free/open portal for under-resourced students (IT/tech/AI/software), unlinked to school accounts, open signup — last-stage idea

The five feature specs above (AI Tutor, Wellbeing Tracking, Peer Tutoring) sit within step 2 ("scan for new features and edtech market gaps") as candidate output — none are scheduled ahead of the four immediate items.


--- OPTIONAL --- 



## 3. Digital Portfolio + Skills Badging (Beyond Marks)

### Problem & Opportunity
- University/employer decisions rely heavily on marks and APS, ignoring projects, leadership, creativity, community service, and soft skills.
- Learners in under-resourced schools often have rich experiences that never appear on a transcript; no standard portable digital record of skills/achievements in SA.
- Opportunity: CAPS-aligned digital portfolio + micro-credentialing (digital badges), integrated with existing APS/career tools, shareable with universities/bursary committees/employers.

### Design Principles
- Evidence-based badges — every badge needs clear criteria + evidence (upload/link/teacher verification); avoid unlabeled "participation-only" badges.
- CAPS-aligned competencies — map to subject-specific skills and cross-curricular capabilities (critical thinking, communication, digital literacy).
- Learner-owned, school-verified — learners curate, teachers/school verify and award official badges.
- Portable and shareable — public portfolio URL, PDF export, optional Open Badges standard.
- Motivational, not competitive — growth/mastery focus, no public badge-count ranking.

### Core Components
- **A. Portfolio Structure:** sections = Academic, Projects & Creativity, Leadership & Service, Work Experience, Certifications. Each item: title, description, date, evidence (file upload or external link), tagged skills, optional teacher verification.
- **B. Badge Framework:** four types — Subject Mastery (e.g. "Mathematics – Algebraic Reasoning – Level 3", criteria from topic test scores + library mastery + verified project), Skill (e.g. Critical Thinking, Communication — evidence from projects/presentations/teacher rubrics), Achievement (e.g. "Top 10% Grade 11 Maths", "20 hours community service" — auto from marks data or teacher-verified logged hours), Participation (clearly labeled as such, not mastery).
- **C. Issuance & Verification:** auto-awarded (system-detected from data, teacher can review/override), teacher-awarded (teacher selects student + badge + evidence), learner-nominated (learner submits evidence, teacher approves/rejects with feedback).

### Data Model
```
portfolio_items { id, student_id, school_id, section, title, description, date, evidence_urls text[], files jsonb, skills text[], is_verified, verified_by?, created_at }
badge_definitions { id, school_id?, name, description, criteria, badge_type, skills text[], level }
earned_badges { id, student_id, badge_id, school_id, evidence_item_ids uuid[], issuer_id, issued_at, metadata jsonb }
skills_taxonomy { id, name, description, category }
```

### UI & UX
- **Learner:** portfolio homepage (profile header incl. APS/career goal, section item cards, add item / request badge), badge shelf (visual grid, click for criteria/evidence/issuer), public share URL + PDF export.
- **Teacher:** class portfolio overview (filter by section/skill), badge issuance flow, verification queue for learner-nominated badges.

### Algorithms & Intelligence
- Badge recommendations from marks/topic tests/portfolio items ("you might qualify for X — here's what's missing").
- Auto-suggest skill tags from portfolio text/badges (e.g. a coding project → Computational Thinking, Problem Solving).
- Career alignment: match portfolio + badges to career profiles for guidance suggestions.

### Safety, Ethics, POPIA
- Learner-controlled visibility (public/private, per-section).
- Clear data ownership policy: learner owns portfolio, school verifies specific items.
- Equity consideration: value non-academic achievement, provide guidance for learners with limited extracurricular access.

### MVP vs. Full Vision
- **MVP (8-12 weeks):** basic portfolio (add/edit items, Academic/Projects/Leadership sections), 10-20 predefined teacher-awarded badge types, public portfolio URL.
- **Phase 2:** learner-nominated badges, auto-awarded badges from marks/topic tests, skills taxonomy/tagging, PDF export.
- **Phase 3:** Open Badges standard compliance, bursary/university application integration, AI-assisted portfolio curation.

### Integration Points
APS & Unis (portfolio link visible alongside APS), My Future (career matches consider portfolio/badges, growth timeline includes badge milestones), Topic Tests & Marks (auto-award mastery badges, suggest portfolio uploads).

---

