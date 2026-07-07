# Prospect — Teacher Portal Feature Breakdown

Full page-by-page audit of the teacher account: layout, copy, and mechanics (what's fetched, what's computed, what happens on interaction). Generated 2026-07-08.

---

## Auth entry point (`src/pages/auth/TeacherLogin.tsx`)

Split-free card layout, gradient background. Top nav: Prospect logo (→ home), "← Portal" link.

Copy: eyebrow "For Teachers", heading "Welcome back.", subtext "Enter the codes provided by your school administrator."

Fields: **School Code** (placeholder "e.g. GHS001", uppercased), **Teacher Code** (placeholder "e.g. TCH-001", uppercased), **PIN** (numeric only, max 10 digits, show/hide toggle, helper "Assigned by your school administrator"). "Remember school & teacher code" checkbox persists `{schoolCode, teacherCode}` (never PIN) to `localStorage` (`prospect_teacher_remember`), pre-filling on return visits.

Submit: "Sign In" (→ "Signing in…" while loading). On failure: red alert box with the returned error string. On success: writes/clears the remember-me entry, navigates to `teacher-dashboard`. Footer: "© {year} Prospect South Africa".

---

## Dashboard Shell (`src/pages/portal/TeacherDashboard.tsx`)

Confirmed sidebar nav order:

| Icon | Label | id |
|---|---|---|
| Home | Home | `home` |
| Megaphone | Announcements | `announcements` |
| Users | Classes | `classes` |
| CalendarDays | Calendar | `calendar` |
| ClipboardList | Marks | `marks` |
| FolderOpen | Resources | `resources` |
| FileText | Past Papers | `past-papers` |
| BookOpen | Progress | `library` |
| ClipboardCheck | Topic Tests | `topic-tests` |
| AlertTriangle | At-Risk | `risk` |

- On mount: `getTeacherSession()`; redirects to `teacher-login` if none.
- No routing library — `activePage` state drives conditional render.
- Desktop: fixed 224px sidebar, logo + `NotificationBell`, nav list, profile chip + red "Sign Out" (calls `teacherLogout()` → `portal`).
- Mobile: hamburger → animated slide-in drawer mirroring desktop nav, closes on backdrop click or `X`.
- Avatar initials: `session.name[0] + session.surname[0]`, uppercased.

---

## Home (`TeacherHomePage.tsx`)

**Fetched on mount** (blocking): `fetchTeacherStudents`, `fetchSchoolEvents`, `fetchTeacherMarkSheets`. Then non-blocking: `fetchTeacherImpactSummary`, `fetchTeacherClassHealth`, `fetchTeacherInterventionROI`, and **`syncTeacherActions`** (`lib/actionCenter`) — wraps `fetchAtRiskStudents`/`fetchStaleInterventions`/`fetchAssessmentGaps` and persists/dedupes them into a `teacher_actions` table so dismissed cards don't resurface while the underlying condition still holds.

**Sections, in order:**

1. **Header** — eyebrow "Overview", "Welcome back, {name}." (name in accent italic), subtext = school name.
2. **4 stat cards**: Next Event (dark, or "No upcoming events"), My Students (count, "View Classes →"), Mark Sheets (count, "Enter Marks →"), Upcoming Events (count, "View Calendar →").
3. **Needs Attention card** (unaddressed at-risk students) — "Needs Attention" / "Recommended interventions — click Assign to activate", count badge. Rows colored by reason (below_pass=red, declining=amber, else orange): name, detail, dismiss (X), and either **Assign** button (only for `below_pass`) or "View →" (other reasons). After clicking Assign, shows the recommended type + rationale, then a green confirmation once created. Capped at 6 + "View all" footer.
4. **Interventions Requiring Follow-Up card** (stale interventions) — blue rows (`awaiting_outcome`: "completed — record outcome") or amber (stale active: "active {n}d — check in"), dismiss + "Outcome →"/"View →" link.
5. **No Recent Assessments card** (assessment-gap detector) — "Subjects with no mark sheet in the last 30 days", rows: subject+grade, "Last assessed {n}d ago · {count} sheet(s) total", dismiss, "Add Sheet →".
6. **Academic Impact card** — Completed / Success % / Avg Gain tiles; amber "Most effective: {type} — {rate}% success rate" callout if applicable; footer "{n} intervention(s) currently active".
7. **What Works Best card** (Intervention ROI, ≥2 rows) — ranked list of intervention types with a progress bar (`avgGain/15*100%`, capped), success%/avgGain%, `n=` sample size.
8. **Class Health card** — per subject+grade: at-risk count badge, class-average bar (color-coded), average %, recent-change delta.
9. **Homework Completion card** (events in last 14 days) — per event: `{completed}/{total} · {pct}%`, bar colored by threshold (≥80 green/≥50 amber/else red).
10. **Quick Actions card** — 2×2: Add Student, Post Announcement, Create Event, Enter Marks.
11. **Upcoming Events card** — simple dot/title/date/type-pill list.

