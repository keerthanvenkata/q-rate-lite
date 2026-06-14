import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

serve(async (req) => {
  // It's good practice to verify an authorization header if you want to keep this private.
  // But for a simple ping, it's usually fine if it's open, or you can check a custom secret.
  const authHeader = req.headers.get('Authorization')
  const cronSecret = Deno.env.get('CRON_SECRET')

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    // Initialize Supabase Client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Perform a lightweight query to ensure the Postgres DB instance stays warm/awake.
    // Querying the 'cafes' table with a limit of 1 is extremely fast and efficient.
    const { data, error } = await supabaseClient
      .from('cafes')
      .select('id')
      .limit(1)

    if (error) {
      throw error
    }

    return new Response(
      JSON.stringify({ 
        status: "ok", 
        message: "Supabase Database is awake!", 
        timestamp: new Date().toISOString() 
      }),
      { headers: { "Content-Type": "application/json" } },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { "Content-Type": "application/json" }, status: 500 },
    )
  }
})
