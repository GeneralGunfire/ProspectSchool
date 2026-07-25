# Term 2 Research — Trigonometry & Functions (Grade 10)

**Source:** Perplexity deep-research pass, human-run, 2026-07-21. Two parts:
(A) verified topic list/scope, (B) online-teaching methodology for
graph-based content. Grounded in WCED Term 2 revision packs and Siyavula
Grade 10 Ch.5 (Trigonometry) and Ch.6 (Functions) — flagged inline wherever a
claim is inferred from these rather than quoted CAPS text.

**Scope decisions confirmed with the human (not silently assumed):**
- Sequence: Trig-in-triangles → Functions (linear, quadratic, hyperbolic,
  exponential) → Trig graphs & interpretation. Sources disagree on ordering
  (Siyavula does Trig-then-Functions; CAPS says order is not prescriptive) —
  this order was chosen, not the only defensible one.
- Analytical Geometry and Number Patterns (both present in WCED's literal
  Term 2 revision-pack grouping) are OUT of scope for this batch — treated as
  separate subject strands to be scoped later, mirroring how Geometry was
  already split out of the Term 1 CAPS list.

## A. Scope per topic

**Trigonometry (right-angled triangles):**
- In scope: sine/cosine/tangent ratios (SOH-CAH-TOA) for acute angles;
  similarity of triangles as the ratio justification; solving right-angled
  triangles (find a side or an angle); calculator skills (degree mode,
  inverse trig); special angles (30°/45°/60°) at standard triangles; simple
  trig equations like sinθ=k for 0°≤θ≤90°; introductory extension of ratios
  to the Cartesian plane.
- Out of scope (inferred): general solutions over 0°-360°+, Pythagorean
  identity used algebraically, compound/double angle identities,
  non-right-angled triangles (sine/cosine rule) — all Grade 11+.

**Functions (linear, quadratic, hyperbolic, exponential):**
- Linear: y=mx+c, gradient/intercept interpretation, sketching from equation.
- Quadratic: y=ax²+bx+c, axis of symmetry, turning point, intercepts
  (factorisation-based, not completing the square — that's Grade 11).
- Hyperbolic: y=k/x, asymptotes, basic shape, inverse-proportionality context.
- Exponential: y=a·b^x, asymptote, intercept, qualitative growth/decay shape.
- Out of scope (inferred): formal function notation/composition, general
  transformation theory y=af(b(x-p))+q, deep domain/range analysis for
  non-polynomial functions.

**Trigonometric graphs & interpretation:**
- In scope: basic sin/cos (and simple tan) graphs over a bounded domain
  (0°-360°), standard amplitude/period; reading values from a graph; linking
  visually to triangle-based trig; interpreting one or more function graphs
  together (intercepts, max/min, increasing/decreasing intervals,
  intersections).
- Out of scope: phase shift/amplitude changes as a formal parameter topic —
  Grade 11+.

## B. Methodology adaptation for graph-based content

Graph-based topics add cognitive/pedagogical demands beyond symbolic algebra:
dual representation coordination (equation ↔ table ↔ graph ↔ words), spatial/
holistic reasoning (shape, symmetry, asymptotes vs. isolated point values),
continuous-interval thinking (increasing/decreasing over a range, not single
points). Interactive graph manipulation (parameter sliders, point-highlight,
linked representations) is close to essential, not optional, for this content
type — this is the direct reason a shared `FunctionGraph` component was built
before any Term 2 content (see `components/lesson/FunctionGraph.tsx`) rather
than describing graphs in text only.

**Common graph-reading misconceptions to design feedback around:** treating a
graph as a literal picture of a story rather than a variable-vs-variable plot;
confusing x-intercept and y-intercept; ignoring axis scale between ticks;
treating an asymptote as a line the graph touches rather than approaches;
misreading gradient (m) as "moves the line up/down" instead of steepness, and
c as an x-intercept instead of y-intercept; assuming a hyperbola's branches
cross or touch its asymptotes; confusing amplitude with vertical shift, or
period with horizontal shift, on trig graphs.

**Worked-example adaptation:** for graph topics, a worked example should
narrate the decision sequence (choose scale → locate intercepts → mark
turning point/asymptote → draw → interpret), not just "here is the graph".
Feedback on a wrong graph-reading answer should be visual (highlight the
correct feature on the actual graph), not just textual, wherever the
rendering surface allows it.
