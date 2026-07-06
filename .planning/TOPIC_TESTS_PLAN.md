# Topic Tests — Feature Plan (not built yet)

Status: planning only, per user request 2026-07-06. Do not build until asked.

## Decisions locked in
- Separate section from Library. Library stays as-is (visual polish only).
- Tests are **invisible to students by default** — only appear once a teacher explicitly assigns them.
- Question types: MCQ + short numeric/text answer (auto-graded).
- Diagnostic granularity: **pre-defined sub-skill tags per topic** (fixed taxonomy, not teacher-defined) — this is what makes results "smart."
- Assignment scope: whole class/subject group (matches existing `teacher_students` model), no per-student override in v1.
- Timing: simple overall countdown per test, auto-submit on expiry.
- Content: built from the ground up, CAPS-aligned. This plan defines the *structure* (taxonomy mechanism, data model); actual CAPS question authoring per topic/subject is separate follow-up work, done incrementally subject-by-subject.

---

## 1. Data model

New tables (all RLS, following existing school_id-scoped pattern from `marks`/`mark_sheets`):

### `topic_tests` (test definitions)
```sql
id, school_id, subject_id, grade, term, topic_key (matches existing topic slug e.g. "LinearEquations"),
title, time_limit_seconds, created_by (teacher_id), created_at, is_active
```
One row per test. `topic_key` ties back to the existing Library taxonomy (`ALGEBRA_G10_TOPICS` etc. in `src/features/study/data/`) so a test is always anchored to a real topic.

### `topic_test_subskills` (the fixed diagnostic taxonomy)
```sql
id, topic_test_id, label (e.g. "isolating the variable"), sort_order
```
Curated per topic when the test is authored/seeded. Small, fixed list (3-6 per topic). This is what topic-overview aggregation groups by.

### `topic_test_questions`
```sql
id, topic_test_id, subskill_id, question_type ('mcq' | 'short_answer'),
prompt, options (jsonb, mcq only), correct_answer (text — option key or exact/tolerance value),
answer_tolerance (numeric, nullable, for short_answer), sort_order
```

### `topic_test_assignments` (teacher visibility/gating — the core rule)
```sql
id, topic_test_id, teacher_id, school_id, subject_id, grade,
assigned_at, opens_at, closes_at, is_active
```
A student only sees a test if an active assignment exists matching their subject/grade (via `teacher_students`) and current time is within `opens_at`/`closes_at`. No assignment row = invisible, full stop.

### `topic_test_attempts`
```sql
id, topic_test_id, assignment_id, student_id, school_id,
started_at, submitted_at, time_expired (bool), score_pct
```
One per student per assignment. Prevents retake unless teacher re-opens (v1: one attempt per assignment).

### `topic_test_answers` (per-question, per-subskill granular results — the diagnostic payload)
```sql
id, attempt_id, question_id, subskill_id, student_answer, is_correct
```
This table is what powers both the topic-overview page and the student-card drill-down: aggregate `is_correct` grouped by `subskill_id` across students/attempts.

---

## 2. Teacher-side authoring UX

New sidebar item: **Topic Tests** (teacher dashboard, alongside Marks/Library-progress).

- **Test library view**: list of tests grouped by subject/grade/term (mirrors `MarkSheetGroup` pattern from `marks.ts`). Shows topic, # questions, # sub-skills, assigned/not-assigned status.
- **Builder view** (per topic): add/edit questions, each tagged to one of the topic's fixed sub-skills (dropdown, not free text). Set time limit.
- **Assign flow**: pick a test → select subject/grade group (auto-derived from teacher's `teacher_students` assignments, same pattern as Marks/Classes) → set open/close window → confirm. This creates the `topic_test_assignments` row that makes it visible.
- Authoring is a slow-burn, ongoing task (CAPS-aligned content) — not something built/seeded in one shot. The builder should support empty tests being saved as drafts before questions are complete.

## 3. Student-side test-taking UX

New sidebar item: **Topic Tests** (student dashboard), separate from Library.

- List only shows tests with an active, currently-open assignment for that student's subject/grade. Nothing else exists from the student's point of view — no browsing all tests like Library.
- Start screen: topic name, question count, time limit, single "Start" button (no do-over prompt — starting locks in the attempt).
- Test-taking screen: single overall countdown visible at all times (reuse motion/react + dark `#1C1917` header style from PracticeModule for consistency). MCQ uses existing PracticeModule select-then-confirm pattern; short-answer is a simple bounded text/number input.
- On timer expiry: auto-submit whatever is answered, mark `time_expired = true`.
- Results screen for student: score %, no sub-skill breakdown shown to student in v1 (that detail is teacher-facing only, avoids over-exposing diagnostic labels as a "grade" to the learner) — simple pass/needs-review framing instead.

## 4. Granular results surfacing (teacher-facing)

### New page: Topic Overview (teacher dashboard)
Per subject/grade/topic, a heatmap-style table: rows = sub-skills, columns = students (or vice versa), cell = correct/incorrect/not-attempted. Sortable by "most students struggling with this sub-skill" to spot class-wide gaps fast.

### Student card / profile addition
On the existing per-student view (`StudentProgressPage.tsx` pattern), add a "Topic Test Results" tab: list of attempted tests with score, and a sub-skill breakdown (which specific sub-skills that student got wrong) — same data as Topic Overview but sliced to one student.

Both views read from `topic_test_answers` joined to `topic_test_subskills` — one aggregation function, two slicing dimensions (by student vs by subskill).

## 5. Future: at-risk engine integration

Not built now. When ready:
- Add a new signal source function alongside `computeStudentInsights` in `studentInsights.ts`: something like `computeTopicTestSignals(studentId)` that surfaces subskill-level failure rates as risk indicators, more precise than current subject-average signals.
- Feed into `examRiskSubjects`/`revisionRecs` in `interventions.ts` as an additional weighted input — topic test data should sharpen *which* topics get flagged, not replace existing subject-average signals (data will be sparse early on since tests roll out gradually).
- Deferred until topic tests have real usage data to validate signal quality.

---

## Open items for follow-up (not blocking this plan)
- Actual CAPS-aligned sub-skill taxonomies and question content — done per subject/topic as ongoing authoring work, likely starting with 1-2 pilot subjects (Algebra, Accounting) before wider rollout.
- Whether teachers can clone/reuse a test across terms/classes (likely yes, but not designed here).
- Whether `topic_test_attempts` ever allows a second attempt (e.g. teacher-triggered re-open) — v1 assumes one shot per assignment.
