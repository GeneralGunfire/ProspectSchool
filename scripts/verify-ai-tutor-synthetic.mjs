// Verifies moderation blocking, refusal-pattern detection, and grounding-tier
// selection against constructed/synthetic cases — no real student data, no
// live Groq calls. Pure-logic test, mirrors verify-wellbeing-alerts.mjs /
// verify-risk-engine-synthetic.mjs. Logic duplicated (not imported) from
// src/lib/aiTutor/moderation.ts, logInteraction.ts's detectRefusal, and the
// grounding-tier decision in grounding.ts, for the same reason those other
// scripts duplicate rather than import: several of these files transitively
// import src/lib/supabase.ts, which reads import.meta.env (Vite-only) at
// module load time and throws under plain Node. Keep this in sync by hand if
// the source logic changes.
//
// Run with: node scripts/verify-ai-tutor-synthetic.mjs

let failures = 0;
function check(label, cond) {
  if (cond) {
    console.log(`PASS — ${label}`);
  } else {
    console.log(`FAIL — ${label}`);
    failures++;
  }
}

// ── Moderation (duplicated from src/lib/aiTutor/moderation.ts) ─────────────

const SELF_HARM_PATTERNS = [
  /\bkill (myself|me)\b/i, /\bsuicid/i, /\bself[\s-]?harm/i, /\bwant to die\b/i,
  /\bcut(ting)? myself\b/i, /\bend (my|it all)\b.{0,15}\blife\b/i,
];
const SEXUAL_CONTENT_PATTERNS = [/\bsex(ual|ually)?\b/i, /\bporn/i, /\bnude/i, /\bnsfw\b/i, /\bexplicit\b.{0,15}\bimage/i];
const VIOLENCE_PATTERNS = [/\bhow (do|can) i (make|build) a (bomb|weapon|gun)\b/i, /\bhurt (someone|somebody|another person)\b/i, /\bkill (him|her|them|someone|somebody)\b/i];
const OFF_TOPIC_ABUSE_PATTERNS = [/\b(fuck|cunt|nigger|retard)\b/i];
const CATEGORY_PATTERNS = [
  ['self_harm', SELF_HARM_PATTERNS], ['sexual_content', SEXUAL_CONTENT_PATTERNS],
  ['violence', VIOLENCE_PATTERNS], ['off_topic_abuse', OFF_TOPIC_ABUSE_PATTERNS],
];
function moderateInput(text) {
  for (const [category, patterns] of CATEGORY_PATTERNS) {
    if (patterns.some((p) => p.test(text))) return { blocked: true, category };
  }
  return { blocked: false };
}

check('blocks self-harm phrasing', moderateInput("I don't want to be here, I want to kill myself").blocked === true);
check('blocks explicit sexual request', moderateInput('send me a nude image').blocked === true);
check('blocks weapon-building request', moderateInput('how can i build a bomb for a project').blocked === true);
check('does NOT block ordinary maths question', moderateInput('can you explain how to factorise x^2 - 9?').blocked === false);
check('does NOT block a Physical Sciences question about "force"', moderateInput('why does a moving object keep moving without force?').blocked === false);

// ── Refusal-pattern detection (duplicated from src/lib/aiTutor/logInteraction.ts) ─

function detectRefusal(reply) {
  return /can't give you the direct solution|can not give you the direct solution|cannot give you the direct solution/i.test(reply);
}

const refusalReply = "I can't give you the direct solution to this assessed question, but I can help you learn the skill so you can solve it yourself. Let's start with what you already know about factorising.";
const normalReply = "Great question! Let's think about what happens when you multiply two binomials together.";

check('detects refusal pattern in a real refusal reply', detectRefusal(refusalReply) === true);
check('does NOT flag a normal scaffolding reply as a refusal', detectRefusal(normalReply) === false);

// ── question_meta -> refusal requirement (structural check, research section 7) ──
// Simulates the rule "if is_graded_assignment is true, the system prompt must
// carry that flag through to the model" — checked at the prompt-construction
// level here since we can't call the live Groq API in a script.

function buildQuestionMetaBlock(meta) {
  if (!meta) return '';
  return `<question_meta>\nis_graded_assignment: ${meta.isGradedAssignment}\nis_past_paper: ${meta.isPastPaper}\n</question_meta>`;
}

const gradedBlock = buildQuestionMetaBlock({ isGradedAssignment: true, isPastPaper: false });
const ungradedBlock = buildQuestionMetaBlock({ isGradedAssignment: false, isPastPaper: false });
check('graded-assignment question_meta block correctly flags true', gradedBlock.includes('is_graded_assignment: true'));
check('ungraded question_meta block correctly flags false', ungradedBlock.includes('is_graded_assignment: false'));
check('no question_meta produces no block (ordinary tutoring, no refusal context)', buildQuestionMetaBlock(null) === '');

// ── Grounding tier selection (structural check, mirrors grounding.ts's tiered logic) ──

function pickGroundingMode({ hasLibraryLesson, hasFallbackEntry }) {
  if (hasLibraryLesson) return 'current_page';
  if (hasFallbackEntry) return 'fallback_topic_list';
  return 'general_knowledge';
}

check('uses current_page when a real library lesson exists', pickGroundingMode({ hasLibraryLesson: true, hasFallbackEntry: true }) === 'current_page');
check('falls back to fallback_topic_list when no library lesson but a fallback entry exists', pickGroundingMode({ hasLibraryLesson: false, hasFallbackEntry: true }) === 'fallback_topic_list');
check('falls back to general_knowledge when neither exists (e.g. subject outside platform scope)', pickGroundingMode({ hasLibraryLesson: false, hasFallbackEntry: false }) === 'general_knowledge');

console.log(failures === 0 ? '\nAll synthetic AI Tutor checks passed.' : `\n${failures} synthetic check(s) failed — see above.`);
process.exit(failures === 0 ? 0 : 1);
