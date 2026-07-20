// ── AI Tutor input moderation — pre-filter, runs before any Groq call ────────
// This is a minor-facing chat product (research section 7). The system prompt's
// refusal/scope rules are the second line of defense; this module is the first:
// a cheap, deterministic, local pre-filter that blocks a message from ever
// reaching the model for clearly unsafe/inappropriate categories, and logs the
// event to ai_tutor_flagged_content for human review (see logInteraction.ts).
//
// This is NOT a replacement for the system prompt's scope rules — it only
// catches blunt, keyword-detectable cases cheaply and without a round-trip.
// Subtler misuse (e.g. a rephrased homework question) is handled by the
// refusal-pattern system prompt (systemPrompt.ts), not here.

export type FlagCategory = 'self_harm' | 'sexual_content' | 'violence' | 'off_topic_abuse' | 'other';

export interface ModerationResult {
  blocked: boolean;
  category?: FlagCategory;
}

// Keyword lists are deliberately blunt substring/regex matches, not exhaustive
// classifiers — a lightweight first line of defense appropriate for a
// demo-scale app, not a production safety system. False negatives are expected
// and are backstopped by the system prompt; false positives are acceptable
// (the UI response for a block is a gentle redirect, not an accusatory one).

const SELF_HARM_PATTERNS = [
  /\bkill (myself|me)\b/i,
  /\bsuicid/i,
  /\bself[\s-]?harm/i,
  /\bwant to die\b/i,
  /\bcut(ting)? myself\b/i,
  /\bend (my|it all)\b.{0,15}\blife\b/i,
];

const SEXUAL_CONTENT_PATTERNS = [
  /\bsex(ual|ually)?\b/i,
  /\bporn/i,
  /\bnude/i,
  /\bnsfw\b/i,
  /\bexplicit\b.{0,15}\bimage/i,
];

const VIOLENCE_PATTERNS = [
  /\bhow (do|can) i (make|build) a (bomb|weapon|gun)\b/i,
  /\bhurt (someone|somebody|another person)\b/i,
  /\bkill (him|her|them|someone|somebody)\b/i,
];

const OFF_TOPIC_ABUSE_PATTERNS = [
  /\b(fuck|cunt|nigger|retard)\b/i, // targeted slurs/extreme profanity aimed at the bot or others
];

const CATEGORY_PATTERNS: [FlagCategory, RegExp[]][] = [
  ['self_harm', SELF_HARM_PATTERNS],
  ['sexual_content', SEXUAL_CONTENT_PATTERNS],
  ['violence', VIOLENCE_PATTERNS],
  ['off_topic_abuse', OFF_TOPIC_ABUSE_PATTERNS],
];

export function moderateInput(text: string): ModerationResult {
  for (const [category, patterns] of CATEGORY_PATTERNS) {
    if (patterns.some((p) => p.test(text))) {
      return { blocked: true, category };
    }
  }
  return { blocked: false };
}

// Shown to the student in place of a normal chat reply when blocked. Self-harm
// gets a distinct, resource-pointing message rather than a generic redirect —
// mirrors the wellbeing feature's safety-first framing (src/lib/wellbeing.ts).
export function moderationRefusalMessage(category: FlagCategory): string {
  if (category === 'self_harm') {
    return "I'm not able to help with that here, but please talk to someone you trust right now — a teacher, school counsellor, or family member. If you're in immediate danger, contact your local emergency services. I'm here for schoolwork whenever you're ready.";
  }
  return "I can't help with that here — I'm only set up for schoolwork questions. Let's get back to your subject whenever you're ready.";
}
