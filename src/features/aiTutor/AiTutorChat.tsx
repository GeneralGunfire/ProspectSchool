// ── AI Tutor chat panel ───────────────────────────────────────────────────────
// Text-first, mobile-conscious modal chat. Reusable from any contextual entry
// point (Library lesson pages, Topic Test results) — never a standalone nav
// page in this pass (see build report: contextual entry points only, matching
// the original spec's Key Workflows intent and the research doc's default).

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Bot, Loader2, AlertCircle } from 'lucide-react';
import {
  startConversation, sendMessage, fetchConversationMessages,
  type ConversationRecord, type EntryPoint,
} from '../../lib/aiTutor/aiTutor';

const EASE = [0.23, 1, 0.32, 1] as const;

interface ChatMessageDisplay {
  id: string | number;
  role: 'user' | 'assistant';
  content: string;
}

export interface AiTutorChatProps {
  open: boolean;
  onClose: () => void;
  studentId: number;
  schoolId: number;
  grade: number;
  subject: string | null;
  topicKey: string | null;
  topicLabel: string | null;
  entryPoint: EntryPoint;
  sourceAttemptId?: number;
  sourceQuestionId?: number;
  /** Optional opening message pre-filled from context, e.g. "Can you explain
   *  why I got this question wrong?" — student can edit before sending. */
  initialDraft?: string;
}

export function AiTutorChat({
  open, onClose, studentId, schoolId, grade, subject, topicKey, topicLabel, entryPoint,
  sourceAttemptId, sourceQuestionId, initialDraft,
}: AiTutorChatProps) {
  const [conversation, setConversation] = useState<ConversationRecord | null>(null);
  const [messages, setMessages] = useState<ChatMessageDisplay[]>([]);
  const [draft, setDraft] = useState(initialDraft ?? '');
  const [sending, setSending] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setInitializing(true);
    setError(null);
    startConversation({
      studentId, schoolId, grade, subject, topicKey, topicLabel, entryPoint,
      sourceAttemptId, sourceQuestionId,
    })
      .then(async (conv) => {
        if (cancelled) return;
        setConversation(conv);
        const history = await fetchConversationMessages(conv.id);
        if (!cancelled) {
          setMessages(history.map((m: any) => ({ id: m.id, role: m.role, content: m.content })));
        }
      })
      .catch((e) => !cancelled && setError(e instanceof Error ? e.message : 'Could not start the tutor session.'))
      .finally(() => !cancelled && setInitializing(false));
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, sending]);

  async function handleSend() {
    const text = draft.trim();
    if (!text || !conversation || sending) return;
    setDraft('');
    setSending(true);
    setError(null);
    setMessages((prev) => [...prev, { id: `pending-user-${Date.now()}`, role: 'user', content: text }]);
    try {
      const result = await sendMessage({ conversation, studentMessage: text, sourceQuestionId });
      setMessages((prev) => [...prev, { id: `pending-assistant-${Date.now()}`, role: 'assistant', content: result.reply }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong sending that message.');
    } finally {
      setSending(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.28, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            className="paper-card w-full sm:max-w-lg h-[85vh] sm:h-[640px] rounded-t-2xl sm:rounded-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200 shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                <Bot className="w-4.5 h-4.5 text-brand-dark shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-black text-brand-dark truncate">AI Study Helper</p>
                  {topicLabel && <p className="text-[11px] text-stone-500 truncate">{topicLabel}</p>}
                </div>
              </div>
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-stone-100 shrink-0">
                <X className="w-4 h-4 text-stone-500" />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              <div className="text-[11px] text-stone-400 text-center px-4">
                I can help you understand this topic, but I won't just give you direct answers to graded work or
                past papers — and I'm bounded to our course content, so I might not always know everything.
              </div>

              {initializing && (
                <div className="flex items-center justify-center py-8 text-stone-400">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </div>
              )}

              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-brand-dark text-white rounded-br-sm'
                        : 'bg-stone-100 text-brand-dark rounded-bl-sm'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {sending && (
                <div className="flex justify-start">
                  <div className="bg-stone-100 rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                    <Loader2 className="w-4 h-4 animate-spin text-stone-400" />
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-600 justify-center px-4">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
                </div>
              )}
            </div>

            <div className="border-t border-stone-200 p-3 shrink-0">
              <div className="flex items-end gap-2">
                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                  }}
                  placeholder="Ask about this topic..."
                  rows={1}
                  disabled={initializing}
                  className="flex-1 resize-none rounded-xl border border-stone-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark/20 max-h-28"
                />
                <button
                  onClick={handleSend}
                  disabled={!draft.trim() || sending || initializing}
                  className="p-2.5 rounded-xl bg-brand-dark text-white disabled:opacity-40 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
