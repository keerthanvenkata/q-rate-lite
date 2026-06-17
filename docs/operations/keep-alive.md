# Supabase Keep-Alive Edge Function

## Purpose

Supabase free-tier PostgreSQL instances are **automatically paused after 7 days of inactivity**. A paused database causes the first request after downtime to fail with a connection error until Supabase manually restores it (which can take 30–60 seconds).

The `keep-alive` Edge Function exists to prevent this by running a lightweight database query on a schedule, keeping the instance continuously warm.

## Location

```
supabase/functions/keep-alive/index.ts
```

## How It Works

1. A Deno HTTP handler receives an incoming request.
2. **Optional auth check**: If the `CRON_SECRET` environment variable is set, the function validates that the `Authorization: Bearer <secret>` header matches. If it doesn't match, the function returns `401 Unauthorized`. If `CRON_SECRET` is not set, the endpoint is open.
3. It initialises a Supabase client using the project's `SUPABASE_URL` and `SUPABASE_ANON_KEY`.
4. It executes `SELECT id FROM cafes LIMIT 1` — the lightest possible query to prove the database is alive.
5. It returns a JSON response `{ status: "ok", message: "...", timestamp: "..." }` on success, or `{ error: "..." }` with a `500` status on failure.

## Scheduling

The function does not schedule itself. It must be called by an external cron trigger.

### Recommended: Supabase Cron (pg_cron)

Supabase projects on Pro plan can use `pg_cron` via the SQL Editor:

```sql
-- Run every 3 days (adjust to taste, must be < 7 days)
SELECT cron.schedule(
  'keep-alive-ping',
  '0 12 */3 * *',  -- Every 3 days at noon UTC
  $$
  SELECT net.http_post(
    url := 'https://<your-project-ref>.supabase.co/functions/v1/keep-alive',
    headers := '{"Authorization": "Bearer <your-cron-secret>"}'::jsonb
  );
  $$
);
```

### Alternative: Free External Cron Service

If on the Supabase free tier (no `pg_cron`), use [cron-job.org](https://cron-job.org/) or [EasyCron](https://www.easycron.com/):

1. Create a free account.
2. Add a new cron job with the URL: `https://<your-project-ref>.supabase.co/functions/v1/keep-alive`
3. Set the method to **GET**.
4. If `CRON_SECRET` is set, add a request header: `Authorization: Bearer <your-cron-secret>`.
5. Set the schedule to **every 3 days** (must be less than 7 days to prevent pausing).

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `SUPABASE_URL` | Yes (auto-injected) | Supabase project URL. Auto-provided in Edge Function runtime. |
| `SUPABASE_ANON_KEY` | Yes (auto-injected) | Supabase public anon key. Auto-provided in Edge Function runtime. |
| `CRON_SECRET` | No | If set, requests must include `Authorization: Bearer <secret>`. Recommended for security. |

## Deploying the Function

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link to your Supabase project
supabase link --project-ref <your-project-ref>

# Deploy the function
supabase functions deploy keep-alive
```

## Monitoring

Check that the cron job is firing by looking at the Edge Function invocation logs in the Supabase Dashboard under **Edge Functions > keep-alive > Logs**.

A successful invocation log will show:
```json
{ "status": "ok", "message": "Supabase Database is awake!", "timestamp": "..." }
```
