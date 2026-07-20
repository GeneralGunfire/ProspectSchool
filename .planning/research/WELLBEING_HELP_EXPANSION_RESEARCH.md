# Wellbeing Help Expansion — Research Foundation

**Status:** Research complete, expansion not yet built. This supersedes nothing in `WELLBEING_FEATURE_RESEARCH.md` — the existing PHQ-2/GAD-2 scoring, alert logic (sustained elevation, marked decline, new high distress), and safety-question crisis pathway all stay exactly as they are. This document covers what happens **after** a check-in, which barely exists today (just "check-in complete"), plus a redesign of what the homeroom teacher sees (summary, not raw answers), a new parent-facing view, and problem-specific homeroom-teacher guidance content.

**Context locked in before this research was run:**
- Scoring/alert logic is unchanged — only the *display* to teachers changes (summary instead of raw answers).
- Help/self-help content must be **always accessible**, not gated behind a check-in result.
- A parent-facing version is wanted, scope/detail level to be determined by risk.
- Homeroom teachers need differentiated, problem-specific guidance, not a generic "check in with this student" prompt.

**Source:** Perplexity deep research pass, captured verbatim below with section numbering preserved for cross-referencing during design/build.

---

## 1. What should happen after any check-in (not just crisis)?

**Evidence:** Computerized CBT (cCBT) and app-based CBT reduce anxiety/depression symptoms in adolescents when content is brief, structured, skill-based (thought-challenging, behavioural activation, problem-solving), and paired with *some* human support rather than purely self-guided. RCTs of CBT-based teen apps (ClearlyMe, Spark) show feasibility/acceptability and engagement gains when modules are short and interactive, and higher engagement with some guidance/encouragement than fully unguided use. Engagement drops sharply when content is long, text-heavy, or not tied to a concrete problem. School-based screening programs that work well pair screening with immediate low-threshold self-help *and* clear referral pathways — screening without a "next step" risks being performative and erodes trust.

### Implementable structure: "What happens after you check in"

For every student, regardless of score:
- **Brief normalising feedback** (1-3 sentences): "Thanks for checking in. Everyone has ups and downs. Below are some tools that can help on tough days — and you can come back to them anytime, even if you didn't fill in a check-in today."
- **"Start here if you're not sure" section (always visible):** 3-5 micro-tools (2-5 min each) — "Calm your body in 2 minutes" (guided breathing, simple animation), "Reset a stressful moment" (5-4-3-2-1 grounding script), "Sleep better this week" (3 tips + 1 small challenge), "When your mind is shouting" (1-minute thought-labeling exercise).
- **"Pick what fits" library, organized by concern:** Exam stress/school pressure, Low mood/motivation, Worry/anxiety, Sleep, Friendship/family conflict, Body image/self-criticism. Each category: 1 short psychoeducation card (3-5 sentences, simple language) + 2-3 micro-exercises (CBT-informed) + 1 "If this keeps happening" box (when to talk to an adult and how).
- **"Talk to someone" box (always visible, non-stigmatising):** "These tools can help, but they're not a replacement for talking to someone if things feel heavy." Lists: homeroom teacher, parent/guardian or trusted adult, external helplines (Childline 116, SADAG 0800 567 567, Lifeline 0861 322 322).
- **For elevated but non-crisis scores** (PHQ-2/GAD-2 above threshold, no safety flag): a gentle, specific nudge — "Your answers suggest things have been a bit tough lately, especially around [mood/worry]. You might find these tools especially helpful…" — pre-surfacing 2-3 relevant micro-tools. Full library stays accessible regardless; nothing is locked.

---

## 2. Should help content be gated behind the check-in result?

**No — confirmed by research, matches the locked design decision.** Youth mental-health app research identifies accessibility and low stigma as key engagement facilitators; teens engage more with tools that feel available to everyone, not "for problem kids." School-based screening guidance emphasizes normalising help-seeking and making support universal, not contingent on "failing" a screen. Parent-view research on school depression screening shows parents expect clear information about available support *regardless* of screening outcome.

