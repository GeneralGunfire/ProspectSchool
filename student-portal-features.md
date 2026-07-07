# Prospect — Student Portal Feature Breakdown

Full page-by-page audit of the student/learner account: layout, copy, and mechanics (what's fetched, what's computed, what happens on interaction). Generated 2026-07-08.

---

## Entry Points

### Portal Entry (`src/pages/portal/PortalEntry.tsx`)
Role-picker screen. Three cards: Learner / Teacher / Admin. Learner card — icon `BookOpen`, eyebrow "For Students", label "Learner", description "Access your study library, marks & career tools." Clicking routes to `student-login`. Footer: "Need access? Contact your school administrator." + "© {year} Prospect South Africa · Free for every school".

### Student Login (`src/pages/auth/StudentLogin.tsx`)
Fields: **School Code** (uppercased, placeholder "e.g. GHS001"), **Student Code** (uppercased, placeholder "e.g. STU-0001"), **PIN** (numeric, max 10 digits, show/hide toggle, placeholder "10-digit PIN", helper "Assigned by your teacher"). "Remember school & student code" checkbox (checked by default) — persists school+student code (never the PIN) to `localStorage` (`prospect_student_remember`).

**Mechanics** (`lib/auth.ts` → `studentLogin`):
1. PIN must match `^\d{10}$` exactly.
2. Look up `schools` by `school_code` → error "School code not found."
3. Look up `students` by `school_id` + `student_code` (joined with `cohorts`) → error "Student code not found."
4. Hash entered PIN (Web Crypto SHA-256) and compare to stored `pin_hash` → error "Incorrect PIN."
5. Build `StudentSession` (id, school, name, grade, cohort) → store in `localStorage` (`prospect_student_session`).
6. Navigate to `student-dashboard`.

Note: unlike teacher/admin logins, student login does **not** update `last_login_at`.

---

## Dashboard Shell (`src/pages/portal/StudentDashboard.tsx`)

Sidebar nav (desktop: fixed 224px, pill buttons, active = dark bg/white text; mobile: hamburger → slide-in drawer):

| Icon | Label | id |
|---|---|---|
| Home | Home | `home` |
| Megaphone | Announcements | `announcements` |
| CalendarDays | Calendar | `calendar` |
| ClipboardList | My Marks | `marks` |
| FolderOpen | Resources | `resources` |
| FileText | Past Papers | `pastpapers` |
| BookOpen | Library | `library` |
| ClipboardCheck | Topic Tests | `topic-tests` |
| GraduationCap | APS & Unis | `aps` |
| Sparkles | My Future | `future` |

- Library and My Future are lazy-loaded (`React.lazy` + `Suspense`, spinner fallback); the rest are eager.
- Internal `innerPage` state (default `'library'`) lets Library deep-navigate into individual `learning-*` lesson pages without leaving the Library tab; switching to any other top-level nav item resets it.
- On mount: checks `getStudentSession()`; redirects to `student-login` if none.
- Sign out: `studentLogout()` (clears session from localStorage) → navigate to `portal`.

---

## Home (`StudentHomePage.tsx`)

**Fetched on mount** (parallel): student's `subject_id`s (via `teacher_students`), `fetchStudentAnnouncements` (top 3), `fetchStudentEvents` for current month (split into next-3 upcoming events + up to 8 pending homework), `fetchStudentCompletions`, `fetchStudentResults` (marks), `fetchStudentProgress` (library progress).
Non-blocking follow-up chain: `fetchApsScore` → `syncInterventionsFromRisk` → `syncOutcomesFromMarks` → fetch active/completed interventions + outcomes → fetch checklist templates per intervention type.

**Sections, in order:**

