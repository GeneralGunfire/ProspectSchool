# Study Library — Teaching Methodology & Execution Plan

**Status:** Planning complete for the lesson template and Topic 1 build. This is the spec every lesson in the rebuilt Library must follow — not background reading.

**Scope of this document:** Grade 10, Term 1, Algebra only, starting with Topic 1 ("The Real Number System"). Other subjects/terms are explicitly out of scope until Algebra Term 1 is fully built and validated (per the project's stated build order).

---

## Part A — Source research (summarized, full detail in linked docs)

Three Perplexity deep-research passes fed this plan:
1. **Teaching methodology research** (how to teach effectively online — worked examples, cognitive load, retrieval practice, feedback design, mastery gating, multimedia principles, self-regulated learning, instructional-design frameworks). Full output captured in this conversation; not yet filed as a separate doc — this plan *is* its execution form.
2. **CAPS Grade 10 Term 1 Algebra topic list** — verified against the live Siyavula Grade 10 textbook (Chapter 1: Algebraic Expressions, Chapter 4: Equations and Inequalities), section-for-section match confirmed via direct fetch. Not a hallucinated list.
3. **Topic-specific research for Topic 1 ("The Real Number System")** — a dedicated Perplexity pass scoped to exactly this one topic: precise CAPS-level scope boundaries, teaching sequence rationale, a full misconception list (not just one), assessment item-type shape, and an opening-hook framing. Folded into Part D below. **This is the workflow pattern every future topic should follow** — general research (this doc) establishes the reusable template once; a dedicated topic-specific pass happens per topic before that topic is built, and Perplexity is scoped to guidance only (never generates actual lesson content or quiz questions — that stays with whoever authors the lesson).

### Verified CAPS Grade 10 Term 1 Algebra topic sequence (11 lessons)

1. **The Real Number System** ← building first
2. Rational and Irrational Numbers; Rounding; Estimating Surds
3. Algebraic Products (expanding brackets)
4. Factorisation
5. Simplifying Algebraic Fractions
6. Solving Linear Equations
7. Solving Quadratic Equations
8. Solving Simultaneous Equations
9. Word Problems (linear and quadratic)
10. Literal Equations
11. Solving Linear Inequalities

Each topic's prerequisites and expected outcomes are documented in the research pass output and should be pulled forward into that topic's lesson metadata when it's built.

---

## Part B — The lesson-authoring template (applies to every topic)

Synthesized from Merrill's First Principles of Instruction + Understanding by Design (backward design) + Cognitive Load Theory, per the teaching-methodology research. This is the repeatable structure — fill it in per topic, don't redesign the structure each time.

### 1. Lesson metadata (author before writing content)
- Topic name (CAPS-aligned) & grade/term.
- Prerequisites — explicit list of what a student should already know.
- 3–5 measurable learning objectives ("By the end of this lesson, you will be able to...").
- Mastery threshold: **≥80% on the end-of-lesson quiz** (research section 5).

### 2. Lesson structure (target: 20–30 minutes total)

| Phase | Time | What happens |
|---|---|---|
| **Activate** | 2–3 min | 2–3 diagnostic questions on prerequisites; a "where have you seen this before?" prompt. Surfaces gaps before new content, per Merrill's "activation" principle. |
| **Demonstrate — Chunk 1** | 5–7 min | Brief explanation (≤150–200 words) of the core idea + **1 fully worked example** with step-by-step reveal (see Part C for the interaction pattern) + 1–2 embedded knowledge checks. |
| **Demonstrate — Chunk 2** | 5–7 min | Second sub-skill/extension + 1–2 more worked examples, same pattern. **Rule: no more than ~6–8 minutes of exposition before an active check.** |
| **Apply — guided → independent** | 8–10 min | 2–3 **partially worked** problems (fading guidance — first 1–2 steps shown, learner finishes), then 4–6 **independent** problems, mixing routine and slightly novel. Use example–problem pairs (worked example A → problem A′ with different numbers) rather than blocking all examples then all problems. |
| **Assess** | 3–5 min | 5–8 item end-of-lesson quiz covering all stated objectives. This is the mastery gate (≥80%). |
| **Reflect & Integrate** | 2–3 min | 2–3 metacognitive prompts (confidence rating, "which step was hardest," real-world/next-topic connection). |

### 3. The worked-example pattern (non-negotiable, per research section 1)
Every new procedure gets **2–3 full worked examples** before any practice, each:
- Showing every step.
- Explicitly labeling the rule/principle used at each step (e.g., "Distributive property," "Combine like terms").
- Consistent visual layout so steps and justifications are easy to scan.

**Fading sequence** for practice (per the "expertise reversal effect" — heavy guidance helps novices, hinders advanced learners, so guidance must be removed progressively):
1. Full worked example (all steps + explanations).
2. Partially worked ("completion") problem — first 1–2 steps shown, learner completes the rest; later ones show only the first step.
3. Independent problem — no steps shown.

### 4. Interactivity rules (per research section 1 and 6 — use sparingly and only when it changes processing)
**Use interactivity when it:**
- Directs attention to a critical relation (e.g., highlight the term being isolated).
- Elicits generative processing — a self-explanation prompt ("Before revealing the next step, what operation would you do here and why?"), not just a reveal-on-click.

**Do NOT use interactivity for:**
- Hiding core explanation behind a click just to "gamify" reading.
- Decorative animation that doesn't clarify structure (bouncing elements, unnecessary transitions).

**Concrete pattern:** step-by-step reveal (one step at a time, tap/click to advance), each step paired with a 1-sentence justification. Clickable term explanations ("tap a term to see what it means") reserved for terms/steps students typically misinterpret — not applied uniformly to everything.

### 5. Feedback design (per research section 4 — this is where most of the actual teaching happens)
For every wrong answer, in this order, under ~60–80 words total:
1. **Name the error type** (1 sentence): "You subtracted 5 from only one side of the equation."
2. **Explain the principle** (1–2 sentences): "To keep the equation balanced, whatever you do to one side you must do to the other."
3. **Show the correct step** (1 line of math).
4. **Prompt a re-attempt** on a similar (not identical) problem.

**Progressive hint system** (3 tiers, learner requests in order):
1. Strategic ("What operation would isolate the term with x?")
2. Procedural ("Subtract 5 from both sides first.")
3. Worked step (show the first step fully worked).

Long, dense explanations are a failure mode (cognitive overload) — reserve longer explanation for a *second* occurrence of the same misconception, not the first.

### 6. Retrieval practice & embedded checks (per research section 3)
- **At least 3–5 embedded low-stakes knowledge checks per lesson**, not just an end-of-lesson quiz — placed after each major chunk.
- Checks require active recall (type a number, choose an answer, complete a step), not passive recognition.
- Frame as "Check your understanding," not "Test" — low-stakes framing matters.

### 7. Mastery gating and remediation (per research section 5)
- End-of-lesson quiz: 5–8 items, **≥80% = mastery**.
- **Below 80%:** do not just say "you failed." Show a diagnostic summary ("You're solid on X, but need more practice on Y and Z") and route to a **remediation micro-lesson** for the specific weak sub-skill.
- **Remediation must be qualitatively different content**, not just "easier" versions of the same questions:
  - Different representation/analogy (e.g., balance-scale metaphor for equations).
  - 2–3 extra worked examples targeting the specific error pattern.
  - Heavily scaffolded practice (hints always available).
  - Pass remediation (e.g., 4/5 correct) before re-attempting the main quiz.
- **≥95% (near-perfect):** offer challenge problems (multi-step, novel context) instead of remediation.

### 8. Spaced repetition (cross-lesson, not per-lesson — build after several lessons exist)
Research section 3 gives a concrete, lightweight algorithm (SM-2 derived) — not required for Topic 1's first build, but the schema should not preclude it later:
- Per skill: `interval_days` (starts at 1), `ease` (starts at 2.5), `last_practiced_date`.
- After a practice session, map score % to a rating 1–5.
- Rating < 3 → reset `interval_days = 1`. Rating ≥ 3 → `interval_days *= ease` (capped, e.g. max 60 days), adjust `ease` slightly.
- Schedule next practice when `current_date - last_practiced_date ≥ interval_days`.

**Decision for this build pass:** defer full SRS implementation until multiple lessons exist to schedule across — but the `study_progress`-equivalent data model should store enough (per-skill interval/ease/last-practiced) to add this without a schema rework later.

### 9. Multimedia/visual rules (per research section 6, Mayer's CTML)
- **Coherence:** no decorative images, no "fun fact" tangents unrelated to the math.
- **Signaling:** consistent color coding (e.g., blue = variable terms, orange = constants, green = operations) used the same way across every lesson.
- **Spatial/temporal contiguity:** explanation text lives next to (not far from, not requiring scroll to reach) the equation it describes.
- **Redundancy:** don't repeat the same explanation as both a caption and a tooltip and a side panel — pick one place.
- **Avoid:** split attention (forcing back-and-forth between separate panels), over-animation (moving elements without clarifying the algebraic rule), seductive details.

### 10. Self-regulated-learning scaffolding (per research section 7 — replaces what a live teacher would normally provide)
- **Goal-setting at lesson start** (30–60 sec): list 2–3 concrete objectives; optional "how confident are you?" (1–5).
- **Mid-lesson self-checks:** "Rate how well you understand this: 1–5" after each chunk; low rating → offer to review the last example or do an extra practice question.
- **End-of-lesson reflection:** "Which type of question felt hardest?" / "What will you focus on next?"
- **Clear readiness signals:** not "You scored 70%" but "You've mastered X and Y, Z still needs practice — do this short remediation, then try again." Traffic-light indicators (green/yellow/red) per sub-skill where multiple sub-skills exist in one lesson.

### Explicitly NOT evidence-supported (per research — do not build these as core pedagogy)
- Gamification layers (badges, points, leaderboards) — weak/inconsistent evidence for actual learning gains; fine as *optional* motivation, never the core design.
- Flashy/decorative animation — actively hurts learning (extraneous load) more often than it helps.
- Long unbroken exposition, even with good visuals — inferior to segmented, interactive chunks with frequent retrieval regardless of visual polish.
- Re-presenting identical content as "remediation" — must be genuinely different, not just repeated.

---

## Part C — What's carried forward from the old (deleted) Library implementation

The old Library was deleted, but these interaction patterns were evaluated against the new research and found to hold up well (keep the *pattern*, not necessarily the old code):

- **The scratchpad** — freehand canvas (pen/eraser/undo) for working out problems by hand, persisted per-question. Not directly addressed by the research, but doesn't conflict with any principle above and supports "productive struggle" during independent practice. Keep.
- **Step-by-step reveal with tappable math tokens** — matches research section 1's guidance on interactivity that directs attention to critical relations, *provided* each tap pairs with a real explanation (not decoration). Keep, but ensure every clickable element has pedagogical purpose (research section 1's "avoid" list).
- **Guided worked example → independent practice → remediation/challenge branching** — this is almost exactly the fading-guidance + mastery-gating pattern the research validates. Keep and formalize per Part B sections 3 and 7.
- **Mastery threshold driving a status badge** — validated by research section 5, but the old 2/3 (~67%) threshold should be raised to **80%** per the research's specific evidence-backed figure.
- **`LessonEnrichment.tsx` components** (`LearningOutcomes`, `KnowledgeCheck`, `ExamTip`, `SummaryCard`) — these map directly onto Part B's structure (objectives, embedded checks, worked-example annotations, chapter summary). Kept in the codebase, not deleted — reusable as-is or lightly adapted.
- **`QuizBlock.tsx`** — maps to the "Assess" phase's end-of-lesson quiz. Kept in the codebase.

