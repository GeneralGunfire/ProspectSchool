# Term 3 & 4 Research — Statistics/Probability/Finance & Patterns/Transformations

**Source:** Perplexity deep-research pass, human-run, 2026-07-22. Grounded in
standard CAPS-aligned Grade 10 implementations (WCED revision packs, common
planners, textbook structures) — the human explicitly flagged that live
CAPS/ATP PDF access wasn't available for this pass, so more of this is
textbook-inferred than the Term 1/2 passes. Treated as working anchors, not
verbatim CAPS quotation, per the human's own framing.

**Scope decisions confirmed with the human (not silently assumed):**
- Term 3's "2D trig applications" topic is SKIPPED — it duplicates Term 2
  Topic 2 (Solving Right-Angled Triangles), which already covers elevation/
  depression and multi-step applications.
- Term 4 revision/exam-prep is OUT of scope as a library topic, per the
  research's own recommendation — a mastery-gated spaced-practice topic
  doesn't fit a "reuse everything, timed practice" revision period. Left for
  a future cross-topic exam-prep module, not built here.
- Three new shared components (BoxPlot, VennDiagram, TreeDiagram) were built
  before content, mirroring how the Term 2 FunctionGraph gap was handled.

## Term 3 topics built (6, in order)

1. **Measures of Central Tendency & Spread** — mean, median, mode, range;
   grouped vs. ungrouped data. In scope: these four measures only. Out of
   scope (inferred): variance/standard deviation, formal normal distribution
   — Grade 11/12.
2. **Box-and-Whisker Plots** — five-number summary, constructing/reading box
   plots, comparing two distributions. Uses the new `BoxPlot` component.
3. **Probability Basics & Venn Diagrams** — sample space, single-event
   probability, union/intersection/complement, two-set Venn problems. Uses
   the new `VennDiagram` component.
4. **Tree Diagrams & Combined Events** — sequential events with/without
   replacement, combined-path probability. Uses the new `TreeDiagram`
   component. Out of scope (inferred): formal conditional probability,
   3+ stage combinatorics — Grade 11/12.
5. **Simple and Compound Interest** — I=Prn, A=P(1+i)^n, comparing growth.
6. **Hire Purchase & Financial Applications** — deposit + instalments, total
   cost of credit vs. cash, reading financial statements/tables.

## Term 4 topics built (3, in order)

1. **Arithmetic Sequences** — recognising constant-difference patterns,
   general term Tn=a+(n-1)d, off-by-one error prevention via testing the
   formula against known terms.
2. **Geometric Sequences** — recognising constant-ratio patterns, general
   term Tn=ar^(n-1), contrastive tasks distinguishing arithmetic vs.
   geometric growth.
3. **Function Transformations and Inverses** — light-touch per the research
   (textbook-variable scope): vertical/horizontal shifts, reflections,
   simple inverses via swapping x/y and reflecting about y=x. Reuses the
   Term 2 `FunctionGraph` component, showing original and transformed/
   inverse graphs together.

## Methodology notes carried into the builds

**Statistics/Probability/Finance (Term 3):** worked examples narrate the full
representation chain (raw data → table → graph → summary → interpretation for
stats; description → notation → diagram → calculation for probability;
narrative → parameter identification → formula → interpretation for
finance). Deliberately designed tasks to surface the representativeness
heuristic and gambler's fallacy in probability feedback. Financial word
problems get an explicit "identify P, i, n first" scaffold step, distinct
from Term 1's general word-problem translation approach.

**Patterns/Transformations (Term 4):** worked examples always test a derived
general-term formula against at least two known terms (n=1, n=2) to catch
off-by-one errors, per the research's specific recommendation. Sequence
topics show 4-5 terms before asking for a general rule. Transformations show
original and transformed graphs on the same axes with colour-coded
before/after feature labels, extending (not replacing) the Term 2 graphing
pattern.
