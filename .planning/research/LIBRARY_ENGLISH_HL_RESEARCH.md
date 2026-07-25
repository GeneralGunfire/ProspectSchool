# English Home Language Research — Subject-Level Methodology & Terms 1-2 Topic List

**Source:** Perplexity deep-research pass, human-run, 2026-07-23. Prompt A
(methodology) and Prompt B (Terms 1-2 topic list) run together. Grounded in
standard CAPS-aligned Grade 10 English HL practice — the human flagged no
live CAPS/ATP PDF access, so term-by-term placement is inferred from common
practice, not verbatim CAPS quotation. Subject id confirmed as `english-hl`
in `src/features/study/data/subjects.ts` (English FAL is not offered on this
platform).

## Five strands, taught in parallel each term (not sequential blocks)

1. Listening and speaking
2. Reading and viewing (comprehension)
3. Writing and presenting
4. Language structures and conventions
5. Literature (integrated with reading/writing)

## Scope per strand, Terms 1-2

**Language structures and conventions** — closest fit to the existing engine
(rule-based, has a genuine correct answer). Term 1: word classes, sentence
structures (simple/compound/complex), subject-verb agreement, tenses,
punctuation/mechanics, basic figures of speech (simile/metaphor/
personification/hyperbole). Term 2: relative/conditional clauses, direct/
indirect speech, active/passive voice, advanced punctuation (colon/
semicolon/dash), expanded figurative language (symbolism/irony/oxymoron,
sound devices).

**Reading and viewing (comprehension)** — mostly compatible with the
existing engine if kept to MCQ/short-answer. CAPS taxonomy: literal,
reorganisation, inferential, evaluative, appreciation. Term 1: short unseen
prose passages, visual/multimodal texts (adverts, posters), mostly literal/
reorganisation + basic inference. Term 2: longer passages including
argumentative texts, more complex visual texts (cartoons/infographics),
stronger inference/evaluation/appreciation focus, summary writing.

**Writing and presenting** — genuinely incompatible with the existing
single-correct-answer quiz/mastery-gate model (see structural note below).
Term 1: narrative/descriptive essays, informal letters, simple formal
letters, emails/notices. Term 2: discursive/argumentative essays, formal
letters (application/complaint/business), reports, simple reviews.

**Literature** — poetry, short stories, a set novel/drama. **Set-work
literature is NOT nationally uniform** — varies by province/school. Research
explicitly recommends building generic, text-agnostic literary-analysis
skill modules (device identification, theme-from-evidence reasoning,
plot-summary-vs-analysis distinction) rather than fixed content tied to one
book. Term 1: poetic-tools introduction, 1-2 early poems, device
identification + basic theme. Term 2: deeper poem analysis (tone, context),
short-story analysis (plot/character/setting → theme/technique).

**Listening and speaking** — listening comprehension is feasible async
(audio clip + questions). Speaking (prepared/unprepared speech, discussion)
is NOT feasible to assess async — research recommends treating actual
speaking performance assessment as out of scope; can support planning/
self-reflection/checklists only, not evaluation.

## Structural note: why this isn't a simple content-authoring task

Per Prompt A, four of five strands need real engine adaptation, not just new
content files:

- **Language structures**: existing worked-example/misconception/quiz
  pattern transfers almost unchanged (this is the "build like Math" strand).
- **Comprehension**: transfers reasonably if kept to MCQ/short-answer with
  question-type tagging (literal/inferential/evaluative/appreciation) — open
  written responses are out of scope for auto-grading.
- **Writing**: the existing `QuizItem`/`PracticeItem` types are built around
  `correctIndex`/`correctIndices` — there is no way to represent "many
  possible good answers" content. Research recommends rubric/checklist-based
  self-assessment and annotated-exemplar comparison instead of a graded
  quiz, plus draft→feedback→revise as a project structure rather than a
  single mastery-gated attempt.
- **Literature**: mixed — device-identification/factual-recall fits MCQ;
  extended analysis needs the same rubric/exemplar approach as writing.
- **Listening**: feasible with an audio-clip + MCQ/short-answer structure
  (would need a new audio-playback component — doesn't exist yet).
- **Speaking**: recommended out of scope for this platform's async model.

This is a bigger fork than previous subject additions (Math's graphing/
diagram gaps were rendering-only; this affects the assessment model itself)
and was flagged to the human for a scope decision before building anything.
