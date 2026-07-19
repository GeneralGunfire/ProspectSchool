# Grade 10 Mathematics (Algebra/Non-Geometry) — Complete CAPS Topic List (Terms 1-4)

Source: Perplexity deep research pass, 2026-07-18. Cross-referenced against the
official CAPS document / Annual Teaching Plan (ATP), Siyavula's Grade 10 textbook,
and WCED Teaching Plans. ATP takes priority over textbook sequencing where they
disagree (noted per term below).

**IMPORTANT — Geometry moved to a separate list.** All Euclidean Geometry,
Analytical Geometry, and Measurement topics have been removed from this file.
Geometry is tracked as its own subject (`subjectCode: 'geometry'`, matching the
real, already-existing `geometry` subject in the platform's `subjects` table —
distinct from `math`/"Algebra"). See `GRADE10_GEOMETRY_CAPS_TOPIC_LIST.md` for
the authoritative Geometry topic breakdown (16 sub-topics across Terms 2-4, none
in Term 1). Trigonometry stays in this file/on `subjectCode: 'math'` — it is not
treated as Geometry for subject-separation purposes.

**Status:** Master topic backlog for the Algebra subject. This is the
authoritative topic-key list for `src/lib/topicTestCatalog.ts` (subjectCode:
'math' entries) — one topic per row below becomes one `CatalogTopic` entry once
questions are researched and authored for it.

**Total: 58 discrete sub-topics across 4 terms** in the original combined
breakdown; the Geometry-topic rows below are superseded by the dedicated
Geometry list and should not be re-added here.

---

## Term 1 (17 sub-topics, ~9 weeks)

| Topic Key | Label | Description | CAPS Periods |
|---|---|---|---|
| `ExponentsLawsAndSimplification` | Exponents: Laws and Simplification | Revise/extend exponent laws (Gr 8-9), integer exponents, simplifying expressions | 1 week |
| `ExponentsRationalExponents` | Exponents: Rational (Fractional) Exponents | Rational exponents, converting between exponential and radical form | 1 week |
| `ExponentsEquations` | Exponents: Solving Exponential Equations | Solving equations where the variable is in the exponent (e.g. 2^x = 8) | 1 week |
| `SurdsIntroductionAndLaws` | Surds: Introduction and Simplification | Definition of surds, simplifying surds, basic surd laws | 1 week |
| `SurdsRationalisingDenominators` | Surds: Rationalising Denominators | Rationalising denominators with single-term and binomial surds | 1 week |
| `NumberPatternsArithmeticSequences` | Number Patterns: Arithmetic Sequences | Identifying/extending arithmetic sequences, general term Tn = a + (n-1)d | 1 week |
| `NumberPatternsQuadraticSequences` | Number Patterns: Quadratic Sequences | Identifying quadratic sequences (constant 2nd difference), Tn = an²+bn+c | 1 week |
| `AlgebraicExpressionsRevision` | Algebraic Expressions: Revision and Factorisation | Factorising trinomials, difference of squares, cubes, grouping | 1 week |
| `AlgebraicFractionsSimplification` | Algebraic Fractions: Simplification and Operations | Simplifying, adding, subtracting, multiplying, dividing algebraic fractions | 1 week |
| `SolvingLinearEquationsSingleVariable` | Solving Linear Equations: Single-Step and Two-Step | Isolating variables using addition/subtraction and multiplication/division | 1 week |
| `SolvingLinearEquationsBrackets` | Solving Linear Equations: Equations with Brackets | Distributive property, equations with brackets (e.g. 3(x+2)=21) | 1 week |
| `SolvingLinearEquationsVariableBothSides` | Solving Linear Equations: Variable on Both Sides | Rearranging/solving equations with x on both sides (e.g. 5x+2=2x+11) | 1 week |
| `SolvingLinearEquationsWordProblems` | Solving Linear Equations: Word Problems and Applications | Translating real-world problems into equations and solving | 1 week |
| `SolvingLinearInequalitiesNumberLine` | Solving Linear Inequalities: Single Variable and Number Line | Solving and representing inequalities on a number line | 1 week |
| `SolvingLinearInequalitiesCompound` | Solving Linear Inequalities: Compound Inequalities | Solving/representing compound inequalities (e.g. -3 < x ≤ 5) | 1 week |
| `SolvingSimultaneousEquationsAlgebraic` | Solving Simultaneous Equations: Algebraic Methods | Solving by substitution and elimination | 1.5 weeks |
| `SolvingSimultaneousEquationsGraphical` | Solving Simultaneous Equations: Graphical Methods | Solving by sketching and finding intersection points | 0.5 week |

