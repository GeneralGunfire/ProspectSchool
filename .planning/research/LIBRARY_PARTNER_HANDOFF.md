# Study Library — Partner Build Handoff

**Audience:** Claude Code, running in a fresh session for the second developer on this project (not the original builder). Read this document in full before doing or proposing anything.

**Purpose:** You are about to help build out the rest of the Prospect Study Library — dozens of subjects, each with multiple terms, each term with multiple topics — following an established methodology and a real, already-built reference lesson. This document tells you exactly how that process works, what already exists, and what you must do before writing any lesson content for a new subject.

---

## 1. What already exists — read these files first, in this order

1. **`.planning/research/LIBRARY_TEACHING_EXECUTION_PLAN.md`** — the core pedagogical spec. Parts A and B are the **general, reusable lesson-authoring template** (worked-example fading, cognitive load chunking, feedback design, mastery gating, multimedia rules, self-regulation scaffolding) — this applies to *every* topic in *every* subject, permanently. Part C documents what interaction patterns were kept from an even older, now-deleted implementation. Part D is topic-specific research for "The Real Number System" only — it is an *example* of the topic-specific research process, not a template to copy verbatim for other topics.
2. **`src/features/study/data/library/algebra/grade10/term1/realNumberSystem.ts`** — the actual authored content for "The Real Number System," Grade 10 Term 1 Algebra Topic 1. This is the **built reference implementation**. Read it in full. Every future topic — in Algebra and in every other subject — must match its depth, structure, and rigor. If a topic you build is noticeably thinner or shallower than this file, you have not met the bar.
3. **`src/features/study/components/lesson/`** — the reusable lesson-rendering engine (`LessonShell`, `WorkedExample`, `MisconceptionFeedback`, `HintTiers`, `Scratchpad`/`ScratchpadModal`, `SelfRegulation`, `colorScheme.ts`). This is shared UI infrastructure — **do not duplicate or fork it** per topic. New topics author *content* (data files matching the `LessonContent` type contract in `src/features/study/data/library/types.ts`) that the existing engine renders. If a new subject's content genuinely cannot fit the existing `LessonContent` shape, extend the shared type/engine deliberately and explain why — don't create a parallel one-off rendering path.
4. **`src/features/study/data/library/registry.ts`** — the single manifest of every topic that exists (subject, grade, term, topic ID, route ID). Every new topic you build must be registered here. `LibraryHubPage.tsx` and `LibraryPage.tsx` both read from this registry — a topic that isn't registered is unreachable, and the hub filters by the logged-in student's grade automatically based on registry data, so grade-scoping is correct by construction as long as you register topics accurately.
5. **`.planning/research/GRADE10_MATHS_CAPS_TOPIC_LIST.md`** (or the relevant section of `LIBRARY_TEACHING_EXECUTION_PLAN.md` Part A) — the **already-verified** Grade 10 Term 1 Algebra topic list (11 topics, confirmed against the live Siyavula Grade 10 textbook, section-for-section match). Topic 1 of this list is built. Topics 2–11 are not yet built, and this list should be reused as-is for those — do not re-research Term 1 Algebra's topic list from scratch.

## 2. The core discipline: research before building, every single time

Every substantial feature on this platform (Topic Tests, the at-risk intervention engine, Wellbeing check-ins, Peer Tutoring, and this Library) was built the same way: **real research first, then a design/execution plan grounded in that research, then a build that is verified against the plan — never build-first.** The Library specifically also required a *second, topic-specific* research pass beyond the general methodology, because "how to teach in general" and "what exactly to teach in this specific topic, in what order, with what known misconceptions" are two different questions that both need real answers.

You must follow this same discipline for every new subject and every new topic. Do not shortcut it because content-authoring "feels" like a lower-stakes task than building a data model or a safety-critical feature — a mediocre lesson silently teaches a student something wrong or unclear, at scale, potentially to real students. Treat content quality with the same seriousness as code quality.

## 3. The per-subject workflow — what you must do before building any new subject

