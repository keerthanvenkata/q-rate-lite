# Supabase Keep-Alive Cron Job Setup

To prevent your Supabase Free Tier project from being paused due to inactivity, we've added a Supabase Edge Function (`supabase/functions/keepalive/index.ts`) that pings the database.

Here are the instructions to deploy the function and configure `console.cron-job.org`.

## 1. Deploy the Edge Function
First, you need to deploy the function to your Supabase project using the Supabase CLI.

```bash
# If you haven't linked your project locally yet:
supabase link --project-ref your-project-ref

# Deploy the edge function
supabase functions deploy keepalive --no-verify-jwt
```

*(Optional)* Secure the endpoint:
To prevent unauthorized access, set a secret in your Supabase project:
```bash
supabase secrets set CRON_SECRET=your_super_secret_token_here
```

## 2. Configure cron-job.org

1. Go to [console.cron-job.org](https://console.cron-job.org/) and log in.
2. Click **Create Cronjob**.
3. **Title**: `Q-Rate Supabase Keep-Alive`
4. **URL**: `https://<your-project-ref>.supabase.co/functions/v1/keepalive`
   *(Replace `<your-project-ref>` with your actual Supabase project reference).*
5. **Execution Schedule**: 
   - Select **User-defined**.
   - Set it to run every **1 day** (or every 12 hours to be safe). 
   - Example: `0 0 * * *` (Daily at midnight).
6. **Advanced Settings (If you set a CRON_SECRET)**:
   - Click the **Headers** tab.
   - Add a new Header:
     - **Key**: `Authorization`
     - **Value**: `Bearer your_super_secret_token_here`
7. Click **Create** to save.

Your database will now receive a lightweight ping daily, ensuring it never goes into an inactive/paused state!
