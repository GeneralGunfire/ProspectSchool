# Physical Sciences Research — Subject-Level Methodology & Terms 1-2 Topic List

**Source:** Perplexity deep-research pass, human-run, 2026-07-23. Prompt A
(methodology) and Prompt B (Terms 1-2 topic list) run together. Grounded in
a Term-organised Grade 10 Physical Sciences resource mapped to CAPS ATP
content, plus CAPS document/ATP references — flagged inline wherever
inferred rather than quoted directly. Subject id confirmed as `phys-sci` in
`src/features/study/data/subjects.ts`.

## Term placement

- **Term 1 (Physics only)**: Waves, Sound and Light (transverse pulses,
  transverse waves, longitudinal/sound waves, EM spectrum); Electrostatics
  (charging by friction/contact/induction, electric field concept, no
  quantitative Coulomb's law); Introduction to Electric Circuits (components,
  basic series circuits, introductory Ohm's law).
- **Term 2 (Physics + Chemistry)**: Electric Circuits — Series and Parallel
  (V=IR calculations, current/pd behaviour in each); Matter and Materials
  Classification (pure substances, mixtures, physical vs chemical
  properties); States of Matter and Kinetic Molecular Theory; Atomic
  Structure (protons/neutrons/electrons, atomic/mass number, isotopes);
  Periodic Table (groups/periods, metals vs non-metals, basic trends);
  Chemical Bonding (introductory ionic/covalent, simple Lewis structures);
  Physical and Chemical Change; Representing Chemical Change (word/formula
  equations, basic balancing).
- Quantitative chemistry (moles, stoichiometry) and core mechanics (vectors,
  motion, Newton's laws) are Term 3, not Term 1-2 — explicitly out of scope
  for this batch.

## Structural note: three new component gaps, not just content authoring

Per Prompt A, Physical Sciences needs real engine work beyond content files:

- **Formula-based problem solving** (Ohm's law, wave equation v=fλ): the
  existing worked-example/fading-practice/quiz pattern transfers well, with
  one addition — explicit unit-tracking as its own worked-example step, and
  separating "model the scenario" (diagram) from "calculate" as distinct
  practice skill.
- **Circuit diagrams**: existing `GeometricDiagram` (points/segments/angles
  for geometry) does NOT cover circuit symbols (cells, resistors, switches,
  meters) or current-flow/series-parallel visualisation — needs a new,
  purpose-built component.
- **Particle/atomic/molecular diagrams**: also not covered by
  `GeometricDiagram` — needs a new component for particle-spacing models
  (solid/liquid/gas), atomic structure (nucleus + energy levels), and simple
  Lewis structures.
- **Chemical equation balancing**: research recommends a dedicated
  interactive "balance the equation" component (adjustable coefficients,
  live atom-count feedback) rather than forcing this into MCQ format — closer
  in spirit to `ProofShell`'s guided-interaction pattern than to a plain quiz.
- **Virtual experiments**: research confirms these are a reasonable
  substitute for teaching experimental reasoning/data analysis (variables,
  data tables, graphing, conclusions) but NOT for hands-on manipulation
  skills or lab safety — should be explicitly framed as complementary to
  real practicals, not a full replacement. Reuses existing graphing/table
  patterns rather than needing new components.

## Misconceptions flagged for design focus

Mechanics/forces (Term 3, not yet in scope): "force needed to keep motion,"
mass vs. weight confusion, balanced-forces misunderstanding. **Electric
circuits** (Term 1-2, in scope): "bulb uses up current," current/voltage
confusion, series-vs-parallel current-splitting errors. **Waves** (Term 1):
transverse vs. longitudinal confusion, naive light/sound propagation models.
**Atomic structure/bonding** (Term 2): electron/energy-level misconceptions,
ionic vs. covalent confusion, particle model vs. continuous-matter thinking.
**Chemical equations** (Term 2): treating coefficients as part of the
formula, believing balancing "causes" reactions rather than representing
conservation, physical-vs-chemical-change misclassification (e.g. dissolving
mistaken for chemical change).

**Priority flag from the research**: Electric Circuits is named most
explicitly as warranting a dedicated topic-specific research pass (given
persistent current/voltage/resistance misconceptions), with Atomic
Structure/Bonding and Waves as secondary candidates. Mechanics (Term 3) is
also flagged but out of scope for this batch.
