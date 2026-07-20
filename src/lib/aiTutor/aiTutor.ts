// ── AI Tutor — main service layer ─────────────────────────────────────────────
// Orchestrates: moderation pre-filter -> grounding resolution -> student_profile
// -> question_meta lookup -> system prompt construction -> Groq call ->
// persistence -> logging. This is the single entry point the chat UI calls.

import { supabaseAdmin } from '../supabase';
import { moderateInput, moderationRefusalMessage } from './moderation';
import { resolveGrounding } from './grounding';
import { buildStudentProfile } from './studentProfile';
import { buildSystemPrompt, type QuestionMetaContext } from './systemPrompt';
import { groqChat, type ChatMessage } from './groqClient';
import { logAssistantTurn, logFlaggedContent, detectRefusal } from './logInteraction';

export type EntryPoint = 'library_lesson' | 'topic_test_result' | 'general';

export interface StartConversationParams {
  studentId: number;
  schoolId: number;
  grade: number;
  subject: string | null;
  topicKey: string | null;
  topicLabel: string | null;
  entryPoint: EntryPoint;
  sourceAttemptId?: number;
  sourceQuestionId?: number;
}

export interface ConversationRecord {
  id: number;
  studentId: number;
  schoolId: number;
  subject: string | null;
  grade: number | null;
  topicKey: string | null;
  topicLabel: string | null;
  entryPoint: EntryPoint;
}

export interface ChatTurnResult {
  reply: string;
  blocked: boolean;
  refusalTriggered: boolean;
}

export async function startConversation(params: StartConversationParams): Promise<ConversationRecord> {
  const { data, error } = await supabaseAdmin
    .from('ai_tutor_conversations')
    .insert({
      student_id: params.studentId,
      school_id: params.schoolId,
      subject: params.subject,
      grade: params.grade,
      topic_key: params.topicKey,
      topic_label: params.topicLabel,
      entry_point: params.entryPoint,
      source_attempt_id: params.sourceAttemptId ?? null,
      source_question_id: params.sourceQuestionId ?? null,
    })
    .select('id')
    .single();

  if (error || !data) throw new Error(`[aiTutor] failed to start conversation: ${error?.message}`);

  return {
    id: data.id,
    studentId: params.studentId,
    schoolId: params.schoolId,
    subject: params.subject,
    grade: params.grade,
    topicKey: params.topicKey,
    topicLabel: params.topicLabel,
    entryPoint: params.entryPoint,
  };
}

async function fetchQuestionMeta(questionId: number | undefined): Promise<QuestionMetaContext | null> {
  if (!questionId) return null;
  const { data } = await supabaseAdmin
    .from('question_meta')
    .select('is_graded_assignment, is_past_paper')
    .eq('question_id', questionId)
    .maybeSingle();
  if (!data) return { isGradedAssignment: false, isPastPaper: false };
  return { isGradedAssignment: data.is_graded_assignment, isPastPaper: data.is_past_paper };
}

async function fetchConversationHistory(conversationId: number): Promise<ChatMessage[]> {
  const { data } = await supabaseAdmin
    .from('ai_tutor_messages')
    .select('role, content')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })
    .limit(20); // recent turns only — keeps prompt small for mobile/token budget
  return (data ?? []).map((m: { role: 'user' | 'assistant'; content: string }) => ({ role: m.role, content: m.content }));
}

export async function sendMessage(params: {
  conversation: ConversationRecord;
  studentMessage: string;
  sourceQuestionId?: number;
}): Promise<ChatTurnResult> {
  const { conversation, studentMessage } = params;

  // 1. Moderation pre-filter — blocks before anything else happens.
  const moderation = moderateInput(studentMessage);
  if (moderation.blocked && moderation.category) {
    await logFlaggedContent({
      conversationId: conversation.id,
      studentId: conversation.studentId,
      schoolId: conversation.schoolId,
      rawInput: studentMessage,
      category: moderation.category,
    });
    const reply = moderationRefusalMessage(moderation.category);
    await persistTurn(conversation.id, studentMessage, reply);
    await logAssistantTurn({
      conversationId: conversation.id,
      messageId: -1,
      studentId: conversation.studentId,
      schoolId: conversation.schoolId,
      subject: conversation.subject ?? '',
      topicKey: conversation.topicKey,
      grounding: { mode: 'none', chunks: [] },
      misconceptionCodes: [],
      refusalTriggered: false,
    });
    return { reply, blocked: true, refusalTriggered: false };
  }

  // 2. Grounding resolution (tiered: current page -> fallback list -> general).
  const grounding = await resolveGrounding({
    subject: conversation.subject ?? '',
    grade: conversation.grade ?? 10,
    topicKey: conversation.topicKey,
    studentQuestion: studentMessage,
  });

  // 3. Student profile (recent misconceptions, current topic only).
  const profile = conversation.subject && conversation.grade
    ? await buildStudentProfile({
        studentId: conversation.studentId,
        grade: conversation.grade,
        subject: conversation.subject,
        topicKey: conversation.topicKey,
        topicLabel: conversation.topicLabel ?? conversation.topicKey ?? conversation.subject,
      })
    : null;

  // 4. Question metadata (refusal-pattern trigger, research section 7).
  const questionMeta = await fetchQuestionMeta(params.sourceQuestionId);

  // 5. Build system prompt + call Groq with recent history.
  const systemPrompt = buildSystemPrompt({
    grade: conversation.grade ?? 10,
    subject: conversation.subject ?? 'General',
    profile,
    grounding,
    questionMeta,
  });

  const history = await fetchConversationHistory(conversation.id);
  const messages: ChatMessage[] = [
    { role: 'system', content: systemPrompt },
    ...history,
    { role: 'user', content: studentMessage },
  ];

  const reply = await groqChat(messages);
  const refusalTriggered = detectRefusal(reply);

  const { assistantMessageId } = await persistTurn(conversation.id, studentMessage, reply, {
    grounding: grounding.mode,
    refusal_triggered: refusalTriggered,
    moderation_blocked: false,
    misconception_codes: profile?.recentMisconceptions.map((m) => m.code) ?? [],
    hint_level: null,
  });

  await logAssistantTurn({
    conversationId: conversation.id,
    messageId: assistantMessageId,
    studentId: conversation.studentId,
    schoolId: conversation.schoolId,
    subject: conversation.subject ?? '',
    topicKey: conversation.topicKey,
    grounding,
    misconceptionCodes: profile?.recentMisconceptions.map((m) => m.code) ?? [],
    refusalTriggered,
  });

  return { reply, blocked: false, refusalTriggered };
}

async function persistTurn(
  conversationId: number,
  userContent: string,
  assistantContent: string,
  assistantMetadata?: Record<string, unknown>,
): Promise<{ assistantMessageId: number }> {
  await supabaseAdmin.from('ai_tutor_messages').insert({ conversation_id: conversationId, role: 'user', content: userContent });

  const { data, error } = await supabaseAdmin
    .from('ai_tutor_messages')
    .insert({ conversation_id: conversationId, role: 'assistant', content: assistantContent, metadata: assistantMetadata ?? null })
    .select('id')
    .single();

  await supabaseAdmin.from('ai_tutor_conversations').update({ last_message_at: new Date().toISOString() }).eq('id', conversationId);

  if (error || !data) throw new Error(`[aiTutor] failed to persist assistant turn: ${error?.message}`);
  return { assistantMessageId: data.id };
}

export async function fetchConversationMessages(conversationId: number) {
  const { data } = await supabaseAdmin
    .from('ai_tutor_messages')
    .select('id, role, content, created_at')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });
  return data ?? [];
}
