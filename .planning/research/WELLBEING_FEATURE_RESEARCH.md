# Wellbeing Check-In Feature — Research Foundation

**Status:** Research complete, feature not yet built. This is the evidence base the Wellbeing feature design and build must follow — treat it as a hard constraint, not a suggestion, especially sections 2 (crisis protocol), 5 (POPIA), and 7 (scope claims).

**Context locked in before this research was run:**
- Students check in periodically via a short, low-friction form.
- Only a student's **homeroom teacher** has individual-level visibility — no separate counsellor/welfare-officer role exists in this platform.
- South African high school context: large classes, non-specialist staff, no guaranteed on-site counsellor/psychologist.

**Source:** Perplexity deep research pass, captured verbatim below with section numbering preserved for cross-referencing during design/build.

---

## 1. Evidence-based lightweight repeated check-ins: what minimal questions retain validity?

**Bottom line:** The strongest evidence supports using a 2–4 item ultra-brief screen derived from validated instruments (PHQ-2/PHQ-4 or GAD-2), with an optional single safety item if you are prepared to action positive responses. Going below 2 items (e.g. "mood 0–10 only") loses virtually all validation and is not defensible as a screening tool.

### What the research says
- **PHQ-2** (two items: "little interest/pleasure" and "feeling down/depressed/hopeless" over the past 2 weeks) has been validated in adolescents:
  - Cut-off ≥3 gives sensitivity ~74% and specificity ~75% for DSM-defined major depression; with PHQ-9 as gold standard, sensitivity ~96%, specificity ~82%.
  - Correlates with functional impairment and parent-reported internalizing problems.
- **PHQ-4** (PHQ-2 + GAD-2: "nervous/anxious" and "not able to stop/control worrying") shows good internal consistency (α≈0.81) and a clear two-factor structure (depression + anxiety) in adolescents/young adults in LMIC settings, supporting use in resource-constrained contexts.
- **PHQ-9** is superior to PHQ-2 for detecting depression and school-related stress in adolescents, because it captures somatic/functional symptoms (sleep, concentration, energy) that PHQ-2 misses. But too long for frequent, low-friction check-ins.
- **1-item screens** have markedly lower sensitivity/specificity and are not recommended as stand-alone.

### Implementable design
For a frequent check-in (e.g. 2–3×/week), a defensible minimal set:

**Mood/interest (PHQ-2 style, past 7 days)**
- "In the past 7 days, how often have you felt down, depressed, or hopeless?"
- "In the past 7 days, how often have you had little interest or pleasure in doing things?"
- Response: 0 = Not at all, 1 = Several days, 2 = More than half the days, 3 = Nearly every day.

**Anxiety (GAD-2 style, past 7 days)**
- "In the past 7 days, how often have you felt nervous, anxious, or on edge?"
- "In the past 7 days, how often have you not been able to stop or control worrying?"
- Same 0–3 scale.

**Optional single safety item** (see section 2).

**Scoring:**
- PHQ-2 score = sum of first two items (0–6).
- GAD-2 score = sum of next two items (0–6).
- PHQ-4 total = 0–12.

**Thresholds to flag for human review (non-crisis):**
- PHQ-2 ≥ 3 or GAD-2 ≥ 3 or PHQ-4 ≥ 6 on two or more check-ins within 14 days.
- Aligns with validated cut-offs and adds a "sustained" requirement to reduce noise from single bad days.

This is the shortest battery that still maps onto validated instruments and has published psychometrics in adolescents.

---

## 2. Crisis/safety-question design and immediate-response protocol

### How validated tools phrase safety questions for teens
The most widely used, evidence-based youth suicide screening tool is the **Columbia Suicide Severity Rating Scale (C-SSRS)**, including a Pediatric Quick Screen version designed for schools and clinical settings.

Key wording features:
- Direct but non-leading, behaviour-focused questions.
- Hierarchical structure: wish to be dead → thoughts of killing yourself → plans/intent → behaviour.
- Time frames: past month for ideation, lifetime and past 3 months for behaviour.

