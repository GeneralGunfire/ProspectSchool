# Peer Tutoring Feature — Research Foundation

**Status:** Research complete, feature not yet built. This is the evidence base the Peer Tutoring feature design and build must follow.

**Context locked in before this research was run:**
- Demo/small-scale app — keep any recommended system light, not requiring heavy infrastructure.
- Platform already has: real per-student marks and topic-test results per subject/topic (including misconception-tagged diagnostic data for Grade 10 Maths), class/cohort structure, teacher oversight tooling built for other features.
- Users are minors (Grades 8–12) — safety/moderation matters, but this is same-school structured peer contact, not stranger-matching, so risk profile is proportionately lower than a general online-matching platform.

**Source:** Perplexity deep research pass, captured verbatim below with section numbering preserved for cross-referencing during design/build.

---

## 1. Effectiveness of peer tutoring at secondary level: what works and for whom

**Bottom line:** Peer tutoring is one of the better-supported, low-cost interventions for secondary learners, with moderate average gains for tutees and clear benefits for tutors' own learning. Most effective when structured, short-burst, and focused on consolidation rather than introducing new content.

### Evidence base (secondary/high school)
- **EEF Teaching & Learning Toolkit** (145 studies, high evidence security): average impact ≈ +6 months' progress over a year, slightly higher at secondary (+7 months) than primary. Benefits both tutors and tutees; low-attainers and learners with SEN tend to gain the most.
- **Alegre et al. (2019)** meta-analysis of 42 secondary maths studies: 88% positive effect sizes, mean Cohen's d ≈ 0.38 (small–medium). Same-age tutoring outperformed cross-age in secondary maths; shorter programs (<8 weeks) and shorter sessions (<30 min) were more effective.
- **Bowman-Perrott et al. (2016)** single-case meta-analysis (Grades 1–12): overall Tau-U ≈ 0.75 (moderate–large academic benefits); effects didn't differ meaningfully by grade level, dosage, or disability status.
- **Leung (2019)** meta-analysis focused on tutors' own achievement: weighted mean effect d ≈ 0.43, strongest when tutees were low-ability, tutoring was structured, and in secondary contexts.

**Implication:** expect modest but meaningful tutee gains (especially struggling learners), and real consolidation/metacognitive benefits for tutors ("learning by teaching"), particularly in subjects like maths where explaining procedures forces reorganisation of knowledge.

### Conditions associated with effectiveness (matter more than "just pairing students")
- **Structure over unstructured help:** structured protocols (clear roles, question frames, feedback routines) beat "just do homework together." EEF highlights "questioning frames" and tutor training as key.
- **Short, frequent bursts, limited duration:** Alegre et al. — <8 weeks total, <30 min/session, ≤3 sessions/week performed best in secondary maths. EEF — 4–5 sessions/week for up to 10 weeks common effective pattern; very long/intense programs see diminishing returns.
- **Same-age vs. cross-age:** same-age > cross-age in secondary maths effect size (likely higher trust, prior familiarity). In cross-age, a gap of <3 years works best.
- **Subject specificity:** most robust evidence is maths/literacy, but effects similar across subjects — what matters is well-defined tasks aligned to current curriculum content.

### Concrete pattern to implement
- Default to **same-grade or ±1 grade** pairings within the same school.
- Recommend **2–3 sessions/week, 20–30 minutes, for 4–6 weeks** as a standard "tutoring block."
- Require a **structured session template** (section 3) rather than free-form "help me with this worksheet."

---

## 2. What makes a good match: beyond "strong + weak in same subject"

**Bottom line:** Matching on specific topic/misconception and ensuring a moderate ability gap matters more than overall subject grades. Personality/rapport matters qualitatively, but there's little evidence for complex algorithms — simple heuristics (prior acquaintance, same class, shared teacher) are reasonable proxies.

### Ability gap: how far apart is "too far"?
- EEF: in cross-age, gap of <3 years is optimal — "work is challenging for the tutee but manageable for the tutor."
- General tutoring literature: too small a gap → tutor has little to teach, sessions become collusive; too large a gap → tutor can't explain in accessible steps, tutee feels overwhelmed.

