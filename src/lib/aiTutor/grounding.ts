// ── AI Tutor grounding layer ──────────────────────────────────────────────────
// Research section 1: "current page context" as primary grounding, no vector DB,
// no embedding service. This module is the single seam between the tutor and
// whatever the Study Library's content shape happens to be — the library is
// still being rebuilt topic-by-topic (see registry.ts), so this file is
// intentionally the ONLY place that needs to change if/when the library's
// content model changes again. Callers (aiTutor.ts) never touch library
// internals directly.
//
// Three grounding tiers, tried in order:
//   1. current_page       — a real Study Library lesson exists for this topic
//                            (registry.ts has an entry) — pull its content.
//   2. fallback_topic_list — no real lesson yet, but the hand-authored CAPS
//                            fallbackTopics.ts reference has a matching entry.
//   3. general_knowledge   — neither exists (unbuilt library AND topic/subject
//                            not in the fallback reference, e.g. a subject the
//                            student asks about that isn't even in subjects.ts
//                            scope). The tutor still answers, per product
//                            requirement, but system prompt rule 4 forces it to
//                            flag the answer as unverified general knowledge.

import { TOPIC_REGISTRY } from '../../features/study/data/library/registry';
import type { LessonContent } from '../../features/study/data/library/types';
import { fallbackTopicsFor, findFallbackTopic, searchFallbackTopics } from './fallbackTopics';
import type { GroundingContext } from './systemPrompt';

// Lazy-loaded map of topicId -> content loader, mirrored from how page
// wrappers under features/study/pages/learning/** lazy-import their content
// file today. Extend this map as new topics are authored into the registry —
// it is the one place a rebuild needs to touch to stay wired up.
const LESSON_LOADERS: Record<string, () => Promise<{ default: LessonContent } | LessonContent>> = {
  'real-number-system': () =>
    import('../../features/study/data/library/algebra/grade10/term1/realNumberSystem').then((m) => m.realNumberSystem),
};

function flattenLessonToChunks(content: LessonContent): { title: string; text: string }[] {
  const chunks: { title: string; text: string }[] = [];
  chunks.push({ title: `${content.meta.topicName} — overview`, text: content.goalSettingPrompt });
  chunks.push({ title: 'Core explanation, part 1', text: content.demonstrateChunk1.explanation });
  chunks.push({ title: 'Core explanation, part 2', text: content.demonstrateChunk2.explanation });
  if (content.misconceptions.length > 0) {
    const misconceptionText = content.misconceptions
      .map((m) => `${m.label}: ${m.errorType} ${m.principle} Correct approach: ${m.correctStep}`)
      .join(' ');
    chunks.push({ title: 'Known misconceptions', text: misconceptionText });
  }
  return chunks;
}

export interface GroundingRequest {
  subject: string;
  grade: number;
  topicKey: string | null;
  /** Free-text student question, used only for the fallback-list search path
   *  when topicKey doesn't resolve to a known entry. */
  studentQuestion?: string;
}

export async function resolveGrounding(req: GroundingRequest): Promise<GroundingContext> {
  const { subject, grade, topicKey } = req;

  // Tier 1: real library lesson, if this topic is in the registry AND has a
  // registered loader.
  if (topicKey) {
    const registryEntry = TOPIC_REGISTRY.find(
      (t) => t.subject === subject && t.grade === grade && t.topicId === topicKey,
    );
    const loader = registryEntry ? LESSON_LOADERS[registryEntry.topicId] : undefined;
    if (registryEntry && loader) {
      try {
        const mod = await loader();
        const content = 'default' in mod ? mod.default : mod;
        return { mode: 'current_page', chunks: flattenLessonToChunks(content) };
      } catch {
        // fall through to tier 2 if the dynamic import fails for any reason
      }
    }
  }

  // Tier 2: hand-authored fallback topic reference.
  if (topicKey) {
    const fallback = findFallbackTopic(subject, grade, topicKey);
    if (fallback) {
      return {
        mode: 'fallback_topic_list',
        chunks: [
          {
            title: fallback.topicName,
            text: `${fallback.summary}\nKey concepts: ${fallback.keyConcepts.join(', ')}.\nCommon misconceptions: ${fallback.commonMisconceptions.join(' ')}`,
          },
        ],
      };
    }
  }

  // No topicKey resolved, or topicKey didn't match a fallback entry — try a
  // loose search over the fallback reference using the student's question, so
  // a mistyped/unmapped topic can still ground if it's a close match.
  if (req.studentQuestion) {
    const matches = searchFallbackTopics(req.studentQuestion, grade);
    if (matches.length > 0) {
      const top = matches[0];
      return {
        mode: 'fallback_topic_list',
        chunks: [
          {
            title: top.topicName,
            text: `${top.summary}\nKey concepts: ${top.keyConcepts.join(', ')}.\nCommon misconceptions: ${top.commonMisconceptions.join(' ')}`,
          },
        ],
      };
    }
  }

  // Tier 3: genuinely nothing — subject/topic outside both the library and
  // the fallback reference (e.g. a subject not in this platform's scope at
  // all). Still answer, per product requirement, flagged as general knowledge.
  return { mode: 'general_knowledge', chunks: [] };
}

/** Convenience for building a topic picker / "what's available" listing —
 *  not used by grounding directly, but by the chat UI's topic selector. */
export function listKnownTopics(subject: string, grade: number, term?: number) {
  return fallbackTopicsFor(subject, grade, term);
}