1. **Header** — eyebrow "Dashboard", greeting "Good morning/afternoon/evening, {name}." (time-of-day from `Date().getHours()`), subtitle "{school} · Grade {grade} · {cohort}". Top-right: APS badge if known, else a "Goal" card showing `targetCareer`.
2. **Daily Focus Card** (dark hero) — one prioritized item: homework due today (urgent) → due tomorrow (soon) → next exam/assessment (exam) → next pending homework → "You're all caught up." Shows urgency badge, title, date, matched subject average (fuzzy keyword match), up to 3 more pending items under "Also pending", contextual CTA buttons, and a homework-completion ring (`{done}/{total} done`).
3. **Stat cards row** (4): Upcoming Event, Pending Homework (ring + "X due today"/"tasks remaining"), Average Mark (animated counter + sparkline of last 6 marks + best/weakest subjects), Announcements (count + latest title).
4. **Academic Health + Calendar Overview** (2-col) — Health: animated bars for Homework Completion %, Average Mark %, Library Progress (`started/35`), Upcoming Assessments, APS bar with tier text (Strong ≥35 / Good ≥28 / Building ≥20 / Getting started). Calendar: 7-day week strip + up to 3 upcoming events.
5. **Pending Homework + Subject Breakdown** (2-col) — Homework grouped by urgency (Due Today/Due Tomorrow/This Week), each row toggleable (calls `markHomeworkDone`/`unmarkHomeworkDone`, optimistic update). Subject Breakdown: per-subject icon glyph (∑ math, A english, ⚗ science, ★ history, ◉ geography, $ accounting, ◈ business, ◆ default), count, colored %, progress bar.
6. **Academic Story card** (≥3 assessments) — Earlier vs Now average + delta, Strongest Growth / Most Consistent / Needs Attention subjects (from `computeStudentInsights`).
7. **Academic Coaching card** (if active interventions exist) — impact stats (Completed/Success rate/Avg gain) once ≥2 completed, "Most effective for you" callout, up to 3 active intervention cards (colored by reason) with rationale text, checklist (once started, persisted via `updateChecklistProgress`), "Start"/"Continue" and "Done" buttons.
8. **Intervention History card** — last 6 outcomes, colored by result (improved/declined/unchanged), "{prev}% → {new}%".
9. **Momentum ("This Week") card** — Homework Done / Topics Studied / Topics Mastered / Mark Trend tiles, contextual sentence by trend magnitude.
10. **Recommended Actions card** — up to 3 items from: urgent/soon homework, weakest subject <65%, exam ≤10 days, latest announcement, APS gap, career goal reminder.
11. **Recent Activity card** — merged last 3 marks + last 3 announcements (max 5), plus 3 contextual quick-action chips depending on state (struggling / exam soon / neutral).

**Key calculations**: `gradeLabel` — ≥80 Outstanding, ≥70 Merit, ≥60 Adequate, ≥50 Moderate, ≥40 Elementary, else Not Achieved (used across the whole app). `hwCompletionPct = completions/(pending+completions)*100`. `markTrend` = avg(last 3 marks%) − avg(previous 3 marks%).

---

## Announcements (`StudentAnnouncementsPage.tsx`)

**Fetched**: subject ids → `fetchStudentAnnouncements`. Fires `trackAnnouncementViews` (batch, fire-and-forget) on load.

**Read state**: client-only, `localStorage` (`prospect_read_announcements_{id}`) — not server-tracked.

**Category detection** (`detectCategory`, keyword match on title+body, no DB field): Exam (red), Homework (blue), Urgent (amber), Event (violet), General (stone).

**Layout**: header ("Announcements" / "Messages from your school and teachers."), unread-count badge if >0, category filter pills ("All (N)" + detected categories), then **Pinned** then **Recent** groups. Each card: unread dot, bold-if-unread title, pin icon + category pill, collapsed preview (`line-clamp-1`), meta "{author} · {time ago}". Click toggles expand (animated) and marks read.

Empty states: "No announcements yet." / "Your teachers and school admin will post updates here." Filtered-empty: "No {category} announcements." + "Show all".

---

## Calendar (`StudentCalendarPage.tsx`)

**Fetched**: subject ids, `fetchStudentCompletions`, `fetchStudentResults` (non-blocking), `fetchStudentEvents` for selected month (refetches on month/year/subject change).

**Header**: "My Schedule", Today button, month prev/next (animated label), Grid/List toggle.

**Intelligence sections** (computed client-side):
1. **This Week card** (dark) — Homework/Assessment/Exam counts, "Est. Hours" = `hw*0.5 + assess*1.5 + exam*2`, busiest day + qualitative label (Heavy ≥6h / Manageable 3–6h / Light <3h).
2. **Countdown cards** — next exam & next assessment, days-remaining colored (≤3 red, ≤7 amber).
3. **Priority Deadlines card** — up to 7 upcoming events, urgency label (Today/Tomorrow/N days).
4. **Schedule Warning banner** (amber) — shown if a future day has ≥3 events: "{Day} has {count} deadlines — consider starting work earlier this week."
5. **Suggested Study Time banner** — lightest-load future day this week; mentions career goal if set.
6. **Revision Suggestions card** — top 2 from `computeStudentInsights().revisionRecs`, matched to upcoming exam/assessment, with urgency badge + "Library"/"Papers" buttons.
7. **Goal Reminder card** — shown only if no revision suggestions and a goal is set.