**Recommendation & assign mechanics**: for each `below_pass` student, builds an eligible-type list from their own average (`<50` → library_topic/revision/resource_review; else → revision/past_paper), calls `fetchBestInterventionType(school_id, subject, eligible)` (checks school-wide historical outcome data), falls back to the first eligible type with a generic rationale if no history. Clicking **Assign** looks up the student's `subject_id`, then calls `createIntervention(...)` — idempotent, silently no-ops on duplicate.

---

## Announcements (`AnnouncementsPage.tsx`)

1. Toast (top-center) on post/delete.
2. Header "Announcements" + "Post Announcement" button.
3. List split into **Pinned** (📌) and **Recent** sections.
4. Empty state: "No announcements yet."
5. **Create modal**: Title*, Message (optional), **AudienceSelector**, Pin toggle ("Pinned — stays at top" / "Pin this announcement"), Cancel/Post.
6. **Delete confirm modal**: "Delete announcement?" / `"{title}" will be permanently removed.`

**AudienceSelector** (shared with Calendar & Resources): 5 pills — Everyone, By Grade, By Class, By Subject + Grade, Specific Students — each reveals its own sub-picker (grade chips, class chips from `cohorts`, subject+grade combo, or a scrollable checkbox student list).

**Card mechanics**: title, body (line-clamp-2 + Show more/less), author name (+"(Admin)" tag), relative time, audience summary chip, an engagement badge (`{readRate}% read · n={targetSize}`, + "· {n} unread"), an impact badge (`+{delta}% hw lift · n={viewedCount}`, only if delta>5) — both from `fetchAnnouncementEngagement`/`fetchAnnouncementImpact`. Pin/unpin and delete buttons per card.

**Validation**: title required; grade/cohort/subject+grade/students required depending on chosen target type.

---

## Classes (`ClassesPage.tsx`)

1. Header "Classes" + "Assign Student" + "Add Student" buttons.
2. **Class switcher pill row** — "All Classes" + per-cohort pills with headcounts.
3. **Search + filter bar** — text search, grade select, "Clear" (if active), result count, **"Group"** toggle (switches to tier view).
4. **Flat table view** — Student, Code, Class, Subjects (chips), **Last Contact** (green ≤7d/amber ≤30d/red >30d/"No contact", clickable → contact modal), edit/delete icons.
5. **Tier-grouped view** (`TierGroupView`) — 4 fixed sections: **High Risk** (<40% — urgent intervention needed), **Medium Risk** (40–55% — monitor and support), **On Track** (55–75% — performing adequately), **Flourishing** (>75% — excelling); each shows colored dot, description, count badge; rows show name/code/cohort/grade/avg%/subjects (max 3 +"+n")/edit/delete. Footer: "Tiers based on overall mark average across all subjects." No-mark-data students default to `on_track`.
6. **Add/Edit Student modal** — Name, Surname, Student Code (readonly on edit), PIN (required on add, optional on edit), Class, Grade, subject multi-select chips.
7. **Assign Student modal** (2-step) — Step "code": enter existing student code, "Find Student" (`lookupStudentByCode`). Step "confirm": shows found student, subject chips, "Assign Student" (`assignStudentToTeacher`). "Back" returns to step 1.
8. **Parent Contact Log modal** — method chips, note textarea, "Log Contact"; history list with delete per entry.
9. **Remove student confirm modal** — warns full account deletion if no other teacher teaches them.

