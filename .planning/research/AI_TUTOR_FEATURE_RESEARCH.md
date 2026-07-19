# AI Tutor Feature — Research Foundation

**Status:** Research complete, feature not yet built. This is the evidence base the AI Tutor design and build must follow.

**Context locked in before this research was run:**
- **Groq only** — no separate vector database, no embedding service, no third-party RAG infrastructure. Short setup, no long infra build-out.
- **Demo-scale app**, free-tier usage limits expected and fine — not a funded production product serving thousands of concurrent users.
- Platform already has: study library (lessons/worked examples per topic), misconception-tagged diagnostic Topic Test system (Grade 10 Maths fully built), past papers, real per-student mark/topic-test data — all in Postgres (Supabase), directly queryable.
- Target users: South African high school students, many on low-end devices and constrained mobile data.
- Must be grounded in the platform's own CAPS-aligned content and each student's real diagnostic data — not a generic chatbot answering from general knowledge.

**Source:** Perplexity deep research pass, captured verbatim below with section numbering preserved for cross-referencing during design/build.

---

## 1. Simple grounding without a vector database

**Short answer:** For a narrow, curriculum-bounded tutor that already knows the student's current topic/test, a lightweight approach — either (a) passing the current page/lesson content directly into the prompt, or (b) using PostgreSQL full-text search to pull a few relevant chunks — is defensible and commonly used in practice. No separate embedding/vector stack needed for a demo-scale, single-subject tutor.

### What the evidence and practice say
- **RAG in narrow domains vs. open-web Q&A:** in bounded domains (e.g. "Grade 10 algebra, quadratic equations"), even simple retrieval (keyword, metadata filters, or just "current page content") often suffices because the model isn't choosing from millions of documents, just a small, structured set aligned to the curriculum.
- **Grounding via prompt context alone:** supplying the relevant source text and instructing the model to answer only from that text is a strong grounding mechanism even without vector search — this is the core of "strict RAG" patterns.
- **Postgres full-text search (tsvector/tsquery) is "good enough"** for a scoped tutor: supports ranking, phrase queries, filtering by metadata (grade, subject, topic). No need for semantic similarity search in a small, well-structured corpus.

### Concrete pattern to implement (Groq + Postgres only)

**Option A — "Current page context" (simplest, recommended for demo):**
- When the student is on a specific lesson/topic-test page: fetch that lesson's text (or worked examples + key explanations) from Postgres, optionally 1–2 closely related lessons by topic tag, inject as `<context>` in the Groq prompt, instruct: "Answer only using the following context."
- This is effectively "RAG with retrieval = current URL" — widely accepted for a scoped tutor.

**Option B — Postgres full-text search for "more relevant chunks":**
- Query like `grade = 10 AND subject = 'Mathematics' AND topic ILIKE '%quadratic%'` plus text search on the student's question. Return top 2–3 chunks (~300–600 tokens each) as `<context>`.
- Standard "keyword RAG" pattern, explicitly recommended as a lightweight alternative to vector search for narrow domains.

**Failure modes and mitigations (no extra infra needed):**
- Retrieved chunk too generic/misaligned → tighten retrieval with metadata filters (grade, subject, topic, CAPS code).
- Model ignores context, answers from general knowledge → limit context to 2–3 chunks max, use strict system instructions ("if not in context, say you don't have it").

**Verdict for this build:** pass the current lesson/topic content + maybe 1–2 nearby chunks via full-text search. Explicitly state as a scope limitation: "This tutor is bounded to the current topic and our CAPS-aligned content; it does not browse the web or general knowledge."

---

## 2. Socratic/scaffolded tutoring dialogue design

**Short answer:** Give hints before answers, elicit student reasoning, adapt hint depth to student responses, use structured internal "AI thoughts"/reasoning to enforce scaffolding. Well-designed prompts can reliably reduce (not eliminate) the "just give the answer" failure mode.

