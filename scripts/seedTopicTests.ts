// ── Seed script: Topic Tests v2 catalog → Supabase ───────────────────────────
// Reads src/lib/topicTestCatalog.ts (source of truth, versioned) and upserts
// topics/misconceptions/questions/distractors/prescribed-test rows.
// Idempotent — safe to re-run after editing the catalog.
//
// Usage: npm run seed:topictests   (requires .env.local with Supabase creds)

import { createClient } from '@supabase/supabase-js';
import { TOPIC_TEST_CATALOG } from '../src/lib/topicTestCatalog';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_SERVICE_ROLE_KEY. Run with: npm run seed:topictests');
  process.exit(1);
}

const db = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  for (const topic of TOPIC_TEST_CATALOG) {
    console.log(`\n── ${topic.label} (${topic.topicKey}) ──`);

    const { data: subject, error: subjectErr } = await db
      .from('subjects').select('id').eq('code', topic.subjectCode).maybeSingle();
    if (subjectErr || !subject) {
      console.error(`  ✗ subject code "${topic.subjectCode}" not found — skipping topic`);
      continue;
    }

    const { data: topicRow, error: topicErr } = await db
      .from('topics')
      .upsert(
        { subject_id: subject.id, grade: topic.grade, term: topic.term, topic_key: topic.topicKey, label: topic.label, school_id: null },
        { onConflict: 'topic_key' },
      )
      .select('id').single();
    if (topicErr || !topicRow) { console.error('  ✗ topic upsert failed:', topicErr?.message); continue; }
    const topicId = topicRow.id;
    console.log(`  ✓ topic id=${topicId}`);

    // Misconceptions — upsert by (topic_id, code)
    const misconceptionIdByCode = new Map<string, number>();
    for (const m of topic.misconceptions) {
      const { data, error } = await db
        .from('misconceptions')
        .upsert(
          { topic_id: topicId, code: m.code, label: m.label, description: m.description },
          { onConflict: 'topic_id,code' },
        )
        .select('id').single();
      if (error || !data) { console.error(`  ✗ misconception "${m.code}" failed:`, error?.message); continue; }
      misconceptionIdByCode.set(m.code, data.id);
    }
    console.log(`  ✓ ${misconceptionIdByCode.size}/${topic.misconceptions.length} misconceptions`);

    // Questions — no natural unique key in schema, so match existing rows by
    // (topic_id, prompt) to stay idempotent across re-runs.
    const questionIds: number[] = [];
    for (const q of topic.questions) {
      const { data: existing } = await db
        .from('questions').select('id').eq('topic_id', topicId).eq('prompt', q.prompt).maybeSingle();

      const payload = {
        topic_id: topicId,
        question_type: q.questionType,
        prompt: q.prompt,
        difficulty: q.difficulty,
        options: q.options ?? null,
        correct_answer: q.correctAnswer,
        answer_tolerance: q.answerTolerance ?? null,
        created_by: null,
      };

      let questionId: number;
      if (existing) {
        const { error } = await db.from('questions').update(payload).eq('id', existing.id);
        if (error) { console.error('  ✗ question update failed:', error.message); continue; }
        questionId = existing.id;
      } else {
        const { data, error } = await db.from('questions').insert(payload).select('id').single();
        if (error || !data) { console.error('  ✗ question insert failed:', error?.message); continue; }
        questionId = data.id;
      }
      questionIds.push(questionId);

      // Distractor misconceptions — upsert by (question_id, option_key)
      for (const d of q.distractors ?? []) {
        const misconceptionId = misconceptionIdByCode.get(d.misconceptionCode);
        if (!misconceptionId) { console.error(`  ✗ distractor references unknown misconception "${d.misconceptionCode}"`); continue; }
        const { error } = await db
          .from('distractor_misconceptions')
          .upsert(
            {
              question_id: questionId, option_key: d.optionKey, misconception_id: misconceptionId,
              cognitive_error_type: d.cognitiveErrorType, severity_weight: d.severityWeight, explanation_text: d.explanation,
            },
            { onConflict: 'question_id,option_key' },
          );
        if (error) console.error(`  ✗ distractor ${d.optionKey} failed:`, error.message);
      }
    }
    console.log(`  ✓ ${questionIds.length}/${topic.questions.length} questions`);

    // Prescribed diagnostic test bundling all questions in catalog order.
    const testTitle = `${topic.label} — Diagnostic`;
    const { data: existingTest } = await db
      .from('topic_tests').select('id').eq('topic_id', topicId).eq('title', testTitle).maybeSingle();

    let topicTestId: number;
    if (existingTest) {
      topicTestId = existingTest.id;
    } else {
      const { data, error } = await db
        .from('topic_tests')
        .insert({ topic_id: topicId, teacher_id: null, title: testTitle, test_purpose: 'diagnostic', time_limit_minutes: 20, is_prescribed: true })
        .select('id').single();
      if (error || !data) { console.error('  ✗ prescribed test insert failed:', error?.message); continue; }
      topicTestId = data.id;
    }

    await db.from('topic_test_questions').delete().eq('topic_test_id', topicTestId);
    const links = questionIds.map((qid, idx) => ({ topic_test_id: topicTestId, question_id: qid, order_index: idx + 1 }));
    const { error: linkErr } = await db.from('topic_test_questions').insert(links);
    if (linkErr) console.error('  ✗ test-question links failed:', linkErr.message);
    else console.log(`  ✓ prescribed test id=${topicTestId} with ${links.length} questions`);
  }

  console.log('\nDone.');
}

main().catch((e) => { console.error(e); process.exit(1); });