**Mechanics**: on mount, `fetchSubjects` + `fetchTeacherStudents` (blocking), then non-blocking `fetchStudentTiers` + `fetchLastContactDates`. Filtering via `useMemo` across grade/cohort/search. Add: `createStudent` (requires ≥1 subject, else "Please select at least one subject."). Edit: `updateStudent`. Delete: `removeStudentFromTeacher`. Assign existing: `lookupStudentByCode` → `assignStudentToTeacher`. Contacts: `logParentContact`/`deleteParentContact`.

---

## Calendar (`CalendarPage.tsx`)

1. Header "School Events" + "Create Event" + month nav (animated) + Grid/List toggle.
2. **Grid view** — month calendar, up to 3 event pills/day colored by type (blue=homework, emerald=assessment, red=exam, gray=other), "+{n} more" overflow. Empty-cell click → prefilled create modal; event click → view modal.
3. **List view** — flat chronological list, colored dot/title/type pill/date/audience.
4. **Right sidebar** (desktop) — "Upcoming" (next 5 + Create shortcut), Legend card.
5. **View modal** — type pill + title; homework events get a 2-tab bar: **Details** / **Homework Tracker**.
   - Details: date, time range, audience, description, attachment download link.
   - **Homework Tracker**: summary pills (total/self-reported/verified/not-done/absent/unreviewed), per-student cards (amber=absent, emerald=verified done, red=not done, stone=unreviewed) with avatar, status text, self-report badge, editable note (while unreviewed) or saved note (italic, once reviewed), action buttons **Verify Done** / **Not Done** / **Absent** / **Undo** (once reviewed).
   - Footer: Edit, Delete (with inline confirm: "Delete this event? This cannot be undone.").
6. **Create/Edit modal** — Type chips, Title, Date ("Due Date" for homework), Start/End Time (hidden for homework), Description, Attachment (homework only, PDF/Word/image), AudienceSelector.

**Mechanics**: reference data loaded once; events refetched (`fetchMonthEvents`) on year/month change. Tracker actions persist immediately and refetch: `saveHomeworkVerification`, `saveHomeworkAbsent`, and a direct clear-verification update. Create/edit validate title/date/audience; `createEvent`/`updateEvent` handle attachment upload/clear. Delete via `deleteEvent` (removes attachment too). Attachment download via signed URL.

---

## Marks (`MarksPage.tsx`)

Two views: `groups`, `sheet`.

### Groups view
Header "Mark Sheets" + "New Sheet". Empty: "No mark sheets yet." / "Create your first sheet to get started." Collapsible group cards per subject+grade — per-term weight status pills (`"Term {n}: Final mark ready"` emerald once weights sum to 100%, else `"Term {n}: {weightTotal}% weight used"`). Sheet rows: title, `"Term {t} · {scope} · Out of {total}"` + weight or "record only", + "📅 On calendar" if pushed. Edit/delete icons.

### Sheet view
Back button, subject/grade/title. **"Add to Calendar"** button pushes an `assessment` event (becomes disabled green "On Calendar" once pushed). **Assessment Analytics card** (once ≥1 mark entered) — `"{marked}/{total} marked"` + amber "unmarked" note, 4 tiles (Class Avg, Pass Rate, Highest, Lowest, all color-coded), pass-rate bar, "{n} student(s) below pass mark" line — via `computeSheetAnalytics()`.

**Risk banner + campaign** (only if `atRiskMarks.length > 0`, not dismissed, `markedCount >= 3`) — red banner listing up to 3 at-risk surnames, dismiss X, and the **bulk campaign button** below a divider.

Per-student row: avatar, name, code, achievement-level label once marked (CAPS bands), numeric mark input (live % readout), optional note, **Save** button (spinner → green "Saved" for 1.8s). Inline 0–total validation.

### Create Mark Sheet modal
Title*, Subject*, Grade* (chips 8–12), Scope (optional), Total marks* (>0), Term* (chips 1–4), Weight (0–100%, footnote about term completion). On success: auto-expands the new group and opens the sheet immediately.

