# Q-Rate Lite: Legal & Compliance Handover

This document is intended for our legal counsel and/or Chartered Accountant (CA). It outlines the architecture, data flows, and specific areas that require legal review before Q-Rate Lite can go into production and successfully pass the Meta WhatsApp Cloud API and Razorpay verification checks.

## 1. System Overview

Q-Rate Lite is a B2B SaaS application that provides a WhatsApp-first feedback system for independent cafés and restaurants. 
- **Tenants:** Café Owners (B2B).
- **End-Users:** Café Customers (B2C).
- **Core Loop:** A café customer scans a QR code, leaves a rating (1-5 stars) and a text comment on our hosted web app. They enter their phone number. If they give a low rating, they immediately receive a discount coupon via WhatsApp to encourage a return visit. If they give a high rating, they are redirected to Google Maps.

## 2. Third-Party Integrations & Data Flow

### A. Meta WhatsApp Cloud API
We use the official Meta WhatsApp Cloud API to send transactional messages (coupons, feedback links) and optional marketing messages to end-users.
- **Data Sent to Meta:** End-user phone numbers, message templates (approved by Meta).
- **Compliance Need:** Meta has strict anti-spam policies. Our frontend explicitely includes a marketing opt-in checkbox. We need to ensure our Terms of Service (ToS) and Privacy Policy sufficiently indemnify us if a Café Owner abuses this system to send unauthorized messages.

### B. Supabase (PostgreSQL)
All application data is stored in a managed PostgreSQL database hosted by Supabase.
- **Data Stored:** Café Owner details, End-User phone numbers, feedback ratings/comments, audit logs.
- **Compliance Need:** Data retention policies, GDPR (if applicable), and India's DPDP Act compliance. We need a clear policy on how long we retain end-user data after a café cancels their subscription.

### C. Razorpay
We use Razorpay for recurring B2B subscriptions (Pro License).
- **Data Flow:** We do **not** store credit card numbers, UPI details, or bank accounts. We only store the `razorpay_customer_id` and the subscription status.
- **Compliance Need:** Razorpay requires clear ToS, Privacy Policy, Contact Us, and Cancellation/Refund policies published on the live website before they will activate live API keys and approve e-mandates for recurring billing.

## 3. Checklist for Legal Review

Please review the following items currently published on our domain:

- [ ] **Privacy Policy (`/privacy`):** Ensure the wording adequately protects us under the DPDP Act regarding the collection and temporary processing of end-user phone numbers on behalf of our B2B clients.
- [ ] **Terms of Service (`/terms`):** Verify the "WhatsApp API Usage & Anti-Spam Policy" clause. It must legally shift the liability of sending spam from Q-Rate Lite to the Café Owner.
- [ ] **Cancellation & Refund Policy (in `/terms`):** Verify that our "no-refunds for partial months" clause complies with Razorpay's requirements and local consumer protection laws.
- [ ] **Data Processing Agreement (DPA):** Do we need a formalized DPA embedded in our ToS since we act as a Data Processor for the Café Owners (who are the Data Controllers)?

## 4. Required Deliverables from Counsel

1. **Redlines/Edits** to the current `/privacy` and `/terms` boilerplate.
2. **Confirmation** that our opt-in checkbox language ("I agree to receive marketing updates on WhatsApp") is legally sufficient.
3. **Guidance** on any required business registration documents (e.g., GST certificate, MSME registration) we need to prepare for the Meta Business Verification process.