---

## Part D — Topic 1 applied: "The Real Number System"

Concrete application of the template above to the actual first lesson to build. This section now incorporates a **third, topic-specific Perplexity research pass** (run separately from the general teaching-methodology and CAPS-topic-list research in Part A) — this is the pattern every future topic should follow: a dedicated Perplexity pass scoped to that one topic, gathering coverage/sequencing/misconception/assessment-shape guidance only (never generated lesson content or questions), before Claude Code builds it. Uncertainty is preserved below exactly as the research flagged it, rather than smoothed over.

### Precise CAPS-level scope (confirmed vs. explicitly out of scope)

**In scope for this lesson:**
- Classify numbers into N (natural), W (whole), Z (integers), Q (rational), Q′/irrational, R (real).
- The decimal-form distinction: rational = terminating or recurring; irrational = non-terminating, non-recurring.
- Identify whether a given number (including simple surds like √2, √9, √16) is rational or irrational.
- Number-line representation of different number types (especially integers, simple rationals, familiar irrationals like √2).
- The nested-subset relationship, taught **informally** (every natural number is a whole number, every whole number is an integer, etc.), not as a first-class abstract topic on its own.

**Explicitly OUT of scope at Grade 10** (per Siyavula's structure, since the CAPS PDF itself couldn't be directly fetched — flagged as inferred-from-Siyavula, not CAPS-verbatim-confirmed):
- Formal set-builder notation (e.g. `Z = {x ∈ R | x is an integer}`) or interval notation (`(a,b)`, `[a,b]`) — Siyavula doesn't introduce these here; they surface later, if at all, in functions/inequalities contexts.
- Formal proof of irrationality (e.g. proving √2 is irrational by contradiction) — beyond the expected cognitive level at this grade. Students should **accept and use** known facts ("√2 is irrational," "non-perfect-square surds are irrational") rather than prove them.