**Note:** `OneVariableLinearEquations` (the pilot topic, already live) roughly maps
to `SolvingLinearEquationsSingleVariable` + `SolvingLinearEquationsBrackets` +
`SolvingLinearEquationsVariableBothSides` combined — the pilot used a broader
grouping than this finer breakdown. Decide whether to keep pilot as-is or
eventually split it to match this list exactly (see open decision at bottom).

Source tension: Siyavula groups Exponents and Surds together (Ch 2); CAPS treats
them as distinct with separate assessment weightings (2 weeks Exponents, 1 week
Surds per official ATP).

---

## Term 2 (17 sub-topics, ~9 weeks)

| Topic Key | Label | Description | CAPS Periods |
|---|---|---|---|
| `FunctionsIntroductionAndNotation` | Functions: Introduction and Notation | Definition of functions, function notation f(x), domain and range | 1 week |
| `FunctionsLinearFunctions` | Functions: Linear Functions (Straight Lines) | Graphing y=mx+c, gradient/y-intercept, effects of m and c | 1.5 weeks |
| `FunctionsQuadraticFunctions` | Functions: Quadratic Functions (Parabolas) | Graphing y=ax²+q and y=a(x+p)²+q, parameters, turning points | 2 weeks |
| `FunctionsHyperbolicFunctions` | Functions: Hyperbolic Functions (Rectangular Hyperbolas) | Graphing y=a/x+q, asymptotes, effects of parameters | 1 week |
| `FunctionsExponentialFunctions` | Functions: Exponential Functions | Graphing y=ab^x+q (b>0), asymptotes, effects of parameters | 1 week |
| `FunctionsComparingGraphs` | Functions: Comparing and Interpreting Graphs | Comparing transformations across linear/quadratic/hyperbolic/exponential | 1 week |
| `TrigonometryRatiosRightAngledTriangles` | Trigonometry: Primary Ratios (sin, cos, tan) | Defining/using sin, cos, tan in right-angled triangles | 1 week |
| `TrigonometryReciprocalRatios` | Trigonometry: Reciprocal Ratios (sec, cosec, cot) | Introduction to reciprocal ratios (in CAPS, not always heavily assessed) | 0.5 week |
| `TrigonometrySpecialAngles` | Trigonometry: Special Angles (0°,30°,45°,60°,90°) | Exact trig values at special angles without a calculator | 1 week |
| `TrigonometrySolvingRightAngledTriangles` | Trigonometry: Solving Right-Angled Triangles | Finding unknown sides/angles in right-angled triangles | 1 week |
| `TrigonometryApplicationsHeightsAndDistances` | Trigonometry: Applications (Heights and Distances) | Word problems: angles of elevation and depression | 1 week |

Note: Term 2 Geometry topics (Euclidean Geometry, Analytical Geometry) are now
tracked in `GRADE10_GEOMETRY_CAPS_TOPIC_LIST.md`, not here.

Source tension: CAPS ATP places Functions before Trigonometry; some textbooks
(incl. Siyavula) reverse this. ATP sequencing used.

---

## Term 3 (10 sub-topics — revised breakdown, superseding the original 14-topic version below)

