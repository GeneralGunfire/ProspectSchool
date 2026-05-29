# Prospect School Platform — Feature Reference

Last updated: 2026-05-29

---

## Accounts & Auth

All auth is custom (no Supabase Auth). Login requires School Code + User Code + 10-digit PIN. PINs are SHA-256 hashed and compared server-side via the service role client. Sessions are stored in `localStorage`.

| Role | Login page | Session key |
|---|---|---|
| Teacher | `/teacher-login` | `prospect_teacher_session` |
| Student | `/student-login` | `prospect_student_session` |
| Admin | `/admin-login` | `prospect_admin_session` |

---

## Admin Portal

### Teachers
- View all teachers at the school in a table
- Add teacher — name, surname, teacher code, 10-digit PIN, role (Teacher or School Admin)
- Edit teacher — update name, surname, PIN (leave blank to keep current)
- Activate / deactivate teacher account (toggle) — deactivated teachers cannot log in

---

## Teacher Portal

### Home
- Welcome screen showing teacher's name

### Classes
- View all students linked to this teacher, grouped and searchable
- Add student — name, surname, student code, 10-digit PIN, class (cohort), grade (8–12), subjects
  - Cohort is created automatically if it doesn't exist yet
  - Student is linked to the teacher via `teacher_students` junction rows (one per subject)
- Edit student — update name, surname, grade, class, PIN, subjects
- Remove student — removes teacher's subject links; deletes the student record entirely if no other teacher is linked

### Calendar
- Monthly calendar grid with animated month navigation
- Create event — title, type (Homework / Assessment / Exam / Other), date, optional start/end time, optional file attachment, audience targeting
- Edit event — all fields editable, attachment replaceable or removable
- Delete event — with confirmation modal
- Click a day to open a side panel showing all events for that day
- Click an event in the panel to expand full detail + attachment download
- **Homework Tracker** (homework events only) — second tab inside the event detail modal:
  - Shows every student targeted by the event
  - Per student: self-reported status (student tapped "done") + teacher verification status
  - Summary pills: total students, self-reported count, verified count, not-done count, unreviewed count
  - Teacher can add a note/reason per student (absent, excuse, etc.)
  - **Verify Done** — confirms the student completed the homework in person
  - **Not Done** — marks as not completed (with optional reason)
  - Clear button resets a verification back to unreviewed
  - Verification persists to `homework_completions.verified_by_teacher` + `teacher_note`
- **Audience targeting** (applies to all event types):
  - Everyone in the school
  - By Grade — select one or more grades
  - By Class — select one or more cohorts
  - By Subject + Grade — select subjects and grades (both required)
  - Specific Students — pick individual students by name

### Marks
- Mark sheets grouped by subject, then listed per sheet
- Create mark sheet — title, subject, grade, scope (class / year), total marks
  - Creating a sheet also auto-creates a Calendar event of type "Assessment" on today's date
- Open a sheet to enter marks per student inline — marks auto-save on blur
- Delete mark sheet — with confirmation
- Per-student mark shown as raw score, percentage, and SA curriculum grade label (Not Achieved → Outstanding)

### Resources
- View all resources uploaded by this teacher, grouped by type (Files / Links / Notes)
- Add resource — title, optional description, optional subject tag, audience targeting
  - **File** — upload PDF, Word, PowerPoint, image, or MP4 (max 50 MB); stored in private `resources` bucket; downloaded via signed URL
  - **Link** — paste any URL; opens in new tab
  - **Note** — write freeform text; displayed inline
- Delete resource — with confirmation; file is also removed from storage
- **Audience targeting** (same options as Calendar, subject targeting also requires grade selection)

### Library (Student Progress)
- View all students linked to this teacher
- Click a student to see their study progress per subject
- Per topic: mastery level (Not Started / Needs Practice / Mastered), last activity timestamp
- Topics grouped by subject

---

## Student Portal

### Home
- Welcome screen showing student's name and school

### Calendar
- Monthly calendar grid with animated month navigation
- **View toggle** — switch between Grid view and List view
- **Grid view:**
  - Days show event chips (colour-coded by type)
  - Click a day to open a side panel with all events for that day
  - Click an event to expand detail + attachment download
  - Homework events show a ○ / ✓ toggle in the side panel
  - "Coming Up" panel (when no day selected) shows next 5 upcoming events with homework toggles
- **List view:**
  - All events for the month as cards, sorted by date
  - Each card shows date, type badge, title, time, description, attachment download link
  - Homework cards have a ○ / ✓ "Mark as done" toggle
- **Homework completion:**
  - Tap the circle icon to mark homework done — title gets strikethrough, card fades
  - Tap again to unmark
  - State persists to `homework_completions` table; loads on page mount
- Only sees events targeted at their grade, class, subjects, or specifically at them

### My Marks
- All mark sheets the teacher has published for this student
- Grouped by subject
- Each entry shows: assessment title, mark out of total, percentage, SA grade label
- Overall average shown at the top across all marked results

### Resources
- Browseable list of all resources targeted at this student (by grade, class, subject, or specific)
- **Search bar** — filters by title, description, subject label, or note content
- **Type filter pills** — All / Files / Links / Notes
- File — opens signed download URL in new tab
- Link — opens URL in new tab
- Note — "Read" button expands/collapses the note content inline
- Each card shows: type badge, subject tag (if any), description, upload date

### Library
- Interactive study content per subject and topic (Grade 10, Term 1 currently)
- Full-screen immersive view (sidebar hidden while in a learning page)
- Back button returns to library hub
- Topics available:
  - **Algebra** — Linear Equations, Simultaneous Equations
  - **Physical Sciences** — Waves Sound & Light, Atoms & Subatomic Particles, Classification of Matter, Periodic Table Trends, Chemical Bonding
  - **Life Sciences** — Biodiversity & Classification, Five Kingdoms, Taxonomy & Binomial Nomenclature, Species Concept
  - **Accounting** — Introduction to Accounting, Accounting Equation, Double Entry System, Source Documents, Journals, General Ledger
  - **Business Studies** — Business Environment, Business Sectors, Stakeholders, Operations
  - **Economics** — Economic Problem, Production Possibility Curve, Economic Systems, Circular Flow Model, Factors of Production
  - **CAT** — Computer Systems, File Management, Word Processing, Spreadsheets
  - **EGD** — Drawing Instruments
- Study progress (mastery level per topic) tracked and viewable by the linked teacher
