# Q-Rate Lite: Runbook

Operational reference for the platform operator (superadmin). Covers daily ops, incident response, and maintenance.

---

## 1. For Café Owners

### Setup Checklist

1. Log in at `/login` with Google.
2. Enter your café name when prompted (one-time onboarding step).
3. Navigate to the **QR Code** tab in your dashboard (`/sudo`).
4. Download the QR code and print it. Place it on every table.
5. Note the staff passcode from your settings — your staff need this to redeem coupons.

### Daily Operations

- **Feedback**: Review new customer ratings daily from the **Overview** tab (`/sudo`).
- **Coupon Redemption**: Staff use the **Staff Page** (`/staff`) to redeem coupons at the counter. They enter the coupon code and passcode.
- **Replying to Customers**: The **Reply** button on each feedback card opens a WhatsApp deep link to message that customer directly.

### Marketing Blasts

- Available from `/marketing` once your subscription is active.
- Credits are prepaid and deducted per message sent.
- The **template name** must exactly match a pre-approved template in your Meta Business Manager.

---

## 2. For the Platform Operator (Superadmin)

Access the superadmin panel at `/superadmin`. This is gated by the `SUPERADMIN_EMAIL` environment variable — only the account matching that email can access it.

### Managing Subscriptions

- Go to the **Cafes** tab.
- Find the café by name or ID.
- Use the **Monthly** / **Annual** / **Cancel** buttons to manually override their subscription.
- All overrides are logged in the Audit Log tab.

### Reviewing Audit Logs

- Go to the **Audit Logs** tab.
- The log displays the 100 most recent entries in a terminal-style view.
- Key action types to watch: `SUBSCRIPTION_RENEWED`, `UPDATE_SUBSCRIPTION`, `MARKETING_BLAST`.

### Reviewing Contact Messages

- Go to the **Messages** tab.
- Unread messages have a badge count.
- Use the email/phone links to respond directly to prospects.

---

## 3. Incident Response

### Incident: WhatsApp Messages Not Sending

**Symptoms:** Customers are not receiving feedback links after texting the WhatsApp number.

**Steps:**
1. Check Vercel function logs in the Vercel Dashboard (`/api/whatsapp/webhook`).
2. Verify that `META_ACCESS_TOKEN` is set and not expired in Vercel environment variables. Permanent tokens do not expire, but temporary tokens (24h) do.
3. Check the Meta Developer Dashboard → WhatsApp → Logs for API errors.
4. Confirm the webhook subscription is still active (WhatsApp > Configuration > Webhooks).
5. If the token is expired, generate a new permanent token via a Meta Business Manager System User and redeploy on Vercel.

> **Note:** There is no fallback if WhatsApp is down. Customers who text the number will not receive a response until the issue is resolved. The feedback form cannot be reached without the link.

---

### Incident: Database Not Responding

**Symptoms:** All API calls return 500 errors. Vercel function logs show connection errors.

**Steps:**
1. Open the [Supabase Dashboard](https://supabase.com/dashboard) and check project status.
2. If the project shows **"Paused"** (free tier inactivity), click **Restore** and wait 30–60 seconds.
3. To prevent recurrence, verify the `keep-alive` Edge Function cron job is active (see [keep-alive.md](keep-alive.md)).
4. If the database is not paused, check the Supabase project health page for any regional outages.

---

### Incident: Payment Webhook Not Updating Subscription

**Symptoms:** A café owner reports they paid but their subscription shows as `trial`.

**Steps:**
1. Go to the Razorpay Dashboard → Payments and find the payment by amount or customer.
2. Confirm the payment status is `captured` (not just `authorized`).
3. Check Vercel function logs for the `/api/billing/webhook` endpoint for errors.
4. Check the Audit Logs tab in `/superadmin` for a `SUBSCRIPTION_RENEWED` entry around the payment time.
5. If the entry is missing, the webhook likely failed. Check that `RAZORPAY_WEBHOOK_SECRET` is correctly set in Vercel.
6. As a manual fix, use the **Superadmin panel** to manually set the subscription to `active`.

---

### Incident: 500 Errors on All Requests

**Symptoms:** The entire API returns 500 errors. Vercel function logs show exceptions.

**Steps:**
1. Check Vercel function logs immediately for the stack trace (the global exception handler returns it in the JSON body — note this is a dev convenience).
2. The most common cause is a `DATABASE_URL` issue — verify the Supabase connection string is correctly set in Vercel environment variables.
3. If a code deployment caused it, roll back via Vercel Dashboard → Deployments → select the previous stable deployment → **Promote to Production**.

---

## 4. Maintenance Tasks

### Rotating the Meta Access Token

If using a permanent token (recommended), this is rarely needed. If it gets revoked:

1. Go to Meta Business Manager → System Users → select your system user.
2. Click **Generate New Token** with `whatsapp_business_messaging` and `whatsapp_business_management` permissions.
3. Copy the new token.
4. In Vercel Dashboard → Project Settings → Environment Variables, update `META_ACCESS_TOKEN`.
5. Trigger a redeployment (push a commit or redeploy manually).

### Rotating `SECRET_KEY` (Customer JWT Secret)

Rotating this key will **invalidate all outstanding customer feedback session links**. Only do this if the key is compromised.

1. Generate a new secret: `python -c "import secrets; print(secrets.token_hex(32))"`
2. Update `SECRET_KEY` in Vercel environment variables.
3. Trigger a redeployment.

### Backing Up the Database

Supabase provides automated daily backups on paid plans. On the free tier, take manual backups periodically:

```sql
-- Run in Supabase SQL Editor to export a readable snapshot
-- (Use pg_dump via the connection string for a full backup)
```

For a full backup via the CLI:
```bash
pg_dump "<your-DATABASE_URL>" > backup_$(date +%Y%m%d).sql
```

Store backups in a secure location (e.g., private S3 bucket or encrypted local storage).

---

## 5. Monitoring Checklist (Weekly)

- [ ] Check Vercel function error rate in the Vercel Analytics dashboard.
- [ ] Review Supabase project status — confirm it is not paused.
- [ ] Spot-check Audit Logs for any unexpected `MARKETING_BLAST` or subscription changes.
- [ ] Verify the `keep-alive` cron job fired successfully in the past week (Supabase Edge Functions → keep-alive → Logs).
- [ ] Check for unread contact messages in `/superadmin` → Messages tab.