Example items from the C-SSRS Pediatric Quick Screen (self-report adapted):
1. "In the past month, have you wished you were dead or wished you could go to sleep and not wake up?"
2. "In the past month, have you had any thoughts of killing yourself?" (If No, skip to #6.)
3. "In the past month, have you thought about how you might kill yourself or make yourself not alive anymore?"
4. "When you had these thoughts, did you think you might actually do something about them?"
5. "Have you ever made a plan for how you would kill yourself or decided when you would do it?"
6. "Have you ever done anything to try to make yourself not alive anymore (hurt yourself on purpose, tried to kill yourself)?" — with follow-up on lifetime and past 3 months.

A digital check-in cannot run the full branching interview — implement a **single safety screen** mirroring the C-SSRS "screener" logic instead.

### A defensible single safety question for a check-in
Based on C-SSRS and PHQ-9 item 9:

> **"In the past month, have you had thoughts that you would be better off dead, or of hurting yourself in some way?"**
> Responses: Not at all / A few days / More than half the days / Nearly every day

This mirrors PHQ-9 item 9 wording (widely used and validated in adolescents) and aligns with C-SSRS concepts.

**Operational rule:** Any response > "Not at all" triggers the high-risk pathway below. (Requiring "More than half the days"+ reduces false positives but increases risk of missing at-risk students — trade-off to decide deliberately, not by default.)

### Immediate-response protocol for digital/asynchronous check-ins
The tool cannot triage in real time — its role is to flag and trigger a human response as quickly as feasible.

**Minimal protocol for this context (homeroom teacher only, no on-site counsellor):**

**1. System actions (automated, immediate) when the safety question indicates risk:**
- Display a prominent, non-judgemental message to the student:
  > "Thanks for sharing this. It sounds like things are really hard right now. You're not alone, and help is available."
- Show South African crisis resources prominently (section 4), with clickable phone/SMS options.
- Encourage the student to contact a trusted adult now.
- Do **not** promise confidentiality — be clear that because they indicated they might not be safe, a caring adult at school will reach out.

**2. Staff alert (within minutes, same day):**
- Generate a high-priority alert to the homeroom teacher (and optionally a designated senior staff member) with: student name, class, timestamp, exact safety response, and any other concerning data from that check-in.
- Require the teacher to acknowledge receipt in the system.

**3. Teacher's first contact (same school day, ideally within hours):**
- Private, face-to-face conversation (or video call if remote) using the script in section 4.
- Goal: listen, validate, assess immediacy ("Are you thinking about hurting yourself right now?"), activate external support if risk is current/high.

**4. If risk appears imminent (current intent/plan/means):**
- Teacher/designated staff immediately contacts parent/guardian (if reachable) and an external crisis line or emergency services (10111, 10177, SADAG/Childline for guidance).
- Do not leave the student alone until a responsible adult has taken over.

---

## 3. Trend/pattern detection: what patterns actually warrant attention?

- PHQ-9/PHQ-2/PHQ-4 are used for case-finding **and** for monitoring change over time.
- A single elevated score has modest positive predictive value; risk is higher with **sustained elevation over multiple time points** or a **clear downward trend from baseline**.
- Within-person change is meaningful — school-related stress manifests as worsening somatic/functional symptoms over time.
- Limited direct research on optimal algorithmic alert thresholds for school check-ins specifically, but clinical practice supports:
  - Sustained elevation (above cut-off on ≥2 occasions within 2–4 weeks).
  - Rapid decline relative to baseline (e.g. ≥4-point drop in PHQ-4 equivalent over 2–3 check-ins).
  - Combination rules: moderate elevation + safety item + functional decline.

### Practical thresholds
For each student:
- **Baseline:** median of their first 3–5 check-ins (PHQ-4 total, 0–12).
- **Current score:** most recent check-in PHQ-4.

**Alert conditions (non-crisis, teacher to review):**
- **Sustained elevation:** PHQ-2 ≥ 3 or GAD-2 ≥ 3 on ≥2 check-ins within 14 days, and no safety-item trigger.
- **Marked decline:** current PHQ-4 ≥ 4 points lower than baseline, and current PHQ-4 ≥ 6 (moderate distress).
- **New high distress:** first time PHQ-4 ≥ 9 (severe range) even with no prior history.

**De-prioritise / suppress alerts when:**
- Single isolated elevation that returns to baseline next check-in.
- Very low variability students who occasionally tick "several days" but otherwise stable.

This reduces alert fatigue while still catching sustained or sharp deteriorations.

---

## 4. Non-specialist staff handling sensitive disclosures: risks, constraints, SA-specific referral resources

### Risks of putting homeroom teachers in this role
- Teachers are not therapists and should not be expected to provide counselling or risk assessment beyond basic, scripted steps.
- Risks: over-reliance on teachers to manage complex cases without training, inconsistent responses across teachers, potential re-traumatisation from poorly handled conversations, burnout/moral distress for teachers.
- However, South Africa's **Learner Support Agent (LSA) framework** explicitly envisages non-specialist school staff (LSAs, teachers, SBST members) providing first-line psychosocial support, identification, and referral in schools that lack psychologists — so this model has real local precedent.

### Recommended design constraints and supports
- Position the tool as **early signal + conversation starter**, not a diagnostic or therapeutic intervention (see section 7).
- Limit teacher responsibilities to three verbs: **Notice** (see alert) → **Check in** (brief, supportive conversation) → **Connect** (link student to external help/parent/senior staff).
- Provide pre-written scripts and step-by-step flowcharts inside the platform.

### Minimal teacher script (adapted from suicide-prevention gatekeeper models and DBE guidance)

**Open:**
> "I noticed your recent check-ins suggested things have been really tough. I'm glad you shared that. I'm not here to judge or fix everything, but I do care and want to make sure you're okay."

**Ask directly about safety (if safety item flagged):**
> "Sometimes when people feel this low, they think about hurting themselves or wish they wouldn't wake up. Has that been happening for you?"
> If yes: "Are you thinking about doing that now?" "Do you have a plan or a way to do it?"

**Validate and normalise:**
> "It makes sense you'd feel this way given what you're going through. Lots of learners feel like this at some point, and it can get better with support."

**Explain limits of confidentiality:**
> "Because I'm worried about your safety, I can't keep this just between us. I need to involve [parent/guardian/another adult] so you can get proper support."

**Plan next step:**
> "Let's together decide who else should know and what help might make sense. There are also people outside school we can contact who specialise in this."

### Training needs (minimum)
2–3 hour gatekeeper training (e.g. adapted from SOS Signs of Suicide, QPR, or DBE's LSA training content) covering: recognising warning signs, asking about suicide directly and calmly, listening non-judgementally, referral and documentation.

### South Africa-specific external referral resources
**Verify current numbers locally before hard-coding into the product.**

- **Childline South Africa** — 24-hour counselling for children and families. Toll-free: 08000 55 555 (widely cited; confirm locally).
- **SADAG (South African Depression and Anxiety Group)** — General line: 011 234 4837. Suicide Crisis Line: 0800 567 567 (toll-free).
- **Lifeline South Africa** — 24-hour crisis/counselling lines; numbers vary by province (e.g. Cape Town 0861 322 322). Schools typically partner with their nearest branch.
- **Department of Basic Education (DBE) Call Centre** — 0800 202 933.
- **Emergency services** — 10111 (police), 10177 (ambulance) for immediate danger.

**DBE policy context:** The DBE's *Guide for Learner Support Agents and Schools on Providing Psychosocial Support to Learners* outlines roles of LSAs, School-Based Support Teams (SBSTs), and SMTs in screening, identification, and referral, with emphasis on early identification and linkage to external services where specialist care is unavailable on site. Escalation flow should align with this: **teacher → SBST/LSA (if present) → parent/guardian → external service (Childline/SADAG/Lifeline/clinic).**

---

## 5. POPIA and other legal/ethical constraints for minors' mental-health data

### POPIA basics relevant to this system
- Mental-health-related check-in data likely qualifies as **"special personal information"** (health data) under POPIA, which has stricter processing conditions.
- Lawful processing requires at least one condition: consent of the data subject (or competent person for a child), protection of vital interests, legal obligation compliance, or legitimate interests not overriding the child's rights.

### Consent and parental involvement
- POPIA refers to a **"competent person"** (usually a parent/guardian) who can consent on behalf of a child.
- For special personal information, **explicit consent is generally required** unless another specific exception applies.
- **Best practice / likely required for this feature:**
  - Written parental/guardian consent (opt-in, or clearly communicated opt-out with strong justification) before collecting mental-health-related data from learners.
  - Age-appropriate explanation to learners about what data is collected, why, who sees it, and their rights.
  - "Vital interests" (protecting learners from harm) is a legally riskier basis and should be reviewed by a POPIA officer/legal counsel before relying on it instead of consent.

### Data minimisation, retention, access, deletion
- **Purpose specification/minimisation:** collect only what's necessary for the stated purpose (early wellbeing signal, not comprehensive clinical assessment).
- **Retention limits:** don't keep longer than necessary. A time-limited retention (e.g. delete/anonymise after the learner leaves the school, or after 2–3 years unless there's an active safeguarding concern) is defensible.
- **Security safeguards:** encryption, access control, audit logs.
- **Access/correction rights:** learners/parents can request access and correction.
- **Deletion:** when no longer authorised to retain, data must be destroyed or de-identified irreversibly.

### Implementable POPIA-aligned practices
- Store check-in data in a separate, access-controlled module with role-based access (only homeroom teacher for individual data; aggregate only for others) and audit logs of who accessed which learner's data and when.
- Define a retention policy (e.g. "delete or fully anonymise check-in data 12 months after the learner leaves the school, unless there is an active safeguarding case, in which case retain per school safeguarding policy").
- Provide a privacy notice to parents/learners covering: what data is collected, purpose, who sees it, retention period, POPIA rights, and contact details for queries/complaints.

---

## 6. Documented failure modes and mitigations

**a) Over-surveillance and stigma**
- *Risk:* students perceive the check-in as monitoring/policing; peers infer who "needs help" if usage is visible.
- *Mitigation:* make participation universal (all learners check in, not just flagged students); no public display of who completes check-ins, no leaderboards/visible statuses; frame as "wellbeing for everyone."