### Practical rule for this platform (Grade 8–12, CAPS)
**Same-grade pairs:**
- Require a minimum gap in the relevant topic score (e.g. tutor ≥ 20–30 percentage points above tutee on that topic's diagnostic/test), but not so large the tutor is essentially top-of-class while tutee is failing everything.
- Heuristic: `topic_score_tutor - topic_score_tutee` between **20 and 50 points** (0–100 scale) = "good gap."
- If gap > 60, flag as "consider group study instead" or require teacher approval.

**Cross-grade pairs:**
- Limit to grade difference ≤ 2 (e.g. Grade 10 tutoring Grade 8, Grade 12 tutoring Grade 10).
- Older tutor must have demonstrated mastery of the exact CAPS topic (via topic-test score or teacher endorsement).

### Topic/misconception specificity
The platform already has topic-test results and misconception tags for Grade 10 Maths — research strongly supports using that granularity:
- EEF: peer tutoring most effective for reviewing/consolidating learning and addressing misconceptions, not introducing entirely new content.
- Alegre et al.'s focus on specific skills (algebra, geometry, etc.) suggests narrowly focused tutoring (e.g. "factorising quadratics," "interpreting graphs") is where gains show up.

**Concrete matching rule:**
- Primary match key = `(subject, grade, topic_id)`, not just `(subject, grade)`.
- Optionally refine by `misconception_cluster` so the tutor has previously demonstrated mastery on items tagged with those specific misconceptions.
- If multiple students qualify, prioritise in order: same class/teacher (rapport, logistics) → prior positive interactions (previous successful tutoring/study group) → similar timetable blocks (scheduling feasibility).

### Personality/rapport: what can realistically be approximated?
- Trust, confidence, and comfort are repeatedly noted as critical, especially cross-age — but little evidence that complex personality matching (e.g. Big Five questionnaires) improves outcomes in school-based peer tutoring.
- Most successful programs rely on: same class/teacher pairings, self-reported comfort, and allowing re-matching if rapport is poor.

**Lightweight rapport proxy (no heavy questionnaire):**
- 1–2 optional onboarding questions: "Do you prefer to work with someone you already know, or are you happy to be matched with a new student?" / "Any preference on tutor/tutee gender?" (if culturally relevant and allowed by school policy).
- Use class/teacher overlap as the main rapport proxy.
- Build a simple "report a problem / request new partner" flow after 1–2 sessions — treat early re-matching as normal, not failure.

---

## 3. Structuring the tutoring session: preventing "just doing the homework"

**Bottom line:** Untrained peer tutors need very simple, scripted structures to avoid just giving answers. Evidence supports short trainings plus question frames and clear role definitions (tutor asks/models/checks; tutee explains/attempts/reflects).

### Core principles from research
- Explicit teaching support — tutors should model, give feedback, check understanding, not just show solutions.
- Training matters — EEF stresses training for staff and tutors is essential; even brief training on questioning, correcting errors, encouraging effort improves interaction quality.
- Structured tasks outperform vague "study together."
- Checklists used in school interventions include: teach mentors to use praise/correction/review, provide immediate feedback during practice, use time limits and clear goals per segment.

### A lightweight session script to embed (20–30 min, 2–3×/week)

**"25-minute CAPS Maths Tutoring Session" example:**

1. **Set goal (2 min)** — tutee selects one specific topic/misconception (e.g. "solve linear equations with fractions"); both agree a concrete goal ("By the end, tutee can solve 3 exam-style questions without help").
2. **Tutee attempts first (5 min)** — tutee tries 1–2 diagnostic questions from the existing bank while tutor watches. Tutor instruction: "Do not give answers. Note where they get stuck."
3. **Tutor explains strategy, not solution (5–7 min)** — tutor explains the method using a *fresh* example (different numbers). Prompt: "Talk through the steps as if you're teaching a younger student. Why does each step make sense?"
4. **Guided practice (7–8 min)** — tutee solves 2–3 new questions. Tutor uses a question frame instead of giving answers: "What is the first thing you need to do here?" / "Which rule from class applies?" / "Can you check if your answer makes sense by…?" If stuck, tutor models one step, then hands back control.
5. **Quick recap + self-rating (3 min)** — tutee summarises the key idea learned; both rate confidence (1–5) on the topic; agree on one small practice task before next session.

**Implementation tips:** build as a checklist UI with timers and suggested prompts; offer subject-specific prompt banks (maths vs. physical sciences vs. languages); allow teachers to assign specific session templates for particular topics.

### Minimal tutor "training" to operationalise
No full professional-development program needed. Even brief structured preparation helps:
- A **10–15 minute orientation** (video + short quiz) covering: "Ask, don't tell" principle; how to praise effort not just correctness; how to use the session script and prompt bank.
- A **one-page "cheat sheet"** in-app: Do's/Don'ts ("Don't solve their homework"; "Do ask 'why' and 'how' questions"); example phrases for kindly correcting misconceptions.

**Out of scope for this build:** multi-hour training programs, external certification.

---

## 4. Recognition and incentives: badges, hours, and avoiding "gaming"

**Bottom line:** Extrinsic rewards (badges, hours) can boost participation, especially initially, but risk encouraging superficial engagement if they're the only metric. Combine light extrinsic recognition with quality checks (tutee feedback, teacher oversight) and emphasize intrinsic benefits.

### What research says
- Bowman-Perrott et al. found peer tutoring effective **regardless of reward** — extrinsic incentives aren't necessary for impact, but can be used without obvious harm if well-designed.
- EEF/implementation guides mention team challenges, point systems, recognition as useful for keeping motivation over 4–10 week blocks.
- Broader motivation research warns of **overjustification**: if students tutor only for badges/hours, intrinsic motivation and quality can drop.

### Design patterns to mitigate "badge farming"
1. **Tie recognition to verified, quality-assured sessions.** A session counts toward hours/badges only if: logged in-platform (start/end time, topic), tutee completes a short confirmation ("Did this session help you understand [topic]?" Yes/Partly/No + optional comment), and no system/teacher flags (e.g. repeated "No" ratings trigger review).
2. **Cap or tier recognition.** Use tiers (Bronze: 5 verified sessions; Silver: 10; Gold: 15) emphasizing quality milestones (e.g. "helped 3 different tutees improve on topic X") rather than raw hours.
3. **Highlight intrinsic and social benefits in UI copy:** "Strengthen your own understanding by teaching." / "Help your classmates succeed." Use leaderboards cautiously if at all — favor team/class achievements over individual gamification that might encourage rushing.
4. **Teacher oversight as a guardrail** — teachers see session logs and tutee feedback; suspicious patterns (many very short sessions, same tutee repeatedly, low ratings) can be reviewed.

**Concrete pattern:** implement "verified tutoring hours" — session auto-logged with start/end, tutee must confirm within 24 hours for it to count, teachers view an hours-per-student dashboard, badges awarded based on completed verified sessions with acceptable tutee feedback. **Avoid** complex economies (points markets, redeemable rewards) for a small-scale demo — added infra/governance burden with little evidence of added learning value.

---

## 5. Safety and moderation for peer contact among minors (same-school context)

**Bottom line:** Same-school peer tutoring has a lower risk profile than random online matching, but still needs structured, visible, auditable interactions: no sharing of private contact details, in-platform communication only, teacher-visible logs, clear reporting paths.

### Standard, proportionate safeguards
- **Keep all communication in-platform.** No exchange of personal phone numbers, WhatsApp, social media, or email addresses. All chat, file-sharing, scheduling happen within the school-managed system.
- **Teacher/staff oversight.** Teachers can view who is paired with whom, session logs (date/time/duration/topic), aggregated tutee feedback. For higher-risk contexts (cross-gender, cross-grade), some schools require teacher approval of pairings or periodic check-ins.
- **Session logging and visibility.** Every session recorded with participants, start/end time, topic, brief summary/checklist completion — accessible to designated staff (HOD, pastoral care) for audit or if concerns arise.
- **Reporting mechanisms.** In-app "Report a concern" button for inappropriate messages/behaviour, tutee feeling pressured/uncomfortable, tutor feeling overwhelmed/harassed. Reports go to a named staff member (safeguarding lead) with clear follow-up SLAs.
- **Code of conduct.** Simple, student-friendly rules ("Be respectful; no insults, bullying, or personal questions." / "Stay on topic; no sharing of private contact info." / "If something feels wrong, report it."). Require students (and parents where appropriate) to acknowledge these rules.

### Same-school vs. stranger-matching — proportionate approach
This context is substantially lower risk than stranger-matching platforms: all users known to the school with verified identities, interactions school-sanctioned, teachers already know students and can intervene quickly.

**Don't necessarily need:** dedicated video-call infrastructure (text chat + optional school-approved video tools suffice); heavy background checks beyond normal school processes (tutors are students).
**Do need:** clear guardrails (in-platform only, no private contact sharing), visible logs, easy reporting, a named staff member responsible for oversight.

**Concrete pattern:**
- Default to in-school or scheduled online sessions using **school-approved tools** (e.g. Teams/Google Meet) if video is needed — the platform coordinates, the actual call happens via the school's existing system.
- Do not display direct contact info; if students need to coordinate outside sessions, use school email/official channels only, not personal contacts.
- Provide teachers a simple dashboard: list of active pairs/groups, recent sessions and any low tutee ratings, reported concerns and status.

---

## 6. Measuring whether it actually worked: lightweight impact tracking

**Bottom line:** Can't run perfect RCTs per pair in a live product, but pre/post topic scores, trajectory changes, and tutee feedback give a reasonable effectiveness signal at individual and program level.

### What's realistic at individual-relationship scale
Research typically uses pretest-posttest with control-group designs; for this platform, approximate with **within-student pre/post** on the same topic (no true control, but compare before vs. after tutoring starts and look for consistent patterns across many pairs).

### Practical metrics to implement

**1. Topic-level pre/post scores**
- Record the tutee's most recent topic-test score on that topic before the first session.
- After 3–5 sessions (or 2–4 weeks), record the next topic-test score on the same/closely aligned topic.
- Compute score change and flag: "Clear improvement" (+15+ points), "Some improvement" (+5–14), "Little/no improvement" (≤+4 or decline).
- **Caveat:** small sample (one test before, one after) is noisy — interpret at aggregate level (e.g. "among all Grade 10 maths tutoring pairs, average gain is X points").

**2. Trajectory change (slope before vs. after)**
- If multiple topic tests exist over time: fit a simple linear trend for the tutee's scores before tutoring starts, another after tutoring starts, compare slopes (is the post-tutoring trend steeper?). More robust than a single pre/post pair, doable with basic regression.

**3. Tutee self-report + teacher judgement**
- After each block (4–6 weeks): "How much did tutoring help you understand [topic]?" (1–5); "Did your marks or confidence improve?" (Yes/Partly/No). Teachers can add a brief judgement based on classwork/test performance.

**4. Aggregate program metrics** (for school leadership)
- Average pre/post gain for tutees by subject/grade.
- Proportion of tutoring relationships rated "effective" by tutees and teachers.
- Correlation between number of verified sessions and score gains (checking diminishing returns).

### Sample size / time window considerations
- Treat any single pair's pre/post change as **indicative, not definitive**.
- With 30–50 active pairs over a term, meaningful patterns start to emerge at the subject-grade aggregate level.
- **4–8 weeks** of regular tutoring (2–3 sessions/week) is enough to expect some measurable change in topic mastery, aligning with the "<8 weeks" sweet spot from section 1.

### Concrete implementation pattern
- Create an "intervention"-style record per tutoring relationship: start date, subject, topic(s), participants, linked to all session logs.
- Automatically compute: `pre_score` (most recent topic-test before start), `post_score` (most recent topic-test after N sessions or X weeks), `gain = post_score - pre_score`.
- Surface per-pair: "Estimated impact: +X points on [topic] (based on last two tests)."
- Surface per-school: dashboards showing average gains, distribution of tutee ratings, correlations with session counts.
- **Be transparent these are estimates, not causal proof** — but they're aligned with how the platform already tracks intervention effectiveness in the ABC early-warning system (`src/lib/riskEngine.ts` / `syncOutcomesFromMarks`), so the pattern is consistent with existing product conventions.

---

## What's realistic vs. "nice but heavy" for this build

**Realistic for a demo/small-scale app:**
- Matching on subject + grade + topic + ability gap using existing marks/diagnostics.
- Simple session scripts and prompt banks embedded in the UI.
- In-platform chat + scheduling + session logging.
- Basic tutee feedback and teacher-visible dashboards.
- Light badge/hours system tied to verified sessions.
- Pre/post topic score tracking and simple trend analysis.

**Probably overkill for now:**
- Complex personality-matching algorithms or long questionnaires.
- Multi-hour formal tutor training programs.
- Dedicated video-calling infrastructure (use the school's existing tools if video is needed).
- Rigorous RCT-style evaluation per pair — use pre/post and aggregate trends instead.

---

## Cross-reference for build phase

When designing/building this feature, every one of these must be explicitly addressed, not silently dropped:
- [ ] Matching uses `(subject, grade, topic_id)` as primary key, with the 20–50 point ability-gap heuristic (section 2), not just "strong student + weak student, same subject."
- [ ] Same-grade or ±1 grade defaulted; cross-grade capped at ≤2 grade difference with demonstrated topic mastery required (section 1–2).
- [ ] A structured session template/script (section 3) is built into the UI — not a free-form "just chat" tutoring flow.
- [ ] A short tutor orientation (10–15 min) + in-app cheat sheet exists before a student can tutor (section 3).
- [ ] Recognition/badges are tied to *verified* sessions with tutee confirmation, not self-reported hours alone (section 4).
- [ ] All communication stays in-platform — no private contact info ever displayed or exchanged (section 5).
- [ ] Session logs are teacher-visible; a "report a concern" flow exists with a named staff recipient (section 5).
- [ ] Pre/post topic-test score tracking exists per tutoring relationship, framed honestly as an estimate not causal proof (section 6).