### Delete confirm modal
"Delete mark sheet?" / "`{title}` and all student marks will be permanently deleted."

### Mechanics
`openSheet` fetches `fetchSheetMarks`, seeds draft state, resets risk-banner/campaign state. `handleSaveMark` validates range then `saveStudentMark(...)`, updates local state in place (no refetch), transient "Saved" indicator.

### Bulk campaign — "Assign intervention to all N" (`handleCampaign`)
1. **Trigger**: risk banner button, shown only when ≥1 student is below 50% on the open sheet, ≥3 marks entered, banner not dismissed.
2. **State machine**: `idle → running → done` (spinner "Assigning…" → green "{n} intervention(s) assigned — visible on each student's home").
3. **Selection**: every student `<50%` on *this specific sheet* (independent from the banner's own truncated display list).
4. **Shared type selection**: calls `fetchBestInterventionType(school_id, subject, ['library_topic','revision','resource_review'])` **once** for the whole subject — every student in the campaign gets the *same* recommended type and rationale (or a generic fallback if no history).
5. **Per-student loop**: looks up each student's `subject_id` (falls back to the sheet's own), computes `avg`, calls `createIntervention(...)` with reason `avg < 40 ? 'below_pass' : 'high_risk'` — note this 40% threshold differs from the banner's own <50% cutoff. Idempotent — duplicates silently swallowed.
6. **Description/page maps**: library_topic → "Study {subject} in the library" (page `library`); revision → "Revise {subject} core concepts" (page `library`); resource_review → "Review {subject} resources" (page `resources`); past_paper → "Complete a {subject} past paper" (page `pastpapers`).

This differs from Home's individual "Assign" button, which computes a per-student eligible-type list (one student at a time) rather than one shared type across the whole cohort.

---

## Resources (`ResourcesPage.tsx`)

Header "Class Resources" + "Add Resource". Category filter pills (All Tags/Homework/Notes/General). Content grouped by type (file/link/note) with colored dot headers ("Files"/"Links"/"Notes"). Cards: type icon, title, category badge, subject tag, description, type-specific preview (note=amber inline box, link=violet URL, file=gray filename), created date, an engagement badge (`"{n} viewer(s)"`, tiered ≥20/≥5) and an effectiveness badge (`"{±n}% avg gain · n={downloaders}"`, green/red) — from `teacherAnalytics.ts`. Actions: open/download, delete.

Empty state: "No resources yet." / "Add files, links or notes for your students."

**Create modal**: Type chips (File/Link/Note), Tag chips, Title*, Description, Subject (optional), type-specific input, AudienceSelector.