**This is the main procedural instruction in this document. Follow it exactly, every time a new subject is started (including Algebra itself beyond Topic 1 — see section 4).**

### Step 1 — Confirm scope with the human before researching
Before generating any research prompt, explicitly tell the person you're working with:
- Which subject you're about to scope.
- Which grade(s) and term(s) this pass will cover (usually: start with Grade 10, the earliest term not yet built for that subject).
- Whether an existing, already-verified topic list covers any part of this scope (e.g. Algebra Term 1 already has one — do not silently discard it or silently re-research it; ask or state explicitly that you're reusing it).

### Step 2 — Generate two Perplexity research prompts (never generate lesson content yourself first)
You must produce **two distinct prompts** for the human to run in Perplexity, one at a time:

**Prompt A — "How to teach this subject online" (methodology, subject-specific angle).**
The general teaching methodology in `LIBRARY_TEACHING_EXECUTION_PLAN.md` Part B is subject-agnostic (cognitive load, worked examples, feedback design, etc.) and does NOT need to be re-researched — reuse it. What Prompt A must cover is what's genuinely *different* about teaching this specific subject online effectively: e.g. a language subject needs different interaction patterns than a science subject with practical/lab concepts; a subject with heavy diagram/visual content (e.g. Geography, Life Sciences anatomy) has different multimedia needs than a purely symbolic subject like Algebra; a subject with essay-based assessment (e.g. History, English) needs different feedback/assessment design than one with discrete right-answer items. Ask Perplexity to research this subject-specific teaching angle, building on top of (not replacing) the general methodology already established.

**Prompt B — the official, complete, accurate topic list for the subject and scope.**
This must produce a real, CAPS-traceable (or IEB, if the school uses that curriculum — check which applies) topic list for the exact subject/grade/term scope agreed in Step 1, broken into discrete, lesson-sized topics (not just broad headings) — following the exact same rigor as the original Algebra Term 1 topic-list research: cite real sources (official CAPS documents, DBE Annual Teaching Plans, Siyavula or equivalent open/verified textbooks), be explicit about what's confirmed vs. inferred, and do not accept a hallucinated or vague list.

**Give the human clear, patient instructions for running each prompt** — which Perplexity mode to use if relevant, that they should run one prompt, paste the full output back, then you'll give them the next prompt (don't dump both prompts on them at once expecting them to run both blind). Some people find pasting into Perplexity and getting the raw output back to you fiddly — walk them through it step by step (e.g. "open a new Perplexity chat, paste this in, wait for the full response, copy everything it says, paste it back here").

