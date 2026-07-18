# Grade 10 Mathematics — Complete CAPS Topic List (Terms 1-4)

Source: Perplexity deep research pass, 2026-07-18. Cross-referenced against the
official CAPS document / Annual Teaching Plan (ATP), Siyavula's Grade 10 textbook,
and WCED Teaching Plans. ATP takes priority over textbook sequencing where they
disagree (noted per term below).

**Status:** Master topic backlog. This is the authoritative topic-key list for
`src/lib/topicTestCatalog.ts` — one topic per row below becomes one `CatalogTopic`
entry once questions are researched and authored for it.

**Total: 58 discrete sub-topics across 4 terms**, each scoped narrow enough to
support a 10-14 question diagnostic test.

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
| `EuclideanGeometryPointsAndLines` | Euclidean Geometry: Points, Lines, and Angles | Angle properties (adjacent, vertically opposite, corresponding, alternate) | 1 week |
| `EuclideanGeometryTrianglesAndQuadrilaterals` | Euclidean Geometry: Properties of Triangles and Quadrilaterals | Isosceles/equilateral/right-angled triangles; parallelograms, rectangles, squares, rhombi | 1 week |
| `EuclideanGeometryCircleGeometry` | Euclidean Geometry: Circle Geometry (Terminology and Basic Theorems) | Circle terminology, tangent, chord, basic angle properties | 1 week |
| `AnalyticalGeometryDistanceAndMidpoint` | Analytical Geometry: Distance and Midpoint Formulae | Distance between two points, midpoint of a line segment | 1 week |
| `AnalyticalGeometryGradientAndEquationOfLine` | Analytical Geometry: Gradient and Equation of a Line | Gradient given two points; y=mx+c or y-y₁=m(x-x₁) | 1 week |
| `AnalyticalGeometryParallelAndPerpendicularLines` | Analytical Geometry: Parallel and Perpendicular Lines | Conditions: parallel (m₁=m₂), perpendicular (m₁×m₂=-1) | 1 week |

Source tension: CAPS ATP places Functions before Trigonometry; some textbooks
(incl. Siyavula) reverse this. ATP sequencing used. Euclidean Geometry proofs
are gradual in Grade 10 — focus is properties/basic riders, not full rigor
(that intensifies in Grades 11-12).

---

## Term 3 (14 sub-topics, ~9 weeks)

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
| `EuclideanGeometrySimilarity` | Euclidean Geometry: Similarity (Proportionality Theorems) | Triangle similarity, proportionality theorems | 1.5 weeks |
| `EuclideanGeometryMidpointTheorem` | Euclidean Geometry: Midpoint Theorem | Proving and applying the midpoint theorem | 0.5 week |
| `EuclideanGeometryRiderProblems` | Euclidean Geometry: Rider Problems and Proofs | Multi-step geometry problems requiring proofs/justification | 1 week |
| `AnalyticalGeometryCircles` | Analytical Geometry: Equation of a Circle | (x-a)²+(y-b)²=r², centre (a,b), radius r | 1 week |
| `AnalyticalGeometryTangentsToCircles` | Analytical Geometry: Tangents to Circles | Equations of tangents to circles at a given point | 1 week |
| `FunctionsTransformationsAndInverses` | Functions: Transformations and Inverse Functions | Reflecting graphs, inverse functions (linear, quadratic) | 1.5 weeks |
| `NumberPatternsGeometricSequences` | Number Patterns: Geometric Sequences | Identifying/extending geometric sequences, Tn = ar^(n-1) | 1 week |
| `NumberPatternsSumOfArithmeticSeries` | Number Patterns: Sum of Arithmetic Series | Sn = n/2[2a+(n-1)d] | 1 week |
| `NumberPatternsSumOfGeometricSeries` | Number Patterns: Sum of Geometric Series | Sn = a(1-r^n)/(1-r), \|r\|<1 case included | 1 week |
| `RevisionAndExamPreparation` | Revision and Exam Preparation | Comprehensive revision, past-paper practice (not a diagnostic-test topic) | 2-3 weeks |

Note: Term 4 is shorter, heavily exam-prep weighted. Euclidean Geometry riders
and similarity proofs are typically the hardest Grade 10 topics.

---

## Summary

| Term | Sub-Topics | Weeks |
|---|---|---|
| Term 1 | 17 | 9 |
| Term 2 | 17 | 9 |
| Term 3 | 14 | 9 |
| Term 4 | 10 (+ revision) | 8-9 |
| **Total** | **58 teachable sub-topics** | ~36-38 |

## Known disagreements between sources (resolved in favor of official ATP)

1. **Functions vs. Trigonometry order (Term 2):** ATP does Functions first; Siyavula does Trigonometry first. ATP wins.
2. **Euclidean Geometry rigor:** Grade 10 = properties + basic riders, not full proof rigor (that's Grade 11-12).
3. **Trig reciprocal ratios (sec/cosec/cot):** In CAPS but lightly assessed by some schools — kept as its own topic since it's in the official curriculum.
4. **Financial Mathematics timing:** Bulk in Term 3 per most ATPs, though some spread it into Term 4.
5. **Analytical Geometry circles:** Some sources put this in Term 2; CAPS ATP places it in Term 4 — ATP wins.

## Open decision

The pilot topic `OneVariableLinearEquations` (live, seeded, already has 14
research-grounded questions) is broader than this list's three-way split
(`SolvingLinearEquationsSingleVariable` / `...Brackets` / `...VariableBothSides`).
Decide before mass-producing: keep the pilot as its own broader topic (simplest —
no rework needed), or retroactively split it to match this finer list (more
consistent granularity across all 58, more work).
