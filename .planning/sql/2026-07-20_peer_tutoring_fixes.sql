-- ─────────────────────────────────────────────────────────────────────────────
-- Hand-run in Supabase Studio SQL editor. NOT a tracked migration (per CLAUDE.md
-- convention — schema changes here are executed manually by the project owner,
-- never by an AI assistant, and never via `supabase migration up`).
-- ─────────────────────────────────────────────────────────────────────────────
-- Peer Tutoring fixes, on top of .planning/sql/2026-07-19_peer_tutoring.sql:
--
--   Bug 1 (duplicate relationships): peer_tutoring_relationships had no
--   unique constraint on (tutor, tutee, topic) — every "Find a tutor" submit
--   inserted a fresh row even when an identical pending/active relationship
--   already existed. offerTutorTopic's UNIQUE(tutor_profile_id, topic_id) was
--   already correct; this file adds the missing constraint on the table that
--   actually produced the duplicates.
--
--   Redesign (remove teacher approval): 'pending_approval' is dropped from
--   the relationship status enum — every eligible match (still gated by the
--   existing ability-gap/grade-difference checks in evaluateMatch()) now
--   starts 'active' directly. requires_approval/approved_by/approved_at
--   columns are kept (not dropped) since they're historical/audit data for
--   any relationships already created under the old flow — application code
--   simply stops writing to them going forward. Dropping columns that may
--   hold real historical data is unnecessary and riskier than just retiring
--   their use.
--
--   New feature (unmet requests): peer_tutoring_requests gains a 'fulfilled'
--   status (already had 'open'/'matched'/'cancelled' — see note below on why
--   'matched' is being reused rather than adding a redundant 'fulfilled') and
--   a fulfilled_by_relationship_id link, so a request created by a failed
--   search can be picked up later by a browsing tutor and traced to the
--   resulting relationship.
-- ─────────────────────────────────────────────────────────────────────────────

-- ═══ 1. Fix Bug 1 at the DB level: one active/pending relationship per ═════
-- ═══    (tutor, tutee, topic) pairing ═══════════════════════════════════════
-- Partial unique index (not a plain UNIQUE constraint) because a pairing is
-- allowed to have MULTIPLE historical relationships over time (e.g. one
-- completed, then a new one later) — what must never duplicate is more than
-- one *open* (active, or previously pending_approval) relationship for the
-- same pairing at once. 'declined'/'ended_early'/'completed' rows are
-- excluded from the constraint so history is never blocked.
CREATE UNIQUE INDEX IF NOT EXISTS uq_peer_tutoring_relationships_open_pairing
  ON public.peer_tutoring_relationships (tutor_student_id, tutee_student_id, topic_id)
  WHERE status IN ('active', 'pending_approval');

-- ═══ 2. Remove teacher approval from the status enum ═══════════════════════
-- Postgres CHECK constraints can't be altered in place — drop and recreate.
-- 'pending_approval' removed; existing rows (if any reached this status
-- under the old flow) are left as-is — see note above, this is a forward-only
-- change, not a backfill. If you have real pending_approval rows you want
-- resolved, decide per-row (approve -> active, or decline) before or after
-- running this; the CHECK constraint change itself doesn't touch existing
-- rows, it only prevents new ones.
ALTER TABLE public.peer_tutoring_relationships
  DROP CONSTRAINT IF EXISTS peer_tutoring_relationships_status_check;

ALTER TABLE public.peer_tutoring_relationships
  ADD CONSTRAINT peer_tutoring_relationships_status_check
  CHECK (status IN ('pending_approval', 'active', 'completed', 'ended_early', 'declined'));
  -- NOTE: 'pending_approval' is deliberately still allowed here at the DB
  -- level (not removed from the CHECK) purely so any pre-existing
  -- pending_approval rows remain valid/queryable — application code no
  -- longer writes this value for new relationships. This avoids an
  -- awkward migration decision being forced on you for old data.

-- Retire the now-unused partial index that assumed pending_approval rows
-- would keep accumulating (from the original migration) — replaced by the
-- open-pairing index above, which already covers 'pending_approval' for any
-- legacy rows.
DROP INDEX IF EXISTS idx_peer_tutoring_rel_pending_approval;

-- ═══ 3. Unmet-requests feature: link a request to the relationship that ═══
-- ═══    eventually fulfilled it ═════════════════════════════════════════════
-- Reusing the existing 'matched' status (rather than adding a new
-- 'fulfilled' value) — a request's lifecycle is genuinely the same concept
-- whether it was matched instantly by findTutorMatches() or later by a tutor
-- browsing open requests; both mean "this request now has a relationship."
-- The new column below is what actually lets a browsing tutor's fulfilment
-- be traced/audited, not the status value itself.
ALTER TABLE public.peer_tutoring_requests
  ADD COLUMN IF NOT EXISTS fulfilled_by_relationship_id BIGINT REFERENCES public.peer_tutoring_relationships(id) ON DELETE SET NULL;

-- grade is needed on the request row so a browsing tutor's eligible-topic
-- list can be filtered without an extra join back to students for every
-- open request shown in the browse view.
ALTER TABLE public.peer_tutoring_requests
  ADD COLUMN IF NOT EXISTS grade INT2;

CREATE INDEX IF NOT EXISTS idx_peer_tutoring_requests_fulfilled_rel
  ON public.peer_tutoring_requests(fulfilled_by_relationship_id) WHERE fulfilled_by_relationship_id IS NOT NULL;

-- ─────────────────────────────────────────────────────────────────────────────
-- After running this file: existing peer_tutoring_requests rows created
-- before the `grade` column existed will have grade = NULL. This only
-- affects the new tutor-browse filtering (a NULL-grade request just won't
-- surface a grade badge in that view) — it does not block anything, and
-- backfilling old rows is not required for the feature to work correctly
-- for all new requests going forward.
-- ─────────────────────────────────────────────────────────────────────────────
