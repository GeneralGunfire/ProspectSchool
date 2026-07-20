-- ─────────────────────────────────────────────────────────────────────────────
-- Hand-run in Supabase Studio SQL editor. NOT a tracked migration.
-- ─────────────────────────────────────────────────────────────────────────────
-- Run this BEFORE 2026-07-20_peer_tutoring_fixes.sql (or before retrying its
-- CREATE UNIQUE INDEX statement if you already hit the 23505 error).
--
-- Confirmed live duplicate from Bug 1: (tutor_student_id=4, tutee_student_id=3,
-- topic_id=30) has 3 'pending_approval' rows (ids 1, 2, 3), 24s and then ~4min
-- apart — matches the reported "submitted the form three times" repro exactly.
-- Verified read-only: relationship ids 2 and 3 have zero peer_tutoring_sessions
-- rows attached, so cancelling them loses no session/attendance data. Keeping
-- id 1 (the earliest) as the surviving row.
--
-- This is a general-purpose cleanup, not hardcoded to just that one pairing —
-- it finds and resolves ANY (tutor, tutee, topic) pairing with more than one
-- open row, keeping the oldest and marking the rest 'declined', so the unique
-- index in 2026-07-20_peer_tutoring_fixes.sql can be created successfully
-- regardless of how many duplicate groups exist.
-- ─────────────────────────────────────────────────────────────────────────────

-- Preview first — run this SELECT alone and check the output before running
-- the UPDATE below, especially if any duplicate group has sessions attached
-- (this script does not check that for you across all groups, only the one
-- confirmed above — inspect before trusting it blindly for other groups).
SELECT id, tutor_student_id, tutee_student_id, topic_id, status, created_at,
       ROW_NUMBER() OVER (
         PARTITION BY tutor_student_id, tutee_student_id, topic_id
         ORDER BY created_at ASC
       ) AS rn
FROM public.peer_tutoring_relationships
WHERE status IN ('active', 'pending_approval')
ORDER BY tutor_student_id, tutee_student_id, topic_id, created_at;

-- The actual cleanup: for every (tutor, tutee, topic) group with more than
-- one open row, keep the earliest (rn = 1) and decline the rest.
WITH ranked AS (
  SELECT id,
         ROW_NUMBER() OVER (
           PARTITION BY tutor_student_id, tutee_student_id, topic_id
           ORDER BY created_at ASC
         ) AS rn
  FROM public.peer_tutoring_relationships
  WHERE status IN ('active', 'pending_approval')
)
UPDATE public.peer_tutoring_relationships
SET status = 'declined'
WHERE id IN (SELECT id FROM ranked WHERE rn > 1);

-- Verify no duplicates remain (should return 0 rows):
SELECT tutor_student_id, tutee_student_id, topic_id, COUNT(*)
FROM public.peer_tutoring_relationships
WHERE status IN ('active', 'pending_approval')
GROUP BY tutor_student_id, tutee_student_id, topic_id
HAVING COUNT(*) > 1;

-- Once the above returns 0 rows, go back and run (or re-run) the
-- CREATE UNIQUE INDEX statement from 2026-07-20_peer_tutoring_fixes.sql.
