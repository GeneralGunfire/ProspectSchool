// ── Intervention Templates ────────────────────────────────────────────────────
// Structured checklists per intervention type, shown to students on their
// active coaching tasks. Table: intervention_templates (school_id NULL = global
// default; a school-specific row for the same type would override it, though
// no school overrides exist yet — this sprint only consumes the seeded globals).

import { supabaseAdmin } from './supabase';
import type { InterventionType } from './interventions';

export interface InterventionTemplate {
  id:               number;
  type:             InterventionType;
  title:            string;
  description:      string | null;
  checklist:        string[];
  expectedDuration: string | null;
}

function rowToTemplate(r: any): InterventionTemplate {
  return {
    id:               r.id,
    type:             r.type as InterventionType,
    title:            r.title,
    description:      r.description ?? null,
    checklist:        Array.isArray(r.checklist) ? r.checklist : [],
    expectedDuration:  r.expected_duration ?? null,
  };
}

// Prefers a school-specific template over the global default for the same type.
export async function fetchInterventionTemplate(
  schoolId: number,
  type:     InterventionType,
): Promise<InterventionTemplate | null> {
  const { data, error } = await supabaseAdmin
    .from('intervention_templates')
    .select('*')
    .eq('type', type)
    .or(`school_id.eq.${schoolId},school_id.is.null`)
    .order('school_id', { ascending: false, nullsFirst: false }) // school-specific first, global last
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return rowToTemplate(data);
}
