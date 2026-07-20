// ── AI Tutor logging — basic oversight (research section 7) ──────────────────
// "Basic logging and oversight" is a real requirement for this minor-facing
// product, not an afterthought. Every assistant turn writes one row to
// ai_tutor_interaction_logs; moderation blocks write to ai_tutor_flagged_content
// separately (see moderation.ts for why they're kept apart).

import { supabaseAdmin } from '../supabase';
import type { FlagCategory } from './moderation';
import type { GroundingContext } from './systemPrompt';

export async function logAssistantTurn(params: {
  conversationId: number;
  messageId: number;
  studentId: number;
  schoolId: number;
  subject: string;
  topicKey: string | null;
  grounding: GroundingContext;
  misconceptionCodes: string[];
  refusalTriggered: boolean;
}): Promise<void> {
  const { error } = await supabaseAdmin.from('ai_tutor_interaction_logs').insert({
    conversation_id: params.conversationId,
    message_id: params.messageId,
    student_id: params.studentId,
    school_id: params.schoolId,
    subject: params.subject,
    topic_key: params.topicKey,
    grounding_mode: params.grounding.mode,
    misconception_codes: params.misconceptionCodes,
    refusal_triggered: params.refusalTriggered,
    moderation_blocked: false,
  });
  if (error) console.error('[aiTutor] logAssistantTurn error:', error.message);
}

export async function logFlaggedContent(params: {
  conversationId: number | null;
  studentId: number;
  schoolId: number;
  rawInput: string;
  category: FlagCategory;
}): Promise<void> {
  const { error } = await supabaseAdmin.from('ai_tutor_flagged_content').insert({
    conversation_id: params.conversationId,
    student_id: params.studentId,
    school_id: params.schoolId,
    raw_input: params.rawInput,
    category: params.category,
  });
  if (error) console.error('[aiTutor] logFlaggedContent error:', error.message);
}

// Detects, from the model's own reply, whether the refusal pattern fired —
// used to populate ai_tutor_interaction_logs.refusal_triggered. Simple phrase
// match against the exact refusal sentence mandated in systemPrompt.ts's
// refusalScopeRules() — reliable because we control the model's phrasing
// closely via the system prompt, not a general-purpose classifier.
export function detectRefusal(assistantReply: string): boolean {
  return /can't give you the direct solution|can not give you the direct solution|cannot give you the direct solution/i.test(
    assistantReply,
  );
}
