// ── Groq API client ────────────────────────────────────────────────────────
// Plain fetch against Groq's OpenAI-compatible chat completions endpoint —
// no SDK dependency added, keeping this a one-file integration point.
//
// Key exposure note: VITE_GROQ_API_KEY ships in the client bundle, same
// exposure class as VITE_SUPABASE_SERVICE_ROLE_KEY already does across this
// codebase (see src/lib/supabase.ts, src/lib/wellbeing.ts header). This repo
// has no serverless/edge function layer today — flagged as a known, accepted
// risk consistent with existing convention, not silently fixed here.

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Fast Groq-hosted model, low-to-moderate temperature per research's
// architecture sketch (0.2-0.5) for more deterministic tutoring.
const MODEL = 'llama-3.3-70b-versatile';
const TEMPERATURE = 0.35;
// Constrained to keep responses short and mobile-friendly (research: many
// students on low-end devices / constrained data).
const MAX_TOKENS = 500;

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export class GroqError extends Error {}

function getApiKey(): string {
  const key = import.meta.env.VITE_GROQ_API_KEY;
  if (!key) throw new GroqError('VITE_GROQ_API_KEY is not set');
  return key;
}

export async function groqChat(messages: ChatMessage[], opts?: { maxTokens?: number; jsonMode?: boolean }): Promise<string> {
  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: TEMPERATURE,
      max_tokens: opts?.maxTokens ?? MAX_TOKENS,
      ...(opts?.jsonMode ? { response_format: { type: 'json_object' } } : {}),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new GroqError(`Groq API error ${res.status}: ${body.slice(0, 300)}`);
  }

  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== 'string') throw new GroqError('Groq response missing message content');
  return content;
}
