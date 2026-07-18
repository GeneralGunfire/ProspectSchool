// ── Validates src/lib/topicTestCatalog.ts for structural integrity ──────────
// Checks: every MCQ correctAnswer/distractor optionKey exists in its options,
// every distractor misconceptionCode exists in that topic's misconceptions.
// Run before every seed: npx tsx scripts/validateCatalog.mjs

import { TOPIC_TEST_CATALOG } from '../src/lib/topicTestCatalog.ts';

let hasErrors = false;

for (const topic of TOPIC_TEST_CATALOG) {
  const misconceptionCodes = new Set(topic.misconceptions.map((m) => m.code));
  const usedCodes = new Set();

  for (const q of topic.questions) {
    if (q.questionType === 'mcq') {
      const optionKeys = new Set((q.options ?? []).map((o) => o.key));
      if (!optionKeys.has(q.correctAnswer)) {
        console.error(`[${topic.topicKey}] Question "${q.prompt.slice(0, 50)}..." correctAnswer "${q.correctAnswer}" not in options`);
        hasErrors = true;
      }
      for (const d of q.distractors ?? []) {
        if (!optionKeys.has(d.optionKey)) {
          console.error(`[${topic.topicKey}] Question "${q.prompt.slice(0, 50)}..." distractor optionKey "${d.optionKey}" not in options`);
          hasErrors = true;
        }
        if (!misconceptionCodes.has(d.misconceptionCode)) {
          console.error(`[${topic.topicKey}] Question "${q.prompt.slice(0, 50)}..." references unknown misconception "${d.misconceptionCode}"`);
          hasErrors = true;
        }
        usedCodes.add(d.misconceptionCode);
      }
    }
  }

  const unused = [...misconceptionCodes].filter((c) => !usedCodes.has(c));
  if (unused.length > 0) {
    console.warn(`[${topic.topicKey}] ${unused.length} unused misconception(s): ${unused.join(', ')}`);
  }
}

console.log(hasErrors ? '\nFAILED — fix errors above' : '\nAll checks passed.');
process.exit(hasErrors ? 1 : 0);