**Grid view**: month grid, today = dark circle, up to 2 event chips per day (`line-through` if homework done), "+N more" overflow, click opens day-detail sidebar.
**List view**: events grouped by date, strikethrough if done, toggle-done button on homework rows.

**Right sidebar** (desktop): day-detail panel (event list, click to expand description or attachment "Download" via `getAttachmentDownloadUrl`), or "Upcoming Events" panel (top 5), Legend card, and a **"Connect Google Calendar" card — button has no onClick handler, purely decorative/inert.**

---

## My Marks (`StudentMarksPage.tsx`)

**Fetched**: `fetchStudentResults`, then `syncOutcomesFromMarks` → completed interventions + outcomes.

1. Header "My Marks". Empty state: "No results yet." / "Your marks will appear here once your teacher has recorded them."
2. **Overall summary hero** (dark) — animated ring % + "N results tracked" + `learnerStatus` badge.
3. **Subject Risk section** — high/medium risk subjects (from insights engine) with reason bullets + exam-days pill + action buttons.
4. **Performance Journey card** (≥4 marks) — Early vs Recent average + delta, Strongest Growth / Needs Attention callouts.
5. **Recommended Actions card** — up to 2 of: weakest subject <65% ("Your Highest Impact Opportunity"), exam-risk subject, APS goal gap.
6. **Strength/Weakness Banner** — Strongest (green) / Needs Attention (amber) cards.
7. **Subject panels (accordion)** — collapsed: rank badge (#N of M), health score (0–100 = `avg*0.5 + trendScore*0.25 + consistencyScore*0.25`), assessment count + grade label, trend arrow+delta, overall %.

   **Expanded**: 4-stat snapshot (Best %, Assessments, Consistency band, Projected Range at 50%/90% next result); weighted final marks per term (`computeFinalMark`); achievement chips (Best %, Best Jump, Completed count, linked intervention gains); **Performance Zone Bar** (5-band 0–40/40–50/50–70/70–80/80–100 with marker); Recharts bar chart with reference lines at 50/70/80; By Type breakdown (if ≥2 assessment types); Grade Distribution (CAPS bands, if ≥3 marks); Focus Area card; Smart Insights (auto sentences — type gaps, trend, "one more 75%+" projections, consistency); "What If Next Result Is…" (50/70/90% scenarios); type filter pills; assessment timeline (dot list, click opens detail drawer).
8. **Assessment Detail Drawer** — huge % + grade label + mark/total, auto insight sentence, small "Trend Leading In" bar chart, teacher note (amber card) if present.

---

## Resources (`StudentResourcesPage.tsx`)

**Fetched**: subject ids → `fetchStudentResources`.

**LocalStorage**: `prospect_recent_resources_{id}` (last 5 opened — powers "Recently Viewed" and "Suggested For You" = anything not in this set).

**Layout**: header "Class Resources" / "Study materials from your teachers."; Suggested For You (up to 3 unviewed); Recently Viewed (horizontal strip); Search + Subject/Type/Tag filter pills + result count; resource list (type icon, title, category/subject/type badges, "Viewed" badge, description, link/file preview, collapsible note content with "Read"/"Collapse"). Action: "Open"/"Visit" (signed URL via `getResourceDownloadUrl`, new tab) or note expand.

Empty states: "No resources yet." + "Open Library Instead" button; filtered-empty: "No results." + "Clear filters".

**Mechanics**: opening a resource always logs to the recent-viewed localStorage list and fires `trackResourceDownload` (fire-and-forget).

---

## Past Papers (`StudentPastPapersPage.tsx`)

**Fetched**: `fetchAllPastPapers`, `fetchSubjects`.
**LocalStorage**: `prospect_recent_papers_{id}` (last 5), `prospect_practice_history_{id}` (last 20 self-marked sessions).

**List view**: header "Past Papers" / "Exam papers uploaded by your school."; Recommended For You (unopened, matching grade); Recently Opened (green dot if has memo); Practice History (last 5, "No score" if abandoned); Search + expandable Filters (Subject/Grade/Year/Term pill filters, active-count badge, "Clear N filters"); paper list rows with difficulty badge (Exam=red/Test=amber/Trial=violet/Paper=grey, keyword-derived from title) and 3 buttons: **Practice**, **Open** (signed URL new tab), **Memo** (if exists).

**Practice Mode** (full-screen takeover, state machine `setup → active → complete`):
- **Setup**: duration picker (30/60/90/120/150/180 min, default 60), warning text, "Start — {duration}" button.
- **Start**: opens paper file in new tab via `getPastPaperDownloadUrl`, sets `phase: active`, records `startedAt`.
- **Active — timer**: `setInterval` every 1s computes elapsed time; auto-transitions to `complete` when time runs out (no auto-submit of a score — just moves to self-mark). Countdown pill turns red at ≤300s remaining. Buttons: Reopen Paper, Open Memo (marks `memoOpened`), "Done — Self Mark Now" (ends early).
- **Complete — self-mark**: numeric score input (0–total), live % preview, "Open Memo to Check Answers" link, "Save Result" (disabled until valid) → `submitSelfMark`:
  - Computes %, prepends record to practice history (capped 20, persisted).
  - **Closes the loop with the coaching engine**: if an active `past_paper`-type intervention exists for a fuzzy-matching subject, calls `completeIntervention` for it automatically.
  - Shows result screen: colored %, "{score}/{total} marks", "Completed in {timer}", qualitative sentence (Strong / On track / Below pass mark), "Review Memo", "Back to Past Papers".
  - "Skip — Exit Practice" abandons without recording.

**Grading is entirely self-reported** — no answer-key comparison; student manually enters their own mark after checking the memo, no server-side validation.

---

## Library (`LibraryPage.tsx` → `StudyLibraryPage.tsx`)

`LibraryPage.tsx` wraps content in `StudySessionProvider` (passes student/school context to lesson pages for progress tracking) and switches between the hub and ~29 lazy-loaded individual lesson pages based on `innerPage`.

**`StudyLibraryPage` — 3-step wizard** (`subject → grade → content`), with a `sessionStorage` "return context" so a lesson page can send the student back directly into the content step rather than resetting the wizard.

1. **Subject step** — hero "What are you studying?", search box, subjects split "Available Now" (algebra, phys-sci, life-sci, accounting, business-studies, economics, cat, egd) vs "Coming Soon" (locked, disabled).
2. **Grade step** — dark hero confirming subject, grade buttons 10/11/12 — **only Grade 10 enabled**, 11/12 show "Soon" and are disabled. Subtitle: "Grade 10 fully available · Grades 11 & 12 coming soon".
3. **Content step** — dark hero ("Grade {G} · Term {T}", "{N} topics · Lesson, worked example & quiz per topic"), numbered topic cards with tag row (Lesson · Worked example · Practice), clicking navigates to a `learning-*` page. **Only Grade 10 Term 1 is populated** (hardcoded arrays): Algebra (2 topics), Physical Sciences (5), Life Sciences (4), Accounting (6), Business Studies (4), Economics (5), CAT (4), EGD (1). Below the list: a `QuizBlock` per subject — 7 hardcoded shuffled MCQs, `sessionStorage`-persisted attempt state, explanation shown per answer. Empty grade (11/12): "Coming soon" card + "Browse other subjects".

Individual lesson pages (e.g. `LinearEquations.tsx`) were not inspected in this pass — presumed lesson + worked example + quiz format feeding `study_progress` via `StudySessionProvider`.

---

## Topic Tests (`StudentTopicTestsPage.tsx`) — newly built

Teacher-assigned, timed, topic-scoped micro-assessment. 4 stages: `list → intro → taking → results`.

### Visibility gating (`lib/topicTests.ts` → `fetchStudentVisibleTests`)
A test only appears if **all** hold:
1. A `topic_test_assignments` row exists matching student's `school_id` + `grade`, with `subject_id` among the student's enrolled subjects.
2. Assignment `is_active = true`.
3. `opens_at <= now()`.
4. `closes_at` is null or still in the future.
5. The linked `topic_tests` row itself has `is_active = true`.

One attempt per assignment+student, enforced in `startTopicTestAttempt` (re-starting returns the existing attempt, no duplicate).

### List stage
Header "Topic Tests" / "Short, timed tests your teacher has assigned. These only appear here once your teacher sets them." Empty: "No tests assigned right now" / "Check back once your teacher assigns one." Card per test: title, "Grade {G} · Term {T}", time-limit chip. If attempted: "Awaiting marks" (amber, if any `open_text` answer unmarked) or `{score}%` (emerald ≥70). If not attempted: "Start Test →".

### Intro stage
Title/grade/term, question-count + time-limit stats, amber warning: "Once you start, the timer can't be paused. If time runs out, your answers so far are submitted automatically." "Start Test" (disabled if zero questions) → `startTopicTestAttempt`, sets `secondsLeft = time_limit_seconds`, moves to `taking`.

### Taking stage
Header: title, "Question {n} of {N}", live countdown pill (red at ≤60s). Segmented progress bar. **Timer**: `setInterval` at 1s decrementing `secondsLeft`; at ≤1 it force-submits (`time_expired = true`) with whatever is answered. Question types: `mcq` (button list, dark-highlighted selection), `open_text` (textarea), `short_answer` (numeric text input). Sub-skill badge shown per question. "Next Question" disabled until answered; last question reads "Submit Test".

### Grading (`gradeAnswer`)
- `open_text` → always `null` (never auto-graded — requires teacher marking via `markAnswer`/`finalizeAttemptGrading`).
- `mcq` → exact string match.
- `short_answer` → numeric tolerance compare if `answer_tolerance` set (`|given − correct| <= tolerance`), else case-insensitive trimmed string match.
- Empty answers always grade `false`.

`submitTopicTestAttempt` computes a **provisional** `score_pct = correctCount/questions.length*100` (unmarked open_text counts as incorrect for now) and `grading_complete = !hasUngraded`. Once a teacher marks all open-text answers and finalizes, score is recomputed over **all** answers and `grading_complete` flips true.

### Results stage
If test has open_text questions: "Test submitted"/"Time's up!" + "Your teacher will mark your written answers. Your final result will show up here once marking is complete." Else: "Your result is now visible to your teacher, who will see exactly which parts of this topic to help you with next." "Back to Topic Tests" reloads the list (shows the new score/awaiting-marks pill).

### Question bank
`TOPIC_CATALOG` currently has one entry (`math-10-1` — Grade 10 Term 1 Mathematics: Algebraic Expressions, Exponents, Number Patterns, Equations and Inequalities; ~8–10 mixed MCQ/short-answer questions each). Used by teachers via `seedCatalogTest` to one-click populate a fully authored test — students never see this catalog directly.

---

## APS & Unis (`ApsCalculatorPage.tsx`)

**Left column:**
1. **Subjects & Marks card** — pre-populated with English, Mathematics, Physical Sciences, Life Orientation at 0%. Each row: subject `<select>` (grouped by category), % input (0–100), NQF badge (L1–L7, color-coded), remove button. "Add Subject" (dashed). "Use My Marks" (if logged in) — fetches marks, averages per subject, fuzzy-matches to `NSC_SUBJECTS` by keyword, replaces the list; becomes green "Marks Loaded".
2. **APS Score card** — big number, color-banded (≥40 emerald/≥30 blue/≥24 amber/else neutral), qualitative subtext (0: "Enter your marks above"; <24: Diploma & Certificate; 24–29: Most degrees; 30–37: Wide range; ≥38: Competitive for top programmes).
3. **APS Goal progress bar** — "{aps}/{goal}", animated fill, "N more points to reach your goal" or "Goal reached."
4. **APS Roadmap card** (only if marks loaded + goal exceeds APS) — from `computeStudentInsights().apsRoadmap`: up to 6 subject-improvement steps, `{current%} → {target%}` with NQF transition, "+{gain} pt(s)", sorted by biggest gain.
5. **NQF Conversion Guide** — static table L7 (80–100% Outstanding) → L1 (0–29% Not achieved); footnote: Life Orientation capped at level 1 (max 1 APS point) at most universities.

**Right column:**
1. **Goal Planner** (toggleable, auto-restored from `localStorage prospect_aps_goal_{id}`) — Target APS input + quick picks (30/35/40). When target > current APS:
   - **Gap analysis** — per subject, next NQF threshold % and resulting APS gain (Life Orientation capped toward level 1), sorted by biggest gain; "All subjects are at maximum NQF level. Well done!" if maxed.
   - **"Degrees You'll Unlock at APS {target}"** — up to 8 degrees with `minAPS` between current and target.
2. **Filters bar** — Field-of-study select, University select, "Qualifying only" toggle, live count "{qualifying} qualifying · {shown} shown".
3. **Degree cards (accordion)** — check/X by qualification, university short-name badge, duration, name, faculty, min-APS (green if met); sorted qualifying-first then by descending min-APS. Expanded: APS shortfall if not met, subject-requirement checklist, notes callout, footer "{university} · {faculty}".
4. **Disclaimer banner** — indicative scores, verify with university directly, additional entry requirements may apply (portfolio/interview/NBT).

**Calculations** (`src/data/apsData.ts`):
- `percentToNQF`: ≥80→7, ≥70→6, ≥60→5, ≥50→4, ≥40→3, ≥30→2, else 1.
- `calculateAPS`: sums NQF levels of subjects with `percent > 0`, **except Life Orientation is capped at max 1 point contribution** regardless of its actual level.
- APS auto-saves to Supabase (debounced 1500ms) whenever `aps`/`subjects` change and `aps > 0`.

---

## My Future (`MyFuturePage.tsx`)

**Fetched in parallel**: `fetchStudentProgress`, `fetchQuizResults` (recomputed client-side via `computeQuizResults` rather than trusting a cached blob), `fetchApsScore`, `fetchSavedBursaryIds`. Non-blocking: completed interventions + outcomes.

Hub with 3 inline sub-views (`quiz`, `careers`, `bursaries`) swapped via local state — no page navigation away.

**Sections:**
1. **Profile Hero** (dark) — school, name, "Grade {G} · {cohort}", 3 stat pills (APS, Mastered, Career Fit %).
2. **My Goals card** — prompt if unset ("Set Goals" button); else chips for Target APS (green if met) and Target Career. Edit mode: APS input + quick picks (28/32/36/40), career text input + quick-picks from top 4 quiz matches. Persists via `saveStudentGoals` (localStorage — same store read by Home/Calendar/Marks/APS pages).
3. **Explore grid** (4 cards) — Career Quiz, Career Browser, Bursary Finder, APS Calculator, dynamic subtitles reflecting current state.
4. **Career Matches section** — if quiz taken: headline "Based on your {code1} + {code2} profile", profile description, top 5 matches (compatibility %, title, category, education path, salary range, APS requirement). "Browse all careers" link. Else: CTA to take quiz.
5. **APS & University Readiness** — if known: APS number, "You qualify for:" (green, top 3), "Almost there:" (amber, within 5 points), link to calculator. Else: CTA.
6. **Study Progress** — 3 stat tiles (Started/Mastered/Needs Practice) + per-subject mastery bars, or CTA to open Library.
7. **Saved Bursaries** — up to 3 (name, provider, category) + "View all" link, or CTA to browse.
8. **Academic Journey / Milestones card** — `learnerStatus` header, milestone checklist (achieved = green check + detail; not yet = grey dot + "Not yet"), footer progress bar "{N} of {M} milestones reached".
9. **Growth Timeline card** (from `buildGrowthTimeline`) — vertical dotted timeline: goal_set (blue), intervention_completed/outcome_recorded (green if positive, red if negative), intervention_started (amber) — "Your Story So Far".

---

## Cross-Cutting Systems

- **`computeStudentInsights`** (`lib/studentInsights.ts`) — the shared "intelligence engine" behind exam-risk flags, revision recommendations, academic-story deltas, learner-status score/label, milestones, and the APS roadmap. Called independently (different data subsets) from Home, Calendar, Marks, My Future, and APS.
- **Interventions system** (`lib/interventions.ts`) — subject risk → suggested action (past_paper / library_topic / revision / resource_review) → completion tracking → outcome measurement (before/after mark comparison) → growth-timeline narrative. Silently synced (not just displayed) from Home, Marks, and Past Papers — completing a recommended past paper or visiting a page can mark an intervention started/completed behind the scenes.
- **LocalStorage-only state** (resets per device/browser, never synced server-side): read announcements, recently viewed resources/papers, practice history, remembered login codes, APS goal.
- **Known inert UI**: the Calendar's "Connect Google Calendar" button and "Sync Calendar" card have no wired functionality — decorative placeholders only.