**Boundary with adjacent learning:**
- Grade 9 and earlier: basic number types, simple fractions/decimals, basic surd simplification (√16 = 4).
- Grade 10 (this lesson): formalising classification, rational-vs-irrational via decimal expansions, full real-number hierarchy.
- Grade 11–12: advanced surd manipulation, rationalising denominators, more formal set language elsewhere.

### Confirmed teaching sequence (matches Part B's chunking, now with explicit rationale)

1. Concrete, familiar sets first: Natural → Whole → Integers, anchored with number-line visuals and everyday examples (counting, temperature, debt).
2. Rational numbers via two complementary views: as fractions `a/b` (a,b ∈ Z, b≠0) AND as decimals that terminate or recur — explicitly show the equivalence (0.75 = 3/4, 0.3̄ = 1/3).
3. Contrast with irrational numbers: cannot be written as a/b; non-terminating non-recurring decimal form; use familiar examples (√2, √3, π) and non-examples (√9=3, √16=4 — deliberately reinforcing the misconception target below).
4. Real numbers R as the union of rational and irrational — "everything on the continuous number line."
5. **Only after** the above is solid: formalise the nested-subset relationship N ⊂ W ⊂ Z ⊂ Q ⊂ R. Rationale: avoids overloading students with abstract set relations before they understand the objects themselves — concrete before abstract, consistent with Part B's cognitive-load principles.

