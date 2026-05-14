# Q-Rate Lite: Production Deployment Guide

This document is your step-by-step master plan for taking Q-Rate Lite from your local machine to the live internet. 

---

## 1. The SIM Card Strategy

**Why I suggested BSNL:**
In India, telecom operators permanently deactivate and recycle your phone number if you do not recharge it for 90 days. If your number gets recycled, you lose your WhatsApp Business account entirely.
- **Airtel / Jio**: Force you to pay ~₹189 to ₹199 every 28 days just to keep incoming SMS active. 
- **BSNL**: Still offers traditional "validity extension" plans (e.g., ₹107 for 35 days, or long-term plans like ₹797 for a whole year of validity). 
**Verdict:** If you want a "set it and forget it" top-up style SIM, BSNL is the cheapest way to keep the number alive strictly for receiving the occasional OTP. *However, if BSNL network coverage is terrible in your area, just get Airtel and set up a ₹199/month auto-pay.*

**Action Steps:**
1. Buy a new SIM card. Put it in a spare phone.
2. Ensure it can receive SMS (you need this to verify the number with Meta).

---

## 2. Meta WhatsApp Cloud API Setup

You will bypass expensive middle-men by plugging directly into Meta's servers.

**Action Steps:**
1. Go to [developers.facebook.com](https://developers.facebook.com/) and log in with your Facebook account.
2. Click **Create App** -> Select **Other** -> Select **Business**.
3. Once the app is created, scroll down and add the **WhatsApp** product.
4. Meta will provide you with a "Test Number." Scroll down to Step 5 to add your **Real Phone Number** (the new SIM card). Meta will send an SMS OTP to verify it.
5. In the sidebar, go to **WhatsApp > Configuration**.
6. You will see a webhook section. We will fill this in *after* we deploy the backend to Vercel.
7. Generate a **Permanent Access Token** in your Business Manager settings (System Users). Do not use the temporary 24-hour token.

---

## 3. Database Setup (Supabase)

Your local `test.db` SQLite database is great for dev, but Vercel Serverless functions need a real Postgres database.

**Action Steps:**
1. Go to [supabase.com](https://supabase.com/) and create a free account/project.
2. Wait 2 minutes for the database to spin up.
3. Go to **Project Settings > Database** and copy the **Connection String (URI)**.
4. Replace `[YOUR-PASSWORD]` in the string with your actual database password.

---

## 4. Run Database Initialization

Your live Supabase database is currently empty. You need to create the tables.

**Action Steps:**
1. Go to your Supabase Project Dashboard.
2. Navigate to the **SQL Editor** on the left sidebar.
3. Open the file located at `supabase/migrations/0000_init_schema.sql` from your local codebase.
4. Copy the entire contents of that file and paste it into the Supabase SQL Editor.
5. Click **Run**. This will instantly build all your tables and indexes inside Supabase over the internet.

---

## 5. Code Deployment (Vercel)

Vercel will host both your React Frontend and your FastAPI Backend for exactly ₹0/month.

**Action Steps:**
1. Go to [vercel.com](https://vercel.com/) and log in with your GitHub account.
2. Click **Add New > Project** and import your `q-rate-lite` GitHub repository.
3. Vercel will automatically detect the settings based on the `vercel.json` we wrote.
4. **CRITICAL:** Before clicking Deploy, open the **Environment Variables** section and add the following:
   - `DATABASE_URL` = (Your Supabase Connection String)
   - `FRONTEND_URL` = (The Vercel URL you are about to get, e.g., `https://qrate-lite.vercel.app`)
   - `SUDO_PASSWORD` = (Pick a strong password for your SuperAdmin dashboard)
   - `META_VERIFY_TOKEN` = (Make up a random password, e.g., `qrate_secret_123`)
   - `META_ACCESS_TOKEN` = (The Permanent Token from Meta)
   - `META_PHONE_ID` = (The Phone Number ID from the Meta Dashboard)
5. Click **Deploy**. Vercel will build the React app and package the Python backend.

---

## 6. Connecting the Dots (Webhooks)

Now that Vercel is live, we must tell Meta where to send inbound WhatsApp messages.

**Action Steps:**
1. Go back to your Meta Developer Dashboard (WhatsApp > Configuration).
2. Click **Edit Webhook**.
3. **Callback URL**: Enter `https://your-vercel-app.vercel.app/api/whatsapp/webhook`
4. **Verify Token**: Enter the exact `META_VERIFY_TOKEN` you saved in Vercel.
5. Click **Verify and Save**. Meta will ping your live Vercel backend. Vercel will respond correctly, and the link will be established!
6. Click **Manage Webhook Fields** and subscribe to the `messages` event.

**🎉 DONE!** Your QR codes will now trigger real WhatsApp messages to real customers.
