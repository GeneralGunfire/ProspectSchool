-- ─────────────────────────────────────────────────────────────────────────────
-- Hand-run in Supabase Studio SQL editor. NOT a tracked migration (per CLAUDE.md
-- convention — schema changes here are executed manually by the project owner,
-- never by an AI assistant, and never via `supabase migration up`).
-- ─────────────────────────────────────────────────────────────────────────────
-- AI Tutor feature. See .planning/research/AI_TUTOR_FEATURE_RESEARCH.md for the
-- full evidence base — every design choice below traces to a numbered section
-- there (noted inline).
--
-- Five tables:
--   1. ai_tutor_conversations   — one row per chat session (student, subject/topic
--                                 context, entry point)
--   2. ai_tutor_messages        — one row per message (role, content, metadata
--                                 about grounding/refusal for that turn)
--   3. ai_tutor_interaction_logs — basic oversight log (research section 7):
--                                 topic, misconceptions referenced, whether the
--                                 refusal pattern fired, whether grounded or
--                                 general-knowledge fallback was used
--   4. ai_tutor_flagged_content  — moderation events: blocked/flagged inputs,
--                                 for periodic human review
--   5. question_meta            — is_graded_assignment / is_past_paper /
--                                 assessment_weight tags, keyed to a topic_tests
--                                 v2 question (research section 7's refusal-
--                                 pattern metadata). Kept as its own table rather
--                                 than ALTERing `questions` — questions.ts (the
--                                 catalog source of truth) doesn't model these
--                                 fields yet and this keeps the AI Tutor schema
--                                 additive/reversible without touching the
--                                 existing Topic Tests v2 system.
--
-- Practice-question generation (research section 5) is NOT given its own table
-- in this pass — it's ephemeral/session-scoped (generated JSON kept in
-- ai_tutor_messages.metadata for the turn that produced it, not persisted as a
-- separate practice-set entity). Reasoning: the research explicitly scopes this
-- to "close variations of vetted existing Topic Test questions", so the vetted
-- question already has a permanent home (topic_tests v2 `questions` table) —
-- persisting every generated variation would be a second, redundant content
-- store with no grading/persistence workflow attached to it yet (deferred, see
-- build report). If usage shows students want to revisit generated practice
-- sets later, add a table then.
--
-- RLS: enabled with NO policies on every table below, matching the de facto
-- convention already used for risk_scores / wellbeing_* / interventions /
-- outcomes — this app has no server backend, so Supabase Auth-bound RLS
-- policies would be theater (no auth.uid() session exists to bind to; the
-- service-role key already ships in the browser bundle for all existing
-- data-access files). Real access control is enforced in application code
-- (src/lib/aiTutor.ts) — every read/write takes an explicit student_id/
-- school_id and checks ownership before touching an individual student's row,
-- same discipline as wellbeing.ts. This is a pre-existing architectural gap in
-- the whole app, not something this feature can fix in isolation — flagged
-- here and in the build report, not silently accepted as fine.
-- ─────────────────────────────────────────────────────────────────────────────

-- ═══ 1. Conversations ═══════════════════════════════════════════════════════
-- One row per chat session. A session is scoped to a single subject/topic
-- context at creation time (research section 1: current-page-context grounding)
-- — a student switching topics starts a new conversation rather than the tutor
-- silently re-grounding mid-thread.