### What the research says
- **Hints before answers:** studies on AI-generated hints in algebra show prompting for hints (not solutions) can support learning, but naive prompts often yield hints that are too general or effectively give the answer — explicit scaffolding constraints in the system prompt are critical.
- **Personalised dialogue targeting misconceptions:** a 2025 pre-registered experiment found personalised AI dialogue targeting a specific misconception produced significantly larger immediate belief reduction than generic textbook-style refutation or neutral AI chat.
- **Constrained AI tutors (Eedi/DeepMind RCTs):** Eedi's tutor activates only after a wrong answer on a diagnostic question, bounded to the specific construct/misconception, uses a pedagogy prompt + student context. Early results: high supervisor approval of AI-drafted messages, promising learning gains — supports that constrained, pedagogy-prompted tutors work at classroom scale.
- **Khanmigo-style "AI thoughts":** uses an internal thought block where the model works through the problem step-by-step, decides hint level, is explicitly told not to reveal the answer but to ask the student to explain reasoning — a practical way to counteract the model's helpfulness/compliance bias.

### Implementable pattern: Socratic system prompt + hint ladder

**System prompt structure:**
- Role: "You are a CAPS-aligned Socratic tutor for Grade X Mathematics. Your job is to help students understand, not to solve for them."
- Core rules:
  - Never give the final answer to a graded/practice question unless the student has made multiple genuine attempts and explicitly asks for a full solution.
  - Always start by asking the student to explain their current thinking or where they're stuck.
  - Use a **3-level hint ladder**:
    1. Metacognitive prompt ("What do you think the first step should be?")
    2. Strategic hint (point to the relevant concept/formula, without applying it)
    3. Worked sub-step (show one step, then ask the student to continue)
  - If clearly stuck after 2–3 turns, offer a near-complete worked example on a *similar but not identical* problem, then return to the original.

**Internal "AI thoughts" block (as in Khanmigo):**
- Each turn, instruct the model to first produce an internal reasoning block (not shown to student) where it solves the problem itself, identifies the key concept and likely misconception, chooses a hint level based on the student's last message — then generates the student-facing message from that reasoning. Shown to improve alignment and reduce premature answer-giving.

**Explicit "answer refusal" logic:**
- If the user asks "Just give me the answer" or pastes an exam/homework question: respond with a brief concept explanation, a simpler scaffolded version of the problem, and a statement that direct solutions to graded assessment items aren't given, but the underlying skill can be taught. (More detail in section 7.)