**Revision note:** this section was originally researched as 14 topics (Trig ×4,
Financial Math ×4, Statistics ×4, Probability ×2, listed further below for
record-keeping). The actual content batch received (topicTests.txt, "TERM 3 -
BATCH 8/9") used a different, real breakdown — Data Handling split into 3
topics, Probability split into 3, Financial Mathematics split into 3 — and per
project decision this file was updated to match the received content rather
than the reverse. Trigonometry topics (Reduction Formulae, Trig Equations,
Sine/Cosine Rules, Area of Triangle) were NOT covered in the received batch and
still need research separately — see the Perplexity prompt already prepared
for Term 3 Trigonometry.

| Topic Key | Label | Description |
|---|---|---|
| `DataHandlingCollectingAndOrganising` | Data Handling: Collecting and Organising Data | Primary vs. secondary data, population vs. sample, frequency tables, data types (categorical/discrete/continuous) |
| `DataHandlingRepresentingGraphically` | Data Handling: Representing Data Graphically | Choosing appropriate graph types (bar, histogram, pie, line, scatter), reading scales |
| `DataHandlingMeasuresOfCentralTendency` | Data Handling: Measures of Central Tendency | Mean, median, mode; range; effect of outliers |
| `DataHandlingMeasuresOfSpread` | Data Handling: Measures of Spread | Quartiles, IQR, standard deviation, box-and-whisker plots |
| `ProbabilityIntroductionAndBasicConcepts` | Probability: Introduction and Basic Concepts | Probability scale (0-1), theoretical vs. experimental probability, basic calculations |
| `ProbabilityTwoWayTablesAndVennDiagrams` | Probability: Two-Way Tables and Venn Diagrams | Union/intersection, complement, addition rule P(A∪B)=P(A)+P(B)-P(A∩B) |
| `ProbabilityTreeDiagramsAndCombinedEvents` | Probability: Tree Diagrams and Combined Events | Independent/dependent events, with/without replacement, multiplication rule |
| `FinancialMathematicsSimpleAndCompoundInterest` | Financial Mathematics: Simple and Compound Interest | SI=P×r×t vs. A=P(1+r)^t, comparing growth |
| `FinancialMathematicsHirePurchaseAndLoans` | Financial Mathematics: Hire Purchase and Loans | Deposit + instalments, total cost of credit vs. cash |
| `FinancialMathematicsBudgetingAndTariffs` | Financial Mathematics: Budgeting and Tariffs | Income/expenses, fixed vs. variable costs, tariff table interpretation |

### Original 14-topic version (superseded, kept for reference only)

| Topic Key | Label | Description | CAPS Periods |
|---|---|---|---|
| `TrigonometryReductionFormulae` | Trigonometry: Reduction Formulae | sin(90°-θ), cos(90°-θ) etc. to find trig values in all four quadrants | 1 week |
| `TrigonometryTrigonometricEquations` | Trigonometry: Simple Trigonometric Equations | Solving e.g. sinθ=0.5, cosθ=-1, tanθ=√3 (0°≤θ≤360°) | 1 week |
| `TrigonometrySineAndCosineRules` | Trigonometry: Sine and Cosine Rules (Non-Right-Angled Triangles) | Sine rule (a/sinA=b/sinB), cosine rule (c²=a²+b²-2ab·cosC) | 1.5 weeks |
| `TrigonometryAreaOfTriangle` | Trigonometry: Area of a Triangle (½ab·sinC) | Area of non-right-angled triangles via trigonometry | 0.5 week |
| `FinancialMathematicsSimpleInterest` | Financial Mathematics: Simple Interest | A=P(1+in), related problems | 1 week |
| `FinancialMathematicsCompoundInterest` | Financial Mathematics: Compound Interest | A=P(1+i)^n, comparing with simple interest | 1.5 weeks |
| `FinancialMathematicsDepreciation` | Financial Mathematics: Depreciation | Straight-line and reducing-balance depreciation | 1 week |
| `FinancialMathematicsTimelineAndNominalRates` | Financial Mathematics: Timelines and Nominal/Effective Rates | Converting nominal/effective rates, timelines for multi-period problems | 1 week |
| `StatisticsMeasuresOfCentralTendency` | Statistics: Measures of Central Tendency (Mean, Median, Mode) | Mean/median/mode for grouped and ungrouped data | 1 week |
| `StatisticsMeasuresOfDispersion` | Statistics: Measures of Dispersion (Range, IQR, Variance, Std Dev) | Range, interquartile range, variance, standard deviation | 1.5 weeks |
| `StatisticsFiveNumberSummaryAndBoxPlots` | Statistics: Five-Number Summary and Box-and-Whisker Plots | Constructing/interpreting box plots, identifying outliers | 1 week |
| `StatisticsOgiveAndHistogramInterpretation` | Statistics: Ogives and Histograms (Interpretation) | Reading/interpreting cumulative frequency graphs and histograms | 1 week |
| `ProbabilityBasicConceptsAndVennDiagrams` | Probability: Basic Concepts and Venn Diagrams | Sample space, events, mutually exclusive/complementary events, Venn diagrams | 1 week |
| `ProbabilityAdditionAndProductRules` | Probability: Addition and Product Rules | P(A or B)=P(A)+P(B)-P(A and B); P(A and B) for independent events | 1 week |

Note: Financial Mathematics is commonly under-documented in casual summaries but
is core CAPS content (4-5 weeks in Term 3). Statistics introduces variance/std
dev for the first time in Grade 10.

---

## Term 4 (10 sub-topics + revision, ~8-9 weeks)

| Topic Key | Label | Description | CAPS Periods |
|---|---|---|---|
| `FunctionsTransformationsAndInverses` | Functions: Transformations and Inverse Functions | Reflecting graphs, inverse functions (linear, quadratic) | 1.5 weeks |
| `NumberPatternsGeometricSequences` | Number Patterns: Geometric Sequences | Identifying/extending geometric sequences, Tn = ar^(n-1) | 1 week |
| `NumberPatternsSumOfArithmeticSeries` | Number Patterns: Sum of Arithmetic Series | Sn = n/2[2a+(n-1)d] | 1 week |
| `NumberPatternsSumOfGeometricSeries` | Number Patterns: Sum of Geometric Series | Sn = a(1-r^n)/(1-r), \|r\|<1 case included | 1 week |
| `RevisionAndExamPreparation` | Revision and Exam Preparation | Comprehensive revision, past-paper practice (not a diagnostic-test topic) | 2-3 weeks |

Note: Term 4 Geometry topics (Euclidean Geometry similarity/midpoint/riders,
Analytical Geometry circles/tangents) and Measurement are now tracked in
`GRADE10_GEOMETRY_CAPS_TOPIC_LIST.md`, not here.

---

## Summary (this file — Algebra/Trigonometry only, Geometry excluded)

| Term | Sub-Topics | Weeks |
|---|---|---|
| Term 1 | 17 | 9 |
| Term 2 | 11 (Functions ×6, Trigonometry ×5) | ~6 |
| Term 3 | 14 | 9 |
| Term 4 | 7 (+ revision) | ~5.5 |
| **Total (this file)** | **49 teachable sub-topics** | — |

Geometry (16 sub-topics: Term 2 ×11, Term 3 ×1, Term 4 ×4) tracked separately —
see `GRADE10_GEOMETRY_CAPS_TOPIC_LIST.md`. Combined total across both files: 65
teachable sub-topics (was reported as 58 before Geometry was separated out and
re-researched at finer granularity).

## Known disagreements between sources (resolved in favor of official ATP)

1. **Functions vs. Trigonometry order (Term 2):** ATP does Functions first; Siyavula does Trigonometry first. ATP wins.
2. **Trig reciprocal ratios (sec/cosec/cot):** In CAPS but lightly assessed by some schools — kept as its own topic since it's in the official curriculum.
3. **Financial Mathematics timing:** Bulk in Term 3 per most ATPs, though some spread it into Term 4.

## Open decision

The pilot topic `OneVariableLinearEquations` (live, seeded, already has 14
research-grounded questions) is broader than this list's three-way split
(`SolvingLinearEquationsSingleVariable` / `...Brackets` / `...VariableBothSides`).
Decide before mass-producing: keep the pilot as its own broader topic (simplest —
no rework needed), or retroactively split it to match this finer list (more
consistent granularity across all 58, more work).