CREATE TABLE IF NOT EXISTS public.ai_tutor_conversations (
  id                BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  student_id        BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id         BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,

  -- Context this conversation is grounded in. subject_id is nullable to allow
  -- general-knowledge-fallback conversations (student asks about a subject/topic
  -- with no library page and no fallback-topic match — still answered, just
  -- flagged, per the "answer anyway, framed as unverified" requirement).
  subject           TEXT,              -- matches study library subjects.ts id, e.g. 'algebra'
  grade             INT2,
  term              INT2,
  topic_key         TEXT,              -- study-library topicId OR fallback-topic-list key OR NULL
  topic_label       TEXT,              -- human-readable label shown in chat header/history

  -- Where the conversation was started from — informs UI, not logic.
  entry_point       TEXT NOT NULL CHECK (entry_point IN ('library_lesson', 'topic_test_result', 'general')),

  -- If started from a Topic Test result: which attempt/question, so the tutor
  -- can pull the exact misconception(s) that were wrong on this attempt.
  source_attempt_id BIGINT REFERENCES public.student_attempts(id) ON DELETE SET NULL,
  source_question_id BIGINT REFERENCES public.questions(id) ON DELETE SET NULL,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_message_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_tutor_conversations_student
  ON public.ai_tutor_conversations (student_id, last_message_at DESC);

ALTER TABLE public.ai_tutor_conversations ENABLE ROW LEVEL SECURITY;

-- ═══ 2. Messages ═════════════════════════════════════════════════════════════
-- One row per turn. `metadata` carries per-turn grounding/refusal/moderation
-- facts so the interaction log (table 3) can be derived/queried without
-- re-parsing model output, and so a human reviewer can see exactly what
-- grounding was used for any given answer.

CREATE TABLE IF NOT EXISTS public.ai_tutor_messages (
  id                BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  conversation_id   BIGINT NOT NULL REFERENCES public.ai_tutor_conversations(id) ON DELETE CASCADE,
  role              TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content           TEXT NOT NULL,

  -- Per-turn facts about how this assistant message was produced. NULL for
  -- role='user'. Kept as jsonb (not separate columns) since this is diagnostic/
  -- oversight metadata, not queried at row-filtering scale for this app's size.
  -- Shape (all keys optional, populated only for role='assistant'):
  --   {
  --     "grounding": "current_page" | "fallback_topic_list" | "general_knowledge" | "none",
  --     "refusal_triggered": boolean,
  --     "moderation_blocked": boolean,
  --     "misconception_codes": string[],   -- misconceptions.code values referenced
  --     "hint_level": 1 | 2 | 3 | null      -- which rung of the Socratic ladder was used
  --   }
  metadata          JSONB,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_tutor_messages_conversation
  ON public.ai_tutor_messages (conversation_id, created_at ASC);

ALTER TABLE public.ai_tutor_messages ENABLE ROW LEVEL SECURITY;

-- ═══ 3. Interaction logs ════════════════════════════════════════════════════
-- Research section 7: "basic logging and oversight" as a real requirement, not
-- an afterthought, for a minor-facing product. One row per assistant turn
-- (denormalized from ai_tutor_messages.metadata) so a human reviewer can run a
-- simple periodic query — e.g. "show me every refusal-triggered row this
-- week" — without joining/parsing jsonb by hand.

CREATE TABLE IF NOT EXISTS public.ai_tutor_interaction_logs (
  id                  BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  conversation_id     BIGINT NOT NULL REFERENCES public.ai_tutor_conversations(id) ON DELETE CASCADE,
  message_id          BIGINT NOT NULL REFERENCES public.ai_tutor_messages(id) ON DELETE CASCADE,
  student_id          BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id           BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,

  subject             TEXT,
  topic_key           TEXT,
  grounding_mode       TEXT NOT NULL CHECK (grounding_mode IN ('current_page', 'fallback_topic_list', 'general_knowledge', 'none')),
  misconception_codes  TEXT[] NOT NULL DEFAULT '{}',
  refusal_triggered    BOOLEAN NOT NULL DEFAULT false,
  moderation_blocked   BOOLEAN NOT NULL DEFAULT false,

  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_tutor_logs_review
  ON public.ai_tutor_interaction_logs (created_at DESC)
  WHERE refusal_triggered = true OR moderation_blocked = true;

CREATE INDEX IF NOT EXISTS idx_ai_tutor_logs_student
  ON public.ai_tutor_interaction_logs (student_id, created_at DESC);

ALTER TABLE public.ai_tutor_interaction_logs ENABLE ROW LEVEL SECURITY;

-- ═══ 4. Flagged content ═════════════════════════════════════════════════════
-- Separate from interaction_logs: this is specifically inappropriate/unsafe
-- input the moderation pre-filter blocked BEFORE it reached the tutoring
-- prompt at all (vs. a refusal, which is a normal in-scope "won't solve your
-- graded homework" response). Kept as its own table so a human reviewer can
-- scan only genuine safety events, not mixed in with routine refusal-pattern
-- rows.

CREATE TABLE IF NOT EXISTS public.ai_tutor_flagged_content (
  id                BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  conversation_id   BIGINT REFERENCES public.ai_tutor_conversations(id) ON DELETE SET NULL,
  student_id        BIGINT NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  school_id         BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,

  raw_input         TEXT NOT NULL,       -- the message that was blocked, for review
  category          TEXT NOT NULL,       -- e.g. 'self_harm', 'sexual_content', 'violence', 'off_topic_abuse', 'other'
  reviewed          BOOLEAN NOT NULL DEFAULT false,

  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_tutor_flagged_unreviewed
  ON public.ai_tutor_flagged_content (created_at DESC)
  WHERE reviewed = false;

ALTER TABLE public.ai_tutor_flagged_content ENABLE ROW LEVEL SECURITY;

-- ═══ 5. Question metadata (refusal-pattern trigger, research section 7) ═════
-- Tags a Topic Tests v2 `questions` row as graded-assignment / past-paper
-- content so the tutor's refusal pattern has real metadata to act on. One row
-- per question that needs a non-default flag — questions with no row here are
-- treated as ordinary practice content (both flags false) by application code.

CREATE TABLE IF NOT EXISTS public.question_meta (
  question_id           BIGINT PRIMARY KEY REFERENCES public.questions(id) ON DELETE CASCADE,
  is_graded_assignment  BOOLEAN NOT NULL DEFAULT false,
  is_past_paper         BOOLEAN NOT NULL DEFAULT false,
  assessment_weight     TEXT CHECK (assessment_weight IN ('low', 'medium', 'high')),
  created_at            TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.question_meta ENABLE ROW LEVEL SECURITY;

-- Topic Tests v2 `topic_tests` rows already carry `test_purpose` — if that
-- column's values include something like 'formal_assessment' vs 'practice',
-- application code should prefer deriving is_graded_assignment from it where
-- possible and only fall back to this table for explicit overrides. Not
-- assumed here since test_purpose's exact value set wasn't confirmed against
-- live data — check before wiring this up (see build report).