**What prompting alone cannot fully solve:** persistent students can sometimes coax the model into giving answers; the model may occasionally over-explain or slip into solution mode. For a demo, a well-crafted Socratic prompt + hint ladder is a reasonable baseline — high-stakes use would need logging + human transcript review (as in Eedi's RCT).

---

## 3. Reducing hallucination/inaccuracy without heavy infrastructure

**Short answer:** Combine (1) strict "answer only from provided context" instructions, (2) explicit "I don't know" escape hatches, (3) requiring citations to the specific passage used, (4) limiting model freedom via structured output. Will not guarantee zero hallucination, but is the core of what practitioners recommend for "strict RAG" without extra infrastructure.

### Evidence-backed prompting strategies
- **Strict instruction + "only from documents":** "Use ONLY the information provided in the documents below to answer the user's question. If the answer is not contained in the documents, respond with: 'I could not find the answer in the provided documents.'" Forces a binary choice: answer from context or abstain.
- **Cite sources explicitly:** require the model to name the specific passage/section used — increases trust and makes hallucinations easier to detect.
- **Extractive style & confidence checks:** "Answer by extracting the exact relevant sentences/phrases from the documents; do not add your own explanation" / "Only answer if the documents contain highly relevant information."
- **Step-by-step verification:** read context → check if answer is explicitly supported → if yes, answer with citation; if no, say "I don't know based on the provided documents." Reduces blending of context with general knowledge.

### Concrete system-prompt pattern
```
You are a CAPS-aligned tutor for South African high school Mathematics.

Rules:
1. Use ONLY the information in the <context> block below to answer questions.
2. If the answer is not fully supported by <context>, say:
   "I don't have enough verified information in the provided materials to answer that."
3. For every factual claim, briefly cite the section/title from <context> that supports it.
4. Do not use outside knowledge about CAPS, terminologies, or methods unless it is
   explicitly consistent with the <context>. If you must rely on general knowledge,
   say so and keep it minimal.
5. Think step-by-step internally before answering, but show only the final explanation
   and citation to the student.

<context>
[Lesson/topic text retrieved from Postgres, with section titles]
</context>
```

**What prompting alone cannot guarantee:** zero hallucination, especially for numeric details (exact formula constants, edge-case conditions) or very recent syllabus changes/local terminology not present in context. Mitigate with: careful curation of context (up-to-date CAPS-aligned content), human spot-checks of critical content, logging of frequent "I don't know" responses to identify content gaps.

---

## 4. Using real diagnostic/misconception data to personalize tutoring

**Short answer:** Direct experimental evidence that personalised AI dialogue targeting a specific misconception outperforms generic explanations, at least short-term. Feeding a small, structured misconception summary (last 1–3 misconceptions for the current topic) into the prompt is feasible and likely beneficial for a Groq-only tutor.

### Evidence
- **Personalised misconception dialogue (2025 RCT, N=375):** AI tutor engaging students in dialogue targeting their strongest misconception produced significantly larger immediate belief-reduction than generic textbook-style refutation or neutral AI conversation. Effect persisted at 10 days, partially at 2 months.
- **Eedi's diagnostic + AI tutor RCTs:** each wrong answer maps to a named misconception, driving AI tutoring. First RCT (human oversight): 74.4% of AI-drafted messages approved without edits; Bayesian analysis suggested 93.6% posterior probability that supervised AI tutoring improves knowledge transfer over human tutoring alone. Second RCT explicitly tests whether richer student context (including misconception history) improves outcomes.
- **LLM-generated feedback in ITS (GPT-4 study, 2025):** the model could diagnose many errors and generate relevant feedback, but 35% of hints were too general, incorrect, or gave away the answer — prompt design and quality control matter significantly.

### Practical pattern for Groq-only, token-limited setup

**Per-turn context payload (recommended, minimal):**
- Current topic (e.g., "Grade 10 – Quadratic Equations – Solving by factorisation").
- Last 1–2 misconceptions for this topic from Postgres: code, short description, typical error example.
- Current question ID and the student's selected answer (if coming from a Topic Test).

```
<student_profile>
Grade: 10
Current topic: Quadratic equations – factorisation
Recent misconceptions in this topic:
- [Misconception code]: "..."
  Description: "..."
  Typical error: "..."
</student_profile>

<context>
[Lesson content / worked examples]
</context>

You are a CAPS-aligned tutor. Use the student_profile to tailor your explanations
and hints. Explicitly address the listed misconceptions where relevant, using
the descriptions provided.
```

**How much history?** Most recent 1–2 misconceptions for the *current topic* is the right trade-off for a demo. Full history across all topics is likely noise and wastes tokens. Optional: a one-line summary like "In the last 3 topic tests, the student most often struggled with X and Y."

**Realistic with Groq+Postgres:** personalised hints referencing the named misconception, tailored examples confronting the specific error pattern.
**Harder without more infra:** long-term adaptive sequencing across many topics based on full history; fine-grained "zone of proximal development" estimation over time. For a demo, focus on current-topic misconception personalization only.

---

## 5. Practice question generation quality and safety

**Short answer:** LLMs can generate usable MCQs, but quality is variable — subtle errors in correct answers, ambiguous wording, poorly designed distractors. Lightweight validation (self-review within the same call, generation constrained to vetted source questions) can raise quality to acceptable for a demo without human review of every item — but treat auto-generated questions as lower-stakes practice, not exam-grade.

### What the research says
- **Automatic MCQ generation + evaluation (2025):** LLMs are proficient at generating MCQs, but systematic issues arise (multiple correct options, missing correct option, cueing biases). A self-review module critiquing format/option quality/key-distractor logic significantly reduced these issues.
- **Medical assessment/SBA MCQ review (2025):** prompt engineering and blueprint alignment necessary but not sufficient; self-evaluation by the same LLM (or a second LLM judge) can act as first-pass QA before human review. Recommended checks: key-option conflicts, multiple defensible answers, non-exclusive distractors, cueing signals (e.g. option-length bias).
- **SAT-style MCQ generation pilot (2026, ~1,000 items):** generated MCQs matched human-vetted items on accuracy/clarity/answer quality, but failed on difficulty calibration, cognitive demand alignment, fine-grained skill targeting — LLMs are better at surface form than precise pedagogical calibration.

### Implementable lightweight validation patterns (Groq-only)

**Single-call generation with structured output (generate + self-check in one call):**
```json
{
  "question": "...",
  "options": ["A", "B", "C", "D"],
  "correct_index": 1,
  "rationale": "...",
  "checks": {
    "exactly_one_correct": true,
    "distractors_plausible": true,
    "no_obvious_cues": true,
    "aligned_to_concept": "..."
  }
}
```
Require the model to generate the question + answer key, then run through the checklist and fill `checks` honestly — regenerate internally if any check fails, only return a passing item.

**Constrain generation to vetted seeds:** instead of fully open generation, take a vetted source question from the existing Topic Test bank and produce 1–2 close variations (change numbers/context/surface features) while preserving the same underlying concept and misconception mapping — reduces conceptual drift risk.

**Optional second-pass "critic" call** (if token/rate limits allow): a second Groq call reviewing the generated question against a fixed rubric (clarity, single correct answer, distractor quality, CAPS alignment) — mirrors the "LLM judge" pattern from research.

**Realistic with Groq-only:** auto-generating low-to-medium stakes practice items with self-check; variations of vetted questions preserving concept/misconception mapping.
**Not realistic without human review/large-scale piloting:** high-stakes exam-style items with precise difficulty calibration, psychometric soundness guarantees.

**Position auto-generated questions as "extra practice, not exam-level"** and log items students flag as confusing.

---

## 6. Multilingual support using Groq alone

**Short answer:** Current Groq-hosted models can handle basic code-switching/bilingual explanation for some South African languages, but quality is uneven and generally lower than English. Limited multilingual support (English + one or two major languages, fallback to English) is feasible via prompting for a demo — treat as "nice-to-have with known limitations," not a core high-quality feature.

### What's known
- **LLMs for African languages:** significant variation across languages — some (Swahili, Afrikaans) better supported than others (isiZulu, isiXhosa, Sesotho). Common issues: code-mixing, inconsistent grammar, lower fluency in low-resource languages. Recommended: explicit language instructions, allow code-switching, don't expect native-level quality without fine-tuning/dedicated translation.
- **General multilingual LLM behavior:** models often default to English unless strongly prompted; quality degrades for low-resource languages, especially technical/curriculum-specific terminology; code-switching can help pedagogically but may amplify inconsistencies if the model isn't strong in both languages.

### Practical pattern for a Groq-only demo
```
You are a CAPS-aligned tutor for South African high school students.
- Default language: English.
- If the student writes in isiZulu / isiXhosa / Afrikaans / Sesotho, respond
  primarily in that language, but you may code-switch to English for technical
  terms when you are not confident.
- If you are unsure about a term in the student's language, say so briefly
  and give the explanation in English.
- Keep sentences short and clear, suitable for mobile data-constrained users.
```

**Scope limitation approach:** start with one additional language (e.g. isiZulu or Afrikaans) where a small set of key mathematical terms can be curated and included in `<context>` so the model can mirror them. Tell students explicitly: "I'm still learning [language]; if something sounds odd, I can explain in English."

**Expect:** reasonable high-level explanations, occasional unnatural phrasing or incorrect terminology in low-resource languages.
**Will not get:** consistently native-level, curriculum-perfect multilingual explanations without additional fine-tuning or dedicated translation models.

**Verdict:** feasible as a demo feature with clear caveats — not a hard "needs a separate translation service" blocker, but don't promise high-quality, fully CAPS-aligned multilingual explanations until tested and terminology curated.

---

## 7. Safety, scope limits, and misuse — minimum viable version

**Short answer:** Documented risk: students using AI tutors to bypass learning (direct answers to homework/exam questions) → cognitive offloading and worse performance when the tool is removed. Simplest defensible mitigation: a system-prompt scope + refusal pattern that (1) refuses to directly solve graded-assessment-style questions, (2) explains concepts and works through similar-but-non-identical examples, (3) logs interactions for basic oversight. This is the core of "constrained AI tutor" designs used in current RCTs.

### Documented risks
- **Cognitive offloading and worse post-test performance:** Bastani et al. (2025, cited by Eedi) found students using an *unconstrained* AI tutor improved while using the tool but performed significantly worse on post-tests without the tool compared to students without AI access. Conclusion: generative AI without guardrails can harm learning by encouraging offloading.
- **Direct answer-giving:** a non-trivial fraction of hints/responses effectively give away the answer, especially when students persistently ask for solutions, undermining intended scaffolding.

### Minimum viable safety layer (Groq + Postgres only)

**System-prompt scope and refusal rules:**
```
You are a CAPS-aligned Socratic tutor for South African high school students.

Scope and safety rules:
1. Do not directly solve:
   - Homework questions that appear to be graded assignments.
   - Past exam or trial exam questions when the student indicates this is for
     assessment or exam prep where they must not have the solution.
2. If the student asks for a direct solution to such a question:
   - Explain the underlying concept briefly.
   - Offer to work through a similar but different example.
   - State: "I can't give you the direct solution to this assessed question, but I
     can help you learn the skill so you can solve it yourself."
3. Always encourage the student to:
   - Try first, then ask for hints.
   - Use you to understand, not to copy answers.
4. If a question seems unsafe or off-topic (e.g., non-school content), politely
   decline and redirect to school-related topics.
```
This is essentially the "constrained tutor" pattern used in Eedi's RCTs.

**Topic/assessment metadata from Postgres:** tag questions as `is_graded_assignment` (bool), `is_past_paper` (bool), `assessment_weight` (low/medium/high). Include a flag in the prompt:
```
<question_meta>
is_graded_assignment: true
is_past_paper: false
</question_meta>
```
Instruct: "If `is_graded_assignment` is true, do not provide a direct solution; follow the refusal pattern."

**Basic logging and oversight:** log student ID (or anonymized), topic, question ID, and a short interaction summary (e.g. "refused direct solution, provided concept explanation"). For a demo, periodic human review of a log sample is enough to check refusal patterns are working and identify over-/under-permissive cases.

**What this cannot fully prevent:** a determined student rephrasing questions to hide graded-work origin, or coaxing near-solutions across multiple turns. **What's gained:** a clear, defensible policy aligned with emerging best practice, reduced risk of blatant cheating, and a foundation to strengthen later (stronger classifiers, human review pipelines) if scaled.

---

## Overall architecture sketch (Groq + Postgres only)

**Data layer (existing):** Postgres/Supabase tables for lessons (grade, subject, topic, CAPS code, text chunks), Topic Tests (questions, options, correct answers, misconception mappings), student results (per-question, per-topic, misconception tags).

**Retrieval/grounding, per tutor turn:**
1. Determine current grade/subject/topic from the page/session.
2. Optionally run a Postgres full-text search query for 1–3 relevant lesson chunks.
3. Fetch 1–2 recent misconception records for that topic for the student.

**Prompt construction:**
- System block: role, Socratic rules, safety/refusal rules, multilingual policy.
- `<context>`: lesson chunks + key definitions.
- `<student_profile>`: grade, topic, recent misconceptions.
- `<question_meta>`: `is_graded_assignment`, `is_past_paper`, etc.
- User message: student's question.

**Groq call:** fast Groq model, temperature low-to-moderate (0.2–0.5) for more deterministic tutoring, max tokens constrained to keep responses short and mobile-friendly.

**Output handling:** render response, log interaction metadata (topic, misconception tags, whether refusal pattern triggered).

This stays entirely within "Groq + existing Postgres" — no separate vector DB, embedding service, or third-party RAG infra — while remaining grounded, scaffolded, and reasonably safe for a demo.

---

## Cross-reference for build phase

When designing/building this feature, every one of these must be explicitly addressed, not silently dropped:
- [ ] Grounding uses current-page-context and/or Postgres full-text search only (section 1) — no vector DB, no embedding service added.
- [ ] System prompt implements the 3-level Socratic hint ladder and internal reasoning pattern (section 2), not a bare Q&A prompt.
- [ ] Strict "answer only from context" + citation + "I don't know" instructions are in the system prompt (section 3).
- [ ] Student's recent 1–2 misconceptions for the current topic are fed into the prompt as `<student_profile>` (section 4) — not full history, not omitted entirely.
- [ ] Any practice-question generation uses the self-check JSON pattern and/or is constrained to vetted-question variations (section 5) — not fully open generation with no validation.
- [ ] Multilingual support (if attempted for this pass) is explicitly scoped to 1–2 languages with honest "still learning" framing (section 6) — not silently promised as fully supported.
- [ ] `is_graded_assignment`/`is_past_paper` metadata and refusal-pattern system prompt are implemented (section 7) — this is the core misuse mitigation, not optional.
- [ ] Basic interaction logging exists (topic, misconception tags, whether refusal triggered) for later human spot-review.
- [ ] All user-facing scope framing is honest: this is a bounded, curriculum-content tutor, not a general-knowledge assistant, and does not guarantee hallucination-free answers.
