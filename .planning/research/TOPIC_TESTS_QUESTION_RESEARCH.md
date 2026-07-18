# Topic Tests — Question Research (all topics)

Consolidated research backing the diagnostic questions in `src/lib/topicTestCatalog.ts`.
Each topic gets its own section below, added as it's researched via Perplexity and
integrated into the catalog. Do not split into per-topic files — keep everything here.

**Process for adding a new topic:**
1. Run the Perplexity research prompt for the topic (ask Claude for the prompt if needed).
2. Paste the full output here as a new `## Topic: <name>` section (use the template below).
3. Extract the question/misconception data into `topicTestCatalog.ts`.
4. Run `npm run seed:topictests` to push it live.

---

## Index

| Topic | Grade | Term | Subject | Questions | Status |
|---|---|---|---|---|---|
| [One Variable Linear Equations](#topic-one-variable-linear-equations) | 10 | 1 | Maths | 14 | Live |

---

## Topic: One Variable Linear Equations

**Grade:** 10 · **Term:** 1 · **Subject:** Mathematics · **Catalog key:** `OneVariableLinearEquations`
**Research date:** 2026-07-18 · **Source:** Perplexity deep research pass
**Integration status:** Live — integrated into `topicTestCatalog.ts`, seeded via `npm run seed:topictests`.

### Why misconception-targeted diagnostic questions

Diagnostic questions are more pedagogically useful than standard right/wrong quiz questions
because they provide actionable insight into *why* a student is struggling, not just *that*
they are struggling. Research from Eedi (formerly Diagnostic Questions) shows that students
often select the same wrong answer for the same underlying misconception, making it possible
to identify and address specific gaps in understanding. This aligns with Black & Wiliam's
foundational work on formative assessment, which emphasizes that feedback should be specific
enough to guide learning, not just indicate correctness.

By designing questions where each wrong option maps to a known error pattern, teachers can:
- Identify the exact misconception a student holds
- Target instruction to address that misconception
- Track progress as misconceptions are corrected

This approach transforms assessment from a summative judgment into a formative tool for learning.

### Difficulty distribution (as researched)

| Difficulty   | Questions                          | % |
|--------------|-------------------------------------|---|
| Foundational | Q1, Q3, Q9                          | ~21% |
| Application  | Q2, Q4, Q5, Q7, Q8, Q10, Q11, Q13   | ~57% |
| Extension    | Q6, Q12, Q14                        | ~21% |

Note: mapped into the catalog's foundational/application/extension buckets; the raw
40/40/20 target split from the original prompt wasn't hit exactly by the research output
(came back closer to 21/57/21) — used as researched rather than forced to match.

### Sources cited by Perplexity

- Eedi (Diagnostic Questions). "Misconceptions in Algebra: Common Error Patterns."
- Black, P., & Wiliam, D. (1998). "Assessment and Classroom Learning." *Assessment in Education.*
- Journal of Assessment in Higher Education (2020). "Creating Diagnostic Assessments: Automated Distractor Generation with Integrity."
- NSF Conference Paper (2023). "Enhancing the Automatic Identification of Common Math Misconceptions."
- CAPS Mathematics Curriculum (Grades 10-12). Department of Basic Education, South Africa.

Perplexity's own caveat: where specific CAPS-aligned South African research wasn't directly
available, questions were constructed using well-established error patterns from international
maths education research (general algebra misconception literature, not SA-specific studies).

### Full raw research output (verbatim)

#### Sub-skill 1: Isolating the variable using addition/subtraction

**Question 1 (Foundational)** — Solve for x: x + 7 = 12
- A) x = 5 ✓
- B) x = 19 — Misconception: adds instead of subtracts when isolating the variable
- C) x = -5 — Misconception: subtracts the wrong way around (7 - 12 instead of 12 - 7)
- D) x = 84 — Misconception: multiplies instead of subtracts
- Explanation: subtract 7 from both sides: x = 12 - 7 = 5.

**Question 2 (Application)** — Solve for x: x - 9 = -4
- A) x = 5 ✓
- B) x = -13 — Misconception: subtracts 9 from -4 instead of adding
- C) x = 13 — Misconception: adds 9 to 4 but ignores the sign on -4
- D) x = -5 — Misconception: subtracts 4 from 9 instead of isolating x
- Explanation: add 9 to both sides: x = -4 + 9 = 5.

#### Sub-skill 2: Isolating the variable using multiplication/division

**Question 3 (Foundational)** — Solve for x: 5x = 35
- A) x = 7 ✓
- B) x = 30 — Misconception: subtracts 5 instead of dividing
- C) x = 175 — Misconception: multiplies 5 × 35 instead of dividing
- D) x = 6 — Misconception: divides 35 by 6 (rounding/confusion)
- Explanation: divide both sides by 5: x = 35 ÷ 5 = 7.

**Question 4 (Application)** — Solve for x: x/3 = 8
- A) x = 24 ✓
- B) x = 11 — Misconception: adds 3 instead of multiplying
- C) x = 5 — Misconception: subtracts 3 from 8
- D) x = 8/3 — Misconception: divides 8 by 3 instead of multiplying
- Explanation: multiply both sides by 3: x = 8 × 3 = 24.

#### Sub-skill 3: Equations involving brackets (distribution)

