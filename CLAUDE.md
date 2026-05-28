# Prospect School Platform — Claude Code Guide

## Database & Migrations

### Environment Setup
All database credentials are in `.env.local` (never commit):
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Public API key (safe in frontend)
- `VITE_SUPABASE_SERVICE_ROLE_KEY`: Admin key for migrations (keep secret)
- `DATABASE_URL`: PostgreSQL connection string for CLI tools

### Database Migrations — THE RULE
**Never modify tables manually in Supabase Studio.** All schema changes use migrations:

```bash
# Create a new migration
supabase migration create add_new_table

# This creates: supabase/migrations/20260524123456_add_new_table.sql
# Edit the SQL file, then apply:

supabase migration up
```

**Never ask Claude to run SQL directly.** Write the migration file and run `supabase migration up` via CLI.

### Current Schema
The Supabase project (`hdofbjgfpbwnzkwoggvj`) already has:
- `schools` table with RLS (Row Level Security)
- `teachers` table with RLS
- `students` table with RLS
- `marks` table with RLS
- `past_papers` table with storage
- Full schema and RLS policies in `.planning/research/ARCHITECTURE.md`

### When Creating Tables
1. Write migration file to `/supabase/migrations/`
2. Use the naming convention: `20260524000000_description.sql` (timestamp + description)
3. Include RLS policies as part of the migration (see ARCHITECTURE.md for patterns)
4. Run: `supabase migration up`
5. Commit both the migration file and `supabase/migrations/migration_lock.json`

### Example Migration
```sql
-- supabase/migrations/20260524000000_add_announcements.sql
CREATE TABLE public.announcements (
  id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  school_id BIGINT NOT NULL REFERENCES public.schools(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by BIGINT REFERENCES public.teachers(id) ON DELETE SET NULL
);

-- RLS: Only school members can read announcements for their school
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "school_members_can_read_announcements" ON public.announcements
  FOR SELECT
  USING (auth.uid()::text = ANY(
    SELECT u.user_id FROM public.teachers u WHERE u.school_id = announcements.school_id
  ));
```

### Supabase CLI Commands
```bash
# Link to your project (first time only)
supabase link --project-id hdofbjgfpbwnzkwoggvj

# Create migration
supabase migration create <name>

# Apply pending migrations
supabase migration up

# Check migration status
supabase migration list

# Pull latest schema from cloud
supabase db pull

# Push local migrations to cloud
supabase db push
```

## Stack & Tools
- **Frontend:** React 19 + Tailwind CSS 4 + Vite
- **Database:** Supabase (PostgreSQL + Auth + Storage)
- **Deployment:** Vercel (on GitHub push, when ready)
- **Testing:** Playwright (run with `npm test`)

## Key Files
- `.planning/PROJECT.md` — Full requirements & 9-phase build order
- `.planning/research/ARCHITECTURE.md` — Database schema & RLS policies
- `.planning/docs/PROSPECT_SCHOOL_PLATFORM.html` — Design doc (open in browser)
- `src/lib/supabase.ts` — Supabase client initialization
- `src/providers/AuthProvider.tsx` — Auth context & guards