This directly supersedes/refines the "suggested chunking" originally drafted below — **rational/irrational distinction is the central conceptual leap of this lesson and should be treated as the primary content, with the nested-subset relationship as a capstone, not an opener.**

### Learning objectives (unchanged from original scoping, still accurate)
1. Define and give examples of natural numbers, whole numbers, integers, rational numbers, irrational numbers, and real numbers.
2. Classify a given number into the correct set(s).
3. Represent number sets using number-line placement (NOT formal set-builder/interval notation — see scope note above; this objective's original wording overstated scope and should be corrected to drop "set notation").
4. Explain the decimal-form distinction between rational (terminating/recurring) and irrational (non-terminating, non-recurring) numbers.

### Full misconception list to build feedback around (expanded from the single misconception originally scoped)

The build must have a **distinct feedback branch per misconception**, not folded into generic "incorrect" text — each includes the *why*, which should inform how the feedback is worded (per Part B section 5's "explain the principle" step):

1. **All square roots are irrational** (missing perfect squares like √16=4) — the originally-scoped misconception. Cause: weak number sense around which numbers are perfect squares.
2. **"Not an integer" is conflated with "irrational"** — cause: students overgeneralize from early exposure to integers/simple fractions, not fully internalizing that non-integer rationals (¾, 0.2) are still rational.
3. **Fractions are rational, but decimals are "something else"** — cause: fractions and decimals are often taught in separate units, so the terminating/recurring-decimal-equals-fraction link isn't made.
4. **Confusion over whether 0 is natural/whole** — cause: genuinely inconsistent conventions across South African textbooks/teachers (some start natural numbers at 1, some at 0). **This lesson should pick one convention explicitly and state it, rather than silently assuming students already agree** — flag to whoever authors content which convention this platform uses.
5. **Negative numbers thought not to be "real"** — cause: "real" is misread as "positive" or "tangible," so negatives feel excluded from Q or R.
6. **"Long decimal = irrational"** — cause: students associate non-terminating with irrational but don't distinguish recurring (still rational) from non-recurring.
7. **Weak recognition of perfect squares generally** (not just √16) — e.g. not recognizing 49, 64, 81, 144, or confusing √(a+b) with √a+√b.
8. **"Every real number is either an integer or a surd"** — cause: overexposure to integers and surds in early algebra under-represents plain fractions/non-surd decimals as a mental category.
9. **Symbol confusion** — thinking R means "only rational" (letter association), or mixing up Q and Z. Cause: arbitrary symbol names without mnemonic support.

### Assessment shape (concrete, evidence-informed item-type balance — not sample questions)

Four sub-skills to diagnose: (1) define/classify, (2) number-line representation, (3) rational-vs-irrational reasoning, (4) nested-subset understanding. **Note:** "use set notation" was dropped as a sub-skill per the corrected scope above; replaced with nested-subset reasoning, which research section 4 treats as a distinct testable skill anyway (see item type 5 below).

Recommended item-type mix for the 5–8 item end-of-lesson quiz:
- **~40% multi-select classification** — "Which sets contain this number? (select all)" — tests multiple memberships and nested structure at once.
- **~25% true/false with brief justification** — e.g. "Every integer is a rational number" / "If a decimal doesn't terminate, it must be irrational" — forces reasoning, not recall.
- **~20% decimal-expansion / rational-vs-irrational discrimination** — given several decimal expansions (terminating, recurring, non-recurring non-terminating), identify which are irrational — this is the core conceptual leap of the lesson and should not be under-tested.
- **~15% subset-relationship and number-line reasoning** — direct statements ("every rational number is a real number," "there exists an irrational number that is also an integer") and number-line placement/drag tasks.

A "which set does NOT contain this number" item format is also recommended as a variant of the classification type — forces students to identify a set's *boundary*, not just membership.

### Opening hook / motivating framing (replaces "why does this matter" placeholder)

Avoid gimmicks. Two research-suggested framings, either usable as the lesson's opening hook:
- **"Different tools for different jobs"** — different number types serve different real tasks (counting → natural/whole; temperature/balances → integers; measurements/prices → rationals; diagonals/circles/growth models → irrationals like √2, π). Classification affects which operations stay within a set and what precision is possible.
- **"What can be written exactly?"** — some quantities can be written exactly as a fraction (half a pizza, R12.50); others (diagonal of a 1×1 square, circumference of a circle) never can — any decimal is an approximation. Rational-vs-irrational answers: "can I write this exactly, or am I always approximating?" This framing ties directly into the lesson's central concept and is the stronger candidate for the actual opening hook.

### Difficulty/format calibration sources (for whoever authors the actual quiz items)
- Siyavula Grade 10, Chapter 1, sections 1.2–1.3 end-of-chapter exercises — real, fetchable reference for question format and surd complexity (expect simple surds: √2, √3, √5, √9, √16, √25).
- DBE Grade 10 Mathematics Term 1 workbooks and provincial exam papers (Gauteng/Western Cape/KZN) — typically short classification questions and true/false statements, no formal proofs or heavy set notation — consistent with the "out of scope" call above.
- Numbers to use in practice/quiz items: a mix of terminating decimals (0.125), recurring decimals (0.6̄), and non-recurring examples (a truncated, clearly-non-repeating decimal, described as non-recurring rather than using π's actual digits if precision matters).

### Explicit uncertainty flagged by the research (carry this caution into the build)
The CAPS PDF itself could not be directly fetched for this pass — the "in scope" / "out of scope" boundaries above are inferred from Siyavula's structure (a real, verified-fetchable, CAPS-aligned open textbook) plus general South African exam-paper conventions, not a direct CAPS-document quote. This is a reasonable and well-sourced inference, but if a stronger CAPS-verbatim source becomes available later, re-check the "set-builder notation out of scope" and "0 ∈ N convention" calls specifically, since those are the two points textbooks disagree on most.

---

## Cross-reference checklist for the build

- [ ] Lesson follows the Part B time-boxed structure (20–30 min, ≤6–8 min exposition before a check).
- [ ] 2–3 full worked examples before any practice; fading sequence (full → partial → independent) implemented for practice problems.
- [ ] Interactivity (step reveals, clickable terms) only used where it directs attention or elicits generative processing — not decoration.
- [ ] Feedback on wrong answers follows the 4-part structure (name error → explain principle → show correct step → prompt re-attempt), under ~80 words.
- [ ] 3-tier progressive hint system implemented for independent practice.
- [ ] At least 3–5 embedded knowledge checks across the lesson, not just an end quiz.
- [ ] Mastery threshold is 80%, not the old 67%.
- [ ] Sub-80% routes to a genuinely different remediation micro-lesson, not repeated content.
- [ ] Consistent color-coding/signaling used, no decorative/seductive elements, no split attention.
- [ ] Goal-setting at start, mid-lesson confidence self-checks, end-of-lesson reflection prompts present.
- [ ] All 9 of Topic 1's misconceptions (Part D) have distinct feedback branches, not folded into generic wrongness — not just the perfect-square-surd one.
- [ ] Content does NOT include formal set-builder or interval notation, or formal proof of irrationality — confirmed out of scope for this lesson.
- [ ] A convention for whether 0 ∈ N/W is explicitly chosen and stated in the lesson, not silently assumed.
- [ ] End-of-lesson quiz item-type mix roughly matches the 40/25/20/15 split (classification / true-false+justify / decimal discrimination / subset+number-line) from Part D.
- [ ] Lesson objective 3 says "number-line representation," not "set notation" (corrected scope).
- [ ] Opening hook uses the "what can be written exactly?" framing (or an equally non-gimmicky alternative), not a generic "why math matters" intro.
- [ ] No gamification/badges/points treated as core pedagogy.