**Implementation:** a dedicated "Wellbeing Tools"/"Help" section in main navigation, reachable without completing a check-in, at any time, from any screen. Frame explicitly as "for all learners" — e.g. heading "Wellbeing Tools for Everyone," intro copy "These tools are here for any learner, whether you're having a rough week or just want to learn skills to handle stress."

---

## 3. Teacher-facing "brief assessment" summary — structure

**Evidence:** School-based screening programs (Behavioural Health Screen, SBSS-style models) typically provide risk tiers, domain flags (mood vs. anxiety vs. behaviour), and suggested next steps (monitor / talk to student / involve SBST/parent / refer) — not raw data. Teacher mental-health-literacy research shows teachers benefit from clear, actionable guidance ("what to notice," "what to say," "who to involve") rather than diagnostic labels or raw scores. Youth self-report is most informative for internalising problems (depression/anxiety) — appropriate for a teacher view to focus on emotional concern level + trend, not item-level answers.

### Implementable teacher summary template (one scannable card per student)

- **Header:** "Wellbeing summary for [Name] (last 14 days)"
- **Section 1 — Overall concern level** (plain language, colour-coded with text labels):
  - Low concern — "Recent check-ins suggest things are generally okay."
  - Some concern — "Recent check-ins suggest things have been a bit tough, especially around [mood/worry]."
  - High concern — "Recent check-ins suggest things are quite difficult right now. This student may need extra support."
  - Derived from the existing PHQ-2/GAD-2 threshold + trend rules — no new scoring logic needed.
- **Section 2 — Primary concern area** (1-2 bullets, e.g. "Main pattern: low mood/low energy" / "Main pattern: high worry/stress" / "Main pattern: sudden drop from usual level"). **Never show item-level responses** (e.g. never "answered 'nearly every day' to the hopelessness question").
- **Section 3 — Trend indicator** (1 line): "Stable over the last 2-3 weeks" / "Gradual increase in difficulty over 2-3 weeks" / "Sudden drop in the last week compared to their usual."
- **Section 4 — Suggested next action** (1-2 bullets, non-clinical):
  - Low concern: "No specific action needed now. Continue to notice any changes."
  - Some concern: "Consider a brief, low-key check-in… If patterns continue, consider looping in the SBST/LSA and/or contacting parents."
  - High concern: "Prioritise a private conversation this week using the suggested script. Involve SBST/LSA and contact parents/guardians; consider external support if needed."
- **Section 5 — Link to problem-specific micro-guidance:** button "See tips for talking about [mood/worry/sudden change]" opening the relevant guidance page (section 4 below).

---

## 4. Problem-specific homeroom-teacher guidance content

