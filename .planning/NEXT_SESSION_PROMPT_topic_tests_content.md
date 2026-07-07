Continue building predefined Topic Tests content for Prospect (South African school portal, React 19 + Tailwind 4 + Vite + Supabase, at c:\prospect). Read CLAUDE.md first.

## What already exists — do not rebuild this

The Topic Tests feature is fully built and working: data model (6 Supabase tables: `topic_tests`, `topic_test_subskills`, `topic_test_questions`, `topic_test_assignments`, `topic_test_attempts`, `topic_test_answers`), full data-access layer in `src/lib/topicTests.ts`, teacher UI (`src/pages/portal/teacher/TopicTestsPage.tsx`), and student UI (`src/pages/portal/student/StudentTopicTestsPage.tsx`).

There are **two separate ways a teacher creates a test** — keep them separate, both stay:
1. **"Assign Test"** button → predefined/CAPS catalog tests only. Teacher picks Subject → Grade → Term → Topic (dropdown, CAPS order) → time limit → "Create & Assign". Zero authoring. Always `grading_mode: 'auto'`. This is what you're extending.
2. **"Build Custom Test"** button → full free-form teacher authoring (title, sub-skills, grading mode incl. teacher-marked open-text). Unrelated to this task — don't touch it.

## The actual task: fill in the CAPS catalog with real content

All predefined content lives in one place: `TOPIC_CATALOG` in `src/lib/topicTests.ts` (near the top of the file, right after the imports). It's keyed by `` `${subject_code}-${grade}-${term}` ``. The relevant key is **`'math-10-1'`** (Mathematics, Grade 10, Term 1 — confirmed live in Supabase: `subjects` table has `code: 'math'`, `label: 'Mathematics'`, `id: 3`).

The CAPS Grade 10 Term 1 Mathematics algebra strand has 4 topics, in this exact taught order (confirmed via Siyavula/CAPS ATP sources):
1. **Algebraic Expressions** (`topicKey: 'AlgebraicExpressions'`) — **DONE**, fully seeded with 5 sub-skills and 10 questions. Use this as the template for style/format/difficulty.
2. **Exponents** (`topicKey: 'Exponents'`) — currently `{ subskills: [], questions: [] }`, empty placeholder. **Needs content.**
3. **Number Patterns** (`topicKey: 'NumberPatterns'`) — currently empty placeholder. **Needs content.**
4. **Equations and Inequalities** (`topicKey: 'EquationsAndInequalities'`) — currently empty placeholder. **Needs content.**

Your job: fill in `subskills` and `questions` for topics 2, 3, and 4 (in that order — that's the CAPS teaching order), following the exact same data shape as Algebraic Expressions.

### Data shape to follow (copy this pattern exactly)

```ts
{
  topicKey: 'Exponents',
  label: 'Exponents',
  subskills: [
    'Sub-skill label 1',
    'Sub-skill label 2',
    // 4-6 sub-skills is the right range, matching Algebraic Expressions
  ],
  questions: [
    { subskillLabel: 'Sub-skill label 1', question_type: 'mcq',
      prompt: 'Question text', options: ['A', 'B', 'C', 'D'], correct_answer: 'B' },
    { subskillLabel: 'Sub-skill label 1', question_type: 'short_answer',
      prompt: 'Question text', correct_answer: 'exact expected answer' },
    // 2 questions per sub-skill, mix of mcq and short_answer (10 total questions matches the AlgebraicExpressions precedent)
  ],
},
```

Rules the grading engine (`gradeAnswer()` in the same file) actually enforces — content must match these or auto-grading will silently mark correct answers wrong:
- `question_type: 'mcq'` — `correct_answer` must be an **exact string match** to one of the `options` entries (including any unicode like `²`).
- `question_type: 'short_answer'` — graded by exact string match (case-insensitive) unless `answer_tolerance` is set, in which case both sides are parsed with `Number()` and compared within tolerance. For short-answer questions with a specific required format (like the "no spaces, e.g. 3x^2+12x" instruction used in Algebraic Expressions), spell out the exact expected format in the `prompt` itself — students see the prompt, not the code.
- `subskillLabel` on every question **must exactly match** one of the strings in that topic's `subskills` array (it's looked up by exact string, not by index) — a typo here means the question silently gets orphaned.
- Each `CatalogTopic` with content should have every sub-skill covered by at least one question — don't leave a defined sub-skill with zero questions (the class-wide sub-skill breakdown on the teacher's Topic Overview page will just show "No data" for it, which is a bad experience but not a hard error).

### Content should be genuinely CAPS-aligned, not guessed

Before writing questions, actually look up (web search) the real CAPS Grade 10 Term 1 sub-topics for each of Exponents, Number Patterns, and Equations & Inequalities — the way the previous session did for Algebraic Expressions (searched Siyavula's chapter table of contents and CAPS ATP sources). Suggested starting points to verify/adjust via research:

- **Exponents**: laws of exponents, simplifying exponential expressions, rational (fractional) exponents, solving exponential equations.
- **Number Patterns**: linear number patterns (constant difference), describing the general term, extending/predicting pattern terms.
- **Equations and Inequalities**: linear equations, quadratic equations, simultaneous equations (word problems), literal equations (changing the subject), linear inequalities.

Don't just invent sub-skills from memory — confirm against a real source the way the Algebraic Expressions sub-skills were (Siyavula chapter breakdown: real number system, rational/irrational numbers, rounding, surds, products, factorisation, simplifying algebraic fractions — condensed to 5 testable sub-skills).

## After adding content, verify it works

1. Type-check: `npx tsc --noEmit -p .` — ignore the known pre-existing baseline error pattern (`Property 'error' does not exist on type 'XResult'` in `TopicTestsPage.tsx`/`ClassesPage.tsx` — confirmed project-wide and unrelated, don't try to fix it).
2. Run a production build: `npm run build` — must be clean.
3. In the running app (teacher portal → Topic Tests → Assign Test), confirm the new topics now appear in the Topic dropdown for Mathematics/Grade 10/Term 1, and that the question count shown matches what you added.
4. If possible, actually assign one of the new tests to a test student account and answer through it once per topic to sanity-check the grading (e.g. that an MCQ with the exact right option is marked correct, and a short-answer with the documented format is marked correct).

## Things NOT to do

- Don't touch the "Build Custom Test" flow, `CustomTestModal`, `createTopicTest()`, or the manual-marking `MarkingScreen` — unrelated to this task, all working as-is.
- Don't create Supabase migration files. If any schema change is somehow needed (it shouldn't be — this is pure catalog data, no schema changes required), give the user raw SQL in chat to paste into Supabase Studio manually — this project's explicit, repeated preference (see CLAUDE.md's default migration-file rule is overridden for this project).
- Don't touch other subjects/grades/terms in `TOPIC_CATALOG` unless asked — stay scoped to `math-10-1`, topics 2-4.
- Don't change the free-text fallback behavior, the "no predefined tests available yet" empty state, or anything in `CreateTestModal`/`AddQuestionModal`/`TopicOverview`/`MarkingScreen` — this task is data-only, additive to `TOPIC_CATALOG`.
