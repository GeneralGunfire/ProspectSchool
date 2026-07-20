-- ─────────────────────────────────────────────────────────────────────────────
-- Hand-run in Supabase Studio SQL editor. NOT a tracked migration.
-- ─────────────────────────────────────────────────────────────────────────────
-- Two independent things in this file — run whichever you need.
--
-- PART A: unstick the one orphaned relationship (id 1) left over from before
-- teacher-approval was removed from the peer tutoring UI. It's stuck at
-- 'pending_approval' with no in-app way to approve/decline it anymore.
-- Safe to run even after Part B (it's a no-op if the row's already gone).
--
-- PART B: full reset — wipes ALL peer tutoring test data (requests,
-- relationships, sessions, outcomes, badges, concerns, tutor profiles/topics,
-- prior-pairs) so you can test the feature again from a clean slate. Does NOT
-- touch students/teachers/subjects/topics/student_attempts — only the peer
-- tutoring feature's own tables.
-- ─────────────────────────────────────────────────────────────────────────────

-- ═══ PART A: fix the one stuck relationship (run this if you just want the
-- immediate bug gone, without wiping everything else) ═══════════════════════

UPDATE public.peer_tutoring_relationships
SET status = 'declined'
WHERE id = 1 AND status = 'pending_approval';

-- Also releases request #2, which is still marked 'matched' against it, back
-- to 'open' so the tutee can be matched again cleanly.
UPDATE public.peer_tutoring_requests
SET status = 'cancelled'
WHERE id = 2 AND status = 'matched';

-- ═══ PART B: full reset — wipes all peer tutoring data ═════════════════════
-- Uncomment and run if you want to clear everything and start over.

-- DELETE FROM public.peer_tutoring_concerns;
-- DELETE FROM public.peer_tutoring_prior_pairs;
-- DELETE FROM public.peer_tutor_badges;
-- DELETE FROM public.peer_tutoring_outcomes;
-- DELETE FROM public.peer_tutoring_sessions;
-- DELETE FROM public.peer_tutoring_relationships;
-- DELETE FROM public.peer_tutoring_requests;
-- DELETE FROM public.peer_tutor_topics;
-- DELETE FROM public.peer_tutor_profiles;