**Evidence:** Teacher mental-health-literacy programs show disorder-specific knowledge improves confidence and appropriate response; concrete classroom strategies (predictable routines, empathetic responses, simple accommodations) are more useful than clinical theory; short, scannable resources (checklists, scripts, do/don't boxes) get used more than long documents.

### Structure: 4-6 short pages, each ~1 mobile screen, 3-5 minute read

**A. "When a student seems low / unmotivated" (elevated mood score)**
- What you might notice: more tired than usual, head down in class; less interested in previously-enjoyed activities; says things like "What's the point?"
- What's likely going on: 2-3 sentences distinguishing low mood from laziness — low energy and hopelessness are common depression signs, not character flaws.
- Conversation script: Opening — "I've noticed you seem more tired/quiet lately. I'm not worried about marks; I just want to know if things are okay." Listening tips — let them talk, don't rush to fix, avoid "just try harder." Closing — "Thanks for telling me. You don't have to deal with this alone. Let's think about one small thing that could make this week a bit easier."
- Classroom supports: break tasks into smaller steps; offer a quiet check-in option; allow brief movement breaks if restless/fatigued.
- When to involve others: "If low mood lasts more than 2 weeks, or you hear hopelessness/self-criticism, loop in SBST/LSA and contact parents."

**B. "When a student seems very worried / stressed" (elevated anxiety score)**
- What you might notice: many "what if" questions, constant reassurance-seeking; avoids speaking in class/tests/group work; physical signs (stomach aches, headaches before tests).
- What's likely going on: brief explanation of anxiety as an overactive alarm system, not weakness.
- Conversation script: "I've noticed tests/class seem really stressful for you. I want to understand what's hardest, so we can make it a bit easier." Validate: "It makes sense you'd feel this way; lots of learners feel this." Collaborative problem-solve: "What's one small change that might help next time?"
- Classroom supports: advance notice of tests/changes; seating choice; teach simple breathing/grounding before tests (link to the student-facing exercise).
- When to involve others: "If worry is stopping them from participating, sleeping, or attending school regularly."

**C. "When a student's mood has dropped suddenly" (sustained decline flag)**
- What you might notice: marked change from usual self over 1-2 weeks; withdrawal, irritability, or big mood swings.
- Why this matters: sudden change can signal a stressor (family, bullying, loss, trauma).
- Conversation focus: "I've noticed a big change in how you seem lately compared to earlier this term. Has anything changed at home, with friends, or at school?"
- Actions: prioritise a gentle conversation; consider SBST/LSA involvement early, especially with red flags (self-harm mentions, aggression, absenteeism).

**D. "When a student seems okay but had one tough week" (single-day/short-term dip)**
- What this likely means: normal fluctuation, often situational (test, argument).
- What to do: no formal conversation needed unless other changes appear; simple "You seemed a bit off earlier — everything okay?" in passing.
- Watch-for list: if dips become frequent or start affecting participation/marks.

**Every page ends with:**
- "If you're worried about safety" box, linking to the existing crisis protocol from `WELLBEING_FEATURE_RESEARCH.md` section 2.
- "Remember" bullets: "You're not expected to be a therapist — your role is to notice, listen, and connect." / "Involve SBST/LSA and parents when patterns persist or intensify."

---

## 5. Parent-facing version — what and how much

**Evidence:** Youth self-report best detects internalising problems (depression/anxiety); parent report adds most value for behavioural problems. Parent-view research on school depression screening shows most parents want to be informed if their child is at risk, while adolescent confidentiality is a major factor in willingness to disclose honestly in future check-ins. School-based screening guidance emphasizes clear communication with parents about screening purpose, what happens with results, and what support exists.

**Design principle:** parents see a summary, never raw answers; detail level scales with risk, balancing teen autonomy against parental right to know about significant risk.

### Recommended model: always-on low-detail summary + escalated detail at higher risk
Given the existing POPIA consent model (parents already consent to data collection), this is more defensible than a pure threshold-only-notification model.

**Low-risk view (routine, always available):**
- Header: "Wellbeing check-ins for [Name] – this term"
- "Recent check-ins suggest things are generally okay." + one trend line ("fairly stable over the last few weeks").
- Links to parent resources: "How to talk to your teen about stress and mood," "When to consider extra support," local helplines, DBE PSS info.

**Moderate/high-risk view (triggered by existing alert logic):**
- Header: "Wellbeing check-ins for [Name] – we're a bit concerned"
- Plain-language summary: "Recent check-ins suggest [Name] has been finding things quite tough, especially around [mood/worry/stress]."
- Trend line: "This has been building over the last 2-3 weeks" or "There's been a noticeable change in the last week."
- What the school is doing: "Their homeroom teacher has been alerted and will check in with them." / "Our school support team (SBST/LSA) is available if needed."
- Suggested parent actions: a calm, non-judgemental conversation opener; when to contact a doctor/counsellor/helpline.
- Invitation to collaborate: option to contact the homeroom teacher/SBST contact.

**Safety-flag view (immediate risk):** must trigger direct human contact (call/meeting), not just a portal message. Portal can still show: "We are very concerned about [Name]'s safety based on their recent check-in." / "A staff member has contacted you / will contact you today." / crisis numbers again.

---

## 6. Self-help content structure — format, length, delivery

**Evidence:** effective adolescent digital interventions use brief modules (2-10 min), often interactive (tapping, sliders, breathing animations); simple language (Grade 6-8 reading level), minimal jargon; concrete skills over theory. In LMIC/low-bandwidth contexts, text-light designs with small images/animations and offline-friendly content improve reach. Engagement is higher when content is organized by problem so teens self-select relevance, with a clear "start here" path for those unsure what they need.

### Implementable content architecture
- **Primary navigation by topic:** Exam stress, Low mood/motivation, Worry/anxiety, Sleep, Friendship/family conflict, Self-criticism/confidence — plus a "Start here if you're not sure" hub with 3-5 evergreen micro-tools.
- **Per-topic page format:** short intro (3-5 sentences, normalising) → 3-5 micro-tools (2-5 min each: title, 1-2 instruction screens, optional "Try it now" interactive element) → "If this keeps happening" box (when to talk to an adult, 1-2 sentence conversation-starter scripts, helpline links).
- **Technical considerations for SA context:** lightweight pages (minimal images, compressed animations, text-only fallback); cache key pages after first load for offline-ish use; aim Grade 7-8 reading level, explain any clinical terms simply.

---

## 7. Governance/consistency check with POPIA and existing design

**Adding a parent summary is consistent with, and arguably required by, the existing consent model** — parents already consent to data collection as the "competent person" under POPIA, and a summary doesn't expand who sees raw data, it gives an abstracted summary to an already-consenting party. This matches real school-screening practice: parents are informed of concerns and next steps, not given item-level responses.

**Key POPIA-aligned constraints to maintain:**
- **Purpose limitation:** parent summaries used only to support the child's wellbeing — never for discipline or unrelated profiling.
- **Data minimisation:** summaries/trends only, never raw answers; minimal detail for low-risk students.
- **Security:** parent accounts securely authenticated and separate from student accounts; log access to parent summaries the same way teacher-view access is already logged (per `WELLBEING_FEATURE_RESEARCH.md` section 5's access-logging requirement).
- **Transparency:** update the privacy notice / parent information sheet to explicitly state that parents will see summary wellbeing statuses and, for higher risk, more detailed summaries — and what those summaries do and don't include.

**Ethical/design consistency:**
- Be explicit with learners: "Your homeroom teacher and your parents/guardians can see a summary of how you've been feeling over time, not your exact answers." / "If you indicate you might not be safe, we will involve adults to help keep you safe." — consistent with the existing "no confidentiality when safety is at risk" stance.
- Keep scope framing honest throughout: supportive, not a substitute for professional care; summaries are indicative, not diagnostic.
- Reinforce in teacher guidance: teachers are not therapists, their role is to notice/listen/connect, and summaries are a conversation starter, not a label.

---

## Cross-reference for build phase

- [ ] Existing PHQ-2/GAD-2 scoring and alert logic (sustained elevation, marked decline, new high distress) is untouched — this expansion only adds display/UX on top.
- [ ] A "Wellbeing Tools"/"Help" section exists as its own reachable page, NOT gated behind completing a check-in or behind any score.
- [ ] Post-check-in screen shows the normalising message + "start here" micro-tools + full topic-organized library + "talk to someone" box, regardless of score.
- [ ] Elevated-but-non-crisis scores get a gentle, specific nudge pre-surfacing relevant tools — without locking the rest of the library.
- [ ] Homeroom teacher view is replaced with the 5-section summary template (concern level, primary concern area, trend, suggested action, link to guidance) — raw question-by-question answers are no longer shown to teachers.
- [ ] 4 problem-specific teacher guidance pages exist (low mood, anxiety, sudden decline, single-day dip), each following the What-you-might-notice / Why / Script / Classroom-supports / When-to-involve-others structure, each ending with the safety-flag box and "remember" bullets.
- [ ] Parent-facing view exists with the two-tier (low-risk always-on summary / moderate-high-risk detailed summary) structure — never raw answers at any tier.
- [ ] Safety-flag parent view explicitly states direct human contact has happened/will happen, not just a portal notification.
- [ ] Self-help content is organized by topic (exam stress, low mood, worry, sleep, friendship/family, self-criticism) plus a "start here" hub, each micro-tool 2-5 minutes, Grade 7-8 reading level, lightweight/low-bandwidth-friendly.
- [ ] Privacy notice / parent information sheet updated to disclose the new parent-summary visibility explicitly.
- [ ] Access logging extended to cover parent-summary views, matching the existing teacher-view access log.