**Question 5 (Application)** — Solve for x: 3(x + 2) = 21
- A) x = 5 ✓
- B) x = 7 — Misconception: divides 21 by 3 but forgets to subtract 2
- C) x = 9 — Misconception: distributes only to the first term (3x + 2 = 21)
- D) x = 3 — Misconception: subtracts 2 before dividing by 3
- Explanation: divide both sides by 3: x + 2 = 7, then subtract 2: x = 5.

**Question 6 (Extension — Short Answer)** — A student solves 4(x - 3) = 20 as:
Step 1: 4x - 3 = 20; Step 2: 4x = 23; Step 3: x = 5.75. Explain the error in Step 1 and solve correctly.
- Correct: error is not distributing the 4 to both terms — correct distribution gives 4x - 12 = 20,
  so 4x = 32, x = 8.
- Misconception: distributing only the first term in a bracket, forgetting the second term.

#### Sub-skill 4: Equations with the variable on both sides

**Question 7 (Application)** — Solve for x: 5x + 2 = 2x + 11
- A) x = 3 ✓
- B) x = 9 — Misconception: adds 2x to 5x instead of subtracting
- C) x = 1.5 — Misconception: subtracts 11 from 2 instead of moving terms correctly
- D) x = -3 — Misconception: sign error when moving terms across the equals sign
- Explanation: subtract 2x: 3x + 2 = 11, subtract 2: 3x = 9, x = 3.

**Question 8 (Extension)** — Solve for x: 7x - 5 = 3x + 15
- A) x = 5 ✓
- B) x = 10 — Misconception: adds 3x to 7x instead of subtracting
- C) x = 2.5 — Misconception: subtracts 15 from -5 incorrectly
- D) x = -5 — Misconception: sign error moving -5 to the right
- Explanation: subtract 3x: 4x - 5 = 15, add 5: 4x = 20, x = 5.

#### Sub-skill 5: Verifying/checking a solution by substitution

**Question 9 (Foundational)** — Check whether x = 4 is a solution to 2x + 3 = 11.
- A) Yes, it is a solution ✓
- B) No, because 2(4)+3 = 9 — Misconception: multiplies incorrectly (2×4=7)
- C) No, because 2(4)+3 = 14 — Misconception: adds before multiplying (order of operations error)
- D) Yes, because 2+4+3 = 11 — Misconception: substitutes x as addition instead of multiplication
- Explanation: 2(4)+3 = 8+3 = 11, correct.

**Question 10 (Application)** — A student claims x = 6 is the solution to 3x - 7 = 11. Check by substitution.
- A) Correct, because 3(6)-7 = 11 ✓
- B) Incorrect, because 3(6)-7 = 13 — Misconception: subtracts 7 from 18 incorrectly
- C) Incorrect, because 3(6)-7 = 9 — Misconception: multiplies 3×6=16
- D) Correct, because 3+6-7 = 11 — Misconception: treats 3x as 3+x
- Explanation: 3(6)-7 = 18-7 = 11, correct.

#### Additional mixed questions

**Question 11 (Application)** — Solve for x: 5x - 7 = 18
- A) x = 5 ✓
- B) x = 2.2 — Misconception: subtracts 7 from 18 before dividing
- C) x = 25 — Misconception: adds 7 to 18 then divides by 5 incorrectly
- D) x = 11 — Misconception: adds 7 to 18 and forgets to divide
- Explanation: add 7: 5x = 25, divide by 5: x = 5.

**Question 12 (Extension — Short Answer)** — A student solves 2(x + 5) = 16 as:
Step 1: 2x + 5 = 16; Step 2: 2x = 11; Step 3: x = 5.5. Identify the error and solve correctly.
- Correct: did not distribute the 2 to both terms — correct: 2x + 10 = 16, so 2x = 6, x = 3.
- Misconception: incomplete distribution of multiplication over addition in brackets.

**Question 13 (Application)** — Solve for x: 4x + 9 = 2x + 17
- A) x = 4 ✓
- B) x = 8 — Misconception: adds 2x to 4x instead of subtracting
- C) x = 2 — Misconception: subtracts 17 from 9 incorrectly
- D) x = -4 — Misconception: sign error when moving terms
- Explanation: subtract 2x: 2x + 9 = 17, subtract 9: 2x = 8, x = 4.

**Question 14 (Extension — Justification)** — Explain why checking your solution by substitution
is important, then check whether x = 3 is a solution to 5x - 4 = 2x + 5.
- Correct: checking by substitution confirms the solution satisfies the original equation,
  catching algebraic errors. 5(3)-4 = 11, 2(3)+5 = 11 — both sides equal 11, so x = 3 is correct.
- Misconception addressed: students often skip verification, missing chances to catch sign or
  arithmetic errors.

---

<!--
## Topic: <Next Topic Name>

**Grade:** · **Term:** · **Subject:** · **Catalog key:** `<TopicKey>`
**Research date:** · **Source:** Perplexity deep research pass
**Integration status:** Not yet integrated / Live

### Why misconception-targeted diagnostic questions
(only needs restating if the reasoning differs from the shared rationale above)

### Difficulty distribution (as researched)

### Sources cited by Perplexity

### Full raw research output (verbatim)
-->