**Mechanics**: `reload()` fetches resources then non-blockingly `fetchResourceEngagement` + `fetchResourceEffectiveness`. Create validates title + type-specific field + audience. `handleOpen`: links open directly (https:// prefixed if missing); files fetch a signed URL via `getResourceDownloadUrl`. Delete removes DB row + file.

---

## Past Papers (`PastPapersPage.tsx`)

Header "Past Papers" + "Upload Paper". Grouped by subject. Cards: file icon (emerald dot if memo exists), title, badges (Grade/Year/Term/Paper#), green "Memo" badge if attached, raw filename. Actions: open question paper, **Memo** button (emerald, opens marking guide), delete.

Empty state: "No past papers yet." / "Upload papers — students can browse and download them."

**Upload modal**: Title*, Subject*+Grade* (selects), Year* (last 10 years), Term (optional, "Any" default), Paper # (1–3), File* (PDF/PNG/JPEG), Memorandum (optional, separate upload, emerald styling once attached).

**Delete confirm modal** — warns the memo is deleted too.

**Mechanics**: `createPastPaper` uploads both files (memo optional). Open/Memo both call `getPastPaperDownloadUrl` (separate per-row loading state). Delete removes both files.

---

## Progress (`StudentProgressPage.tsx`, internal id `library`)

Two views: `list`, `profile`.

### List view
Header "Students" / "Click any student to view their full profile." 3 summary tiles: Total Students, Topics Mastered (sum), Need Support (count with `topics_struggling > 0`). Class switcher pill row. Search + 4 sort pills: Name, Mastered ↓, Struggling ↓, Last Active. Rows: avatar, name/code, grade/cohort, mastered count (green), struggling count (amber or "—"), last-active, intervention chips ("{n} active" amber, success-rate% tiered, "+{n}%" green) — from `fetchStudentInterventionChips`.

### Profile view
**Hero card** (dark) — avatar, name, grade/cohort/code, 4 stat chips (Started/Mastered/Needs Practice/Last Active). **"vs Class Average" comparison strip** (once Marks tab visited) — per subject: student avg vs class avg + colored delta.

**Tab bar** (6, lazy-loaded on first visit): **Progress**, **Marks**, **Homework**, **Announcements**, **Coaching**, **Contacts**.
- Progress: grouped by subject, topic rows with status dot (mastered/needs_practice/not_started) + last attempt score.
- Marks: grouped by subject, mark/total + achievement-level badge.
- Homework: **Pending** (due date, amber badge) / **Completed** (event date, emerald badge).
- Announcements: card list, pin icon, 3-line preview, relative time.
- **Coaching**: Intervention Impact summary (Completed/Success%/AvgGain/Active tiles, "Most effective" callout); **Active** section (red for exam_soon/below_pass, amber otherwise: type, subject, reason badge, status, dates, subject avg, italic rationale); **Completed** section (✓/↓/→ glyph, improvement % if outcome exists, outcome detail box, or **"Record Outcome →"** link opening `RecordOutcomeModal`).
- Contacts: log form + history with delete — same as Classes page's contact modal but inline.

**Mechanics**: list uses `fetchTeacherStudentProgress` (primary) + non-blocking `fetchStudentInterventionChips`/`fetchTeacherClassHealth`/`fetchLastContactDates`. Profile tabs fetch lazily and cache (no refetch on tab-switch after first load). `getSubjectIds` cached per student for reuse across Homework/Announcements tabs.

---

## Record Outcome modal (`RecordOutcomeModal.tsx`)

Invoked from the Coaching tab's "Record Outcome →" link. Header "Record Outcome" / "{studentLabel} · {subject}". On open, fetches matching marks for the subject (`matchesSubject` — exact `subject_id` or fuzzy first-word label match), auto-fills **New Avg** and **Latest Assessment Mark**; if no matching marks: "No recent marks for {subject} — enter values manually."

Live preview recomputes on every keystroke via `computeResult(previousAvg, newAvg, latestMark)` — thresholds: `improvement>=3 OR latestMark>=70` → **Improved** (emerald); `improvement>0` → **Unchanged** (gray); else → **Declined** (red). Identical logic to the automatic outcome-sync path, so manual and automatic outcomes compute the same way.

Submit calls `recordOutcome(...)`, then fire-and-forget `resolveActionsForIntervention(interventionId)` (clears related action-center follow-up cards), then `onRecorded(outcome)`.

---

## At-Risk (`RiskEnginePage.tsx`) — built 2026-07-08

Header "At-Risk Students" / "Live risk scoring from marks, trends and exam proximity. Expand a student to see exactly why they're flagged." **"How does this work?"** toggle expands an explainer panel.

**Explainer panel ("The Pipeline")** — 4-step visual flow: Marks & Events → Risk Rules → Interventions → Outcomes, plus prose covering: exact risk-badge thresholds (below 50%=below pass, below 65%=needs improvement, >5% drop over last 3 assessments=declining, 20%+ swings=inconsistent, exam ≤14 days while weak=separate reason; 3+ reasons or sub-50%+exam≤2wks=**High**; 2 reasons or sub-60%+exam≤3wks=**Medium**; else 1 reason=**Low**); "Why Flagged" vs "Revision Priority" distinction; how Interventions auto-generate from risk data (not manually assigned) and what Re-sync does; what the ✨ evidence text means (school-wide historical outcome data, falls back to a default with no evidence line if none exists); how completed-task % change is computed.

**Risk summary tiles** (4, clickable filters): High Risk / Medium Risk / Low Risk / On Track counts. Search bar.

**Student rows** (sorted worst-risk-first, then surname) — collapsible, header shows avatar, name, grade/cohort/code, risk badge (colored dot + label + subject-risk-count, or spinner while loading). Expanding lazy-loads interventions/outcomes and reveals:
- **Why Flagged** — per flagged subject: risk-colored card, avg%, bulleted reason strings, exam-days line if applicable. Green "No subjects currently flagged — on track." if none.
- **Revision Priority** — subject/reason/urgency badge rows.
- **Interventions** — header includes **"Re-sync Interventions"** button + "Last synced {date}" if applicable. Active (red for exam_soon/below_pass, amber otherwise): type, subject, reason badge, italic rationale (✨), status + created date. Completed: same + outcome % delta, colored border by result, "Completed {date} · {prev}% → {new}%". Empty: "No interventions yet. Use Re-sync to auto-create coaching tasks from the risk data above."

**Mechanics**: fetches roster + school events, then per-student (sequential) computes `computeStudentInsights(...)`, populating rows incrementally as each finishes. Expand lazy-loads `getInterventions`/`getOutcomes` (cached after first load). `handleSync` re-runs `syncInterventionsFromRisk` for one student, refetches, stamps `lastSynced`.

---

## Topic Tests (`TopicTestsPage.tsx`) — built 2026-07-08

Three views: `list`, `overview`, `marking`.

### List view
Header "Topic Tests" / "Short, timed tests that pinpoint exactly what a student is struggling with — invisible to students until you assign them." Two buttons: **"Build Custom Test"** (outlined) and **"Assign Test"** (primary). Tests grouped by subject+grade. **TestCard**: dark icon badge, title, blue "Teacher-marked" badge if `grading_mode === 'manual'`, "Term {t} · Topic: {topic_key}", "{n} min timer" pill. Actions: delete, **Assign** (Send icon). Divider + full-width **"View topic overview & results"** button.

Empty state: "No topic tests yet" / "Create your first test to start diagnosing exactly where students struggle." / "Assign Test →".

**Delete confirm modal** — warns it deletes the test, questions, assignments, and all student results.

### CreateTestModal ("Assign Test") — catalog-seeded
Subtitle: "Pick a ready-made CAPS topic test — questions are already set and auto-graded." Fields: Subject/Grade/Term, **Topic** select (from `getCatalogTopics`, filtered to topics with questions; shows "{i}. {label} ({n} questions)"), Time Limit (1–60 min, default 10). Submit ("Create & Assign") → `seedCatalogTest(...)`, then immediately opens Assign modal.

**`seedCatalogTest` mechanics**: rejects if the catalog topic has zero questions; calls `createTopicTest()` with the topic's fixed subskill list and forces `grading_mode: 'auto'` (catalog tests are never teacher-marked); resolves each `CatalogQuestion` to its subskill_id and calls `addTopicTestQuestion()` per question. `TOPIC_CATALOG` currently seeded only for `math-10-1`, with 5 topics (Algebraic Expressions, Exponents, Number Patterns, Equations and Inequalities, Trigonometry), each with 4–5 subskills and 8–10 ready MCQ/short-answer questions (exact answers, numeric tolerance where relevant).

### CustomTestModal ("Build Custom Test") — teacher-authored
Subtitle: "Full control — set your own title, sub-skills, and question types." Fields: Test Title*, Topic Key (optional, falls back to title), Subject*/Grade/Term, **Grading toggle** — Auto-graded (MCQ/short answer) vs Teacher-marked (open text), Time Limit, dynamic **Sub-skills** list (free-text tags — "fixed diagnostic tags — each question maps to one"). Submit ("Create & Add Questions") → `createTopicTest()` with zero questions, routes straight to Topic Overview to add questions.

### AssignModal
Test title, "Closes in" select (1/3/7/14 days or none), amber warning: "This test stays invisible to students until you assign it. Once assigned, all students you teach for this subject/grade see it immediately." Calls `assignTopicTest(...)` — inserts a `topic_test_assignments` row. Success: green check, "Assigned" / "Students in this subject/grade will now see the test in their portal."

### Topic Overview (`TopicOverview`)
Back link. Header "{title} — Topic Overview" / "{attempted} of {totalAssigned} students completed · avg {avgScore}%" (or "Not yet assigned to a class"). Blue **"Mark {n} response(s)"** button if any pending.

**Class-wide sub-skill breakdown** — one row per subskill, **sorted lowest-correct-% first**, "{pct}% correct" badge (tiered emerald≥70/amber≥50/red<50, or "No data"), progress bar. Footer: "Sorted lowest-first — the sub-skills most students are struggling with float to the top."

**Individual results** — per student: name, "Struggling: {list}" (or "None — strong across the board"), score % badge.

**Questions card** — numbered list with prompt + subskill tag, delete per question, "Add question" button. Empty: "No questions yet — add at least one before assigning this test."

**`fetchTopicOverview` mechanics**: tallies correct/total per subskill across all attempts+answers → `correctPct`. Per-student `weakestSubskills` = de-duplicated subskill labels where that student answered incorrectly. `avgScore` = mean of attempts' `score_pct`. `totalAssigned` = distinct students in `teacher_students` for this teacher+subject whose grade matches the test's grade (the theoretical eligible pool, independent of actual assignment rows).

### AddQuestionModal
Sub-skill select; Question Type toggle (MCQ / Short Answer — hidden entirely for manual tests, which are always open_text); Prompt textarea; type-specific fields (MCQ: 4 options + correct-option select; Short Answer: correct answer + optional numeric tolerance; Open Text: info box — "Students answer in free text. There's no auto-grading — you'll mark each response correct or incorrect after they submit."). `sort_order` auto-computed as current question count.

### Marking screen (`MarkingScreen`) — for manual (open_text) tests
Back link. Header "Mark Responses" / "{n} student(s) awaiting marks" or "Nothing left to mark." Empty (all marked): "All caught up" / "Every submitted response has been marked." One card per pending student, one block per open-text answer: subskill tag, prompt, raw answer text (italic "No answer given" if blank), and either a "Marked correct"/"Marked incorrect" badge or **Correct**/**Incorrect** buttons.

**Mechanics**: `handleMark` → `markAnswer` (sets `is_correct` + `graded_at`) → `finalizeAttemptGrading` (recomputes overall `score_pct` from ALL answers, sets `grading_complete = true` only once every answer has `graded_at` — so mixed auto+manual attempts aren't "done" until manual ones are marked too). Pending-marking list refetches after each mark, so fully-marked students disappear automatically.

**`fetchPendingMarking`**: queries attempts with `grading_complete = false` and `submitted_at IS NOT NULL`, filters each attempt's answers down to `open_text` only — attempts with zero open-text answers never appear here.

### Auto-grading (`gradeAnswer`, underlies "auto-graded" tests)
- `open_text` → always `null` (never auto-gradable).
- `mcq` → exact string match.
- `short_answer` → numeric tolerance compare if set, else case-insensitive trimmed string match.
- Provisional `score_pct` on submit only counts questions with non-null `graded_at`; `grading_complete` is true only when zero ungraded answers remain.

---

## Cross-cutting notes

- **Bulk vs individual intervention assignment**: Home's per-student "Assign" button computes intervention type per-student (varies by that student's own average); the Marks page's campaign computes ONE shared type for the entire cohort on a sheet. Both call the same idempotent `createIntervention`.
- **Action Center dedup** (`lib/actionCenter.ts`, via `syncTeacherActions`) persists at-risk/stale-intervention/assessment-gap flags into a `teacher_actions` table specifically so dismissing a card on Home doesn't just hide it client-side — it stays dismissed until the underlying condition changes.
- **RecordOutcomeModal and the automatic outcome-sync path share the exact same result-classification thresholds** (`improvement>=3 OR latestMark>=70` → Improved), so a manually recorded outcome and an auto-synced one are computed identically.
- **Topic Tests catalog is currently narrow**: only `math-10-1` has pre-built content (5 topics). Any other subject/grade/term combination shows "No predefined tests available yet" in the Assign Test flow — Build Custom Test is the only path for anything outside Grade 10 Term 1 Mathematics right now.