**b) False reassurance from unmonitored check-ins**
- *Risk:* student discloses distress but no one responds promptly ("I told them and nothing changed").
- *Mitigation:* only implement if same-day human follow-up for safety flags can be guaranteed; be transparent with students that sharing an unsafe response triggers same-day contact from a caring adult.

**c) Alert fatigue for teachers**
- *Risk:* too many alerts (every mildly bad day) → teachers ignore/minimise, missing real crises.
- *Mitigation:* pattern-based rules (sustained elevation, marked decline) rather than single-point thresholds; summary views ("3 learners need attention this week") instead of constant pings; allow teachers to snooze/mark "already addressed" for a defined period.

**d) Gaming the check-in**
- *Risk:* students minimise scores to avoid follow-up, or inflate to get attention, undermining validity.
- *Mitigation:* keep the tool low-stakes (not for grading/discipline/labelling); avoid automatic punitive/intrusive consequences for high scores; combine self-report with teacher observation rather than relying solely on the score.

**e) Confidentiality breaches**
- *Risk:* staff discussing a learner's data inappropriately, peers seeing screens, insecure storage.
- *Mitigation:* strict access controls (homeroom teacher only for individual data), staff training on confidentiality and POPIA, technical safeguards (authentication, encryption, no shared accounts, auto-logout).