### Step 3 — Verify the topic list before treating it as final
Once the human brings back Prompt B's output, **independently verify at least the structure** before accepting it — the same way the original Algebra Term 1 list was checked against a live-fetched Siyavula table of contents. If Perplexity's response admits it couldn't access a source document directly (this happens — flag it, don't ignore it), attempt to verify the resulting list against a real, fetchable source (Siyavula's site is generally fetchable; CAPS PDFs sometimes are not). If you cannot verify a list at all, say so explicitly to the human rather than silently treating an unverified list as ground truth — accuracy of the topic list matters more than anything else in this whole process, since every topic built after it depends on it being right.

### Step 4 — Save both research outputs as durable files
Follow the existing pattern: create a new file under `.planning/research/` (e.g. `LIBRARY_<SUBJECT>_RESEARCH.md`) capturing both the subject-teaching-methodology research and the verified topic list, structured similarly to how `LIBRARY_TEACHING_EXECUTION_PLAN.md` Part D captured Topic 1's research. This is not optional — future topics in the same subject, and the human's own record of the project, depend on this being written down, not just used once in conversation and discarded.

### Step 5 — For the FIRST topic in a new subject: run a topic-specific research pass too
Exactly like Topic 1 of Algebra had its own dedicated Perplexity research pass (precise scope boundaries, teaching sequence, misconception list, assessment shape) on top of the general subject-level research — the first topic of any new subject should get the same treatment before you build it, since it establishes tone/depth/structure for that subject specifically. Generate that topic-specific Perplexity prompt (same shape as the one used for "The Real Number System" — ask for coverage/sequencing/misconceptions/assessment-shape guidance, explicitly instructing Perplexity NOT to write actual lesson content or quiz questions, since content authoring stays with you).

### Step 6 — Build
Only after Steps 1–5 are complete for a subject's first topic, build it — following the `LessonContent` type, the shared rendering engine, the general methodology template, and matching the depth/rigor of the built "Real Number System" reference. Register it in `registry.ts`. Verify: typecheck clean, production build succeeds, and if you touch Supabase schema, follow this project's convention — **write SQL for the human to run by hand in Supabase Studio, never attempt to run migrations yourself.**

### Step 7 — For subsequent topics in the same subject: lighter-weight, but not zero-weight
Once a subject's teaching-methodology angle and full topic list are established (Steps 1–4 done once per subject), individual topics after the first do NOT need their own full Perplexity research pass by default — you may draft the topic's content directly using the subject-level research plus the topic list's own scoping (prerequisites, expected outcomes) as your guide, matching the established pattern from the subject's first topic. If a specific topic is unusually complex, unusually prone to misconceptions, or you're genuinely unsure how to scope it well, it's fine to run a topic-specific Perplexity pass anyway (same shape as Step 5) — use judgment, but default to moving faster once the subject's foundation is laid.

## 4. Immediate first task: finish Algebra before starting a new subject

**Algebra Term 1 already has a verified topic list (11 topics) but only Topic 1 is built.** Before touching any other subject, the immediate task is:

1. Confirm with the human that you're picking up Algebra Term 1, Topics 2–11, using the already-verified list (do not re-research it — reuse `.planning/research/LIBRARY_TEACHING_EXECUTION_PLAN.md` Part A's confirmed list and `GRADE10_MATHS_CAPS_TOPIC_LIST.md` if that file exists).
2. Because Algebra's *subject-level* teaching-methodology angle (Step 1–2's "Prompt A") was implicitly covered by the general methodology research already done (Algebra is a fairly standard symbolic-math subject, well-covered by the existing general template) — you do NOT need a separate Prompt A pass for Algebra specifically. Confirm this reasoning with the human rather than assuming it silently; if they disagree, run it.
3. For each of Topics 2–11, decide per Step 5/7 above whether it needs its own topic-specific research pass or can be authored directly from the existing topic-list scoping (each topic in the verified list already has prerequisites and expected sub-skills documented). Given these are all still Term 1 Algebra — closely related, lower novelty than a brand new subject — lean toward Step 7's lighter-weight path for most of them, reserving a dedicated research pass for any topic that's unusually misconception-prone (e.g. quadratic equations, simultaneous equations) if you judge it warranted.
4. Once Topics 2–11 of Algebra Term 1 are built and you have direct experience with how the process actually goes in practice (not just reading about it), you should have enough calibration to move to full terms/subjects more efficiently. This is expected — a slower, more careful pace for the first several topics, increasing speed as the pattern is proven out, is the intended workflow given the amount of content ahead (many subjects × multiple terms × many topics each).

## 5. Non-negotiables — do not deviate from these without asking

- **Perplexity never generates actual lesson content, worked examples, or quiz questions.** It generates *guidance* (what to cover, in what order, what misconceptions exist, what a good assessment tests). You (Claude Code) author the actual content, informed by that guidance.
- **No schema/migration changes without human-run SQL.** Read `CLAUDE.md` at the repo root for the exact convention. Never attempt to apply a migration yourself.
- **Every new topic gets registered in `registry.ts`.** An unregistered topic is a topic students can't reach.
- **Match the depth of "The Real Number System."** This is the bar. If in doubt whether something is deep enough, it probably isn't.
- **Verify, don't assume.** Typecheck, production build, and (for anything touching real student data patterns) read-only verification against actual Supabase state before calling a topic done — same discipline used for every other feature on this platform.
- **When something in this document or the linked research is ambiguous, ask the human rather than silently guessing.** A silent bad guess in a lesson template propagates into every topic built after it.
