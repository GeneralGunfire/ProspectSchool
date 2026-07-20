// ── AI Tutor practice-question generation (research section 5) ───────────────
// Single-call generate + self-check JSON pattern, constrained to producing a
// close variation of a vetted existing Topic Test question — NOT open-ended
// generation. This is the research doc's explicit recommendation for this
// scope: "take a vetted source question from the existing Topic Test bank and
// produce 1-2 close variations... while preserving the same underlying concept
// and misconception mapping".
//
// Storage: ephemeral/session-scoped, not persisted as its own table (see the
// reasoning in .planning/sql/2026-07-20_ai_tutor.sql's header). The generated
// item is only kept in the chat message's metadata for that turn.

import { groqChat } from './groqClient';
import type { Question } from '../topicTestsV2';

export interface GeneratedPracticeItem {
  question: string;
  options: string[];
  correctIndex: number;
  rationale: string;
  checks: {
    exactlyOneCorrect: boolean;
    distractorsPlausible: boolean;
    noObviousCues: boolean;
    alignedToConcept: string;
  };
}

const GENERATION_SYSTEM_PROMPT = `
You generate ONE close variation of a given vetted multiple-choice question for
a South African CAPS high school student. Change surface details (numbers,
names, context) but preserve the exact same underlying concept and the exact
same misconception the original distractors were designed to catch.

Then self-check your own generated item against this checklist, honestly:
- exactlyOneCorrect: is there exactly one unambiguously correct option?
- distractorsPlausible: are the wrong options plausible mistakes, not silly?
- noObviousCues: does the correct answer avoid being obviously longer/different
  in form from the distractors (a "tell")?
- alignedToConcept: name, in a few words, the specific concept this question
  tests.

Respond with ONLY a JSON object, no other text, in exactly this shape:
{
  "question": "...",
  "options": ["...", "...", "...", "..."],
  "correct_index": 0,
  "rationale": "...",
  "checks": {
    "exactly_one_correct": true,
    "distractors_plausible": true,
    "no_obvious_cues": true,
    "aligned_to_concept": "..."
  }
}

If you cannot produce an item that passes all four checks honestly, still
return your best attempt but set the failing check(s) to false — do not lie
about the checks.
`.trim();

export async function generatePracticeVariation(sourceQuestion: Question): Promise<GeneratedPracticeItem | null> {
  if (sourceQuestion.question_type !== 'mcq' || !sourceQuestion.options) return null;

  const userPrompt = `Vetted source question:\n${sourceQuestion.prompt}\nOptions: ${sourceQuestion.options
    .map((o) => `${o.key}) ${o.text}`)
    .join(' ')}\nCorrect answer: ${sourceQuestion.correct_answer}\n\nGenerate one close variation now.`;

  const raw = await groqChat(
    [
      { role: 'system', content: GENERATION_SYSTEM_PROMPT },
      { role: 'user', content: userPrompt },
    ],
    { jsonMode: true, maxTokens: 600 },
  );

  let parsed: any;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  if (
    typeof parsed.question !== 'string' ||
    !Array.isArray(parsed.options) ||
    typeof parsed.correct_index !== 'number' ||
    typeof parsed.rationale !== 'string' ||
    !parsed.checks
  ) {
    return null;
  }

  // Reject items that fail their own self-check rather than surfacing a known
  // bad item to the student (research section 5: "only return a passing item").
  const checks = parsed.checks;
  if (!checks.exactly_one_correct || !checks.distractors_plausible) return null;

  return {
    question: parsed.question,
    options: parsed.options,
    correctIndex: parsed.correct_index,
    rationale: parsed.rationale,
    checks: {
      exactlyOneCorrect: checks.exactly_one_correct,
      distractorsPlausible: checks.distractors_plausible,
      noObviousCues: checks.no_obvious_cues ?? false,
      alignedToConcept: checks.aligned_to_concept ?? '',
    },
  };
}