---

## 7. Realistic scope for a small platform team: what to claim (and not claim)

Given real constraints (no on-site mental health professionals, no 24/7 monitoring), the defensible scope:

### What the feature CAN credibly claim to do
- Provide an early signal that a learner may be struggling emotionally.
- Support caring conversations between learners and their homeroom teacher.
- Help teachers notice patterns (sustained low mood, increasing anxiety) they might otherwise miss.
- Connect learners and families to appropriate external support (Childline, SADAG, clinics).

This aligns with DBE's vision of schools as psychosocially supportive environments where non-specialists identify and refer, not treat.

### What it must explicitly NOT claim to do
Communicate clearly to students, parents, and staff that the feature:
- Is **not** a clinical diagnostic tool and does not diagnose depression, anxiety, or any disorder.
- Is **not** a crisis intervention service and cannot guarantee immediate help in an emergency.
- Does **not** replace professional mental health care, counselling, or emergency services.
- Does **not** ensure confidentiality when safety is at risk — appropriate adults will be involved.

### Example wording for a student/parent information page
> "This check-in is a simple way for you to share how you've been feeling lately. It helps your homeroom teacher notice if things seem tough over time. It is not a medical test or a way to diagnose problems, and it is not an emergency service. If you ever feel in immediate danger, please call 10111, 10177, or a crisis line like Childline (08000 55 555) or the SADAG Suicide Crisis Line (0800 567 567) right away."

This framing matches how school-based screening programmes and eHealth tools describe their role: early identification and referral, not treatment or crisis management.

---

## Cross-reference for build phase

When designing/building this feature, every one of these must be explicitly addressed, not silently dropped:
- [ ] Question set matches section 1 (PHQ-4 style, not an invented mood/energy/stress slider unless deliberately deviating with a documented reason).
- [ ] Safety question wording matches section 2, with the full automated + staff-alert + same-day-contact pipeline implemented, not just a UI message.
- [ ] Alert/trend logic matches section 3's sustained-elevation and marked-decline rules, not single-point triggers.
- [ ] Teacher-facing UI surfaces the script from section 4, not just raw scores.
- [ ] SA crisis resources (section 4) are real, verified, current numbers before shipping — do not ship placeholder/unverified numbers.
- [ ] POPIA consent flow (section 5) is designed before any real student data is collected — this is a legal gate, not a nice-to-have.
- [ ] Failure-mode mitigations (section 6) are reflected in the UI/UX design (universal participation, no visible status, snooze/summary views, no punitive framing).
- [ ] All user-facing copy (student, parent, teacher) matches the honest-scope framing in section 7 — no language implying diagnosis, therapy, or guaranteed crisis response.
