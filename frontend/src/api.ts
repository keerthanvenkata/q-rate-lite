export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export interface FeedbackData {
  token: string;
  rating: number;
  comment?: string;
  marketing_opt_in: boolean;
}

export interface FeedbackResponse {
  status: string;
  message: string;
  coupon_code: string | null;
  redirect_url: string | null;
}

export async function submitFeedback(data: FeedbackData): Promise<FeedbackResponse> {
  const response = await fetch(`${API_BASE_URL}/feedback/submit`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to submit feedback");
  }

  return response.json();
}

export interface RedeemData {
  coupon_code: string;
  passcode: string;
}

export interface RedeemResponse {
  status: string;
  message: string;
  discount_text: string;
}

export async function redeemCoupon(data: RedeemData): Promise<RedeemResponse> {
  const response = await fetch(`${API_BASE_URL}/coupon/redeem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to redeem coupon");
  }

  return response.json();
}

export interface AdminAuthData {
  cafe_id: number;
  passcode: string;
}

export interface BillingStatusResponse {
  subscription_status: string;
  subscription_plan: string | null;
  plan_expiry: string | null;
  marketing_credits: number;
}

export interface RazorpayOrderResponse {
  status: string;
  order_id: string;
  amount: number;
  currency: string;
  key_id: string;
}

export interface WhatsappConfigResponse {
  waba_phone_number: string;
}

export interface FeedbackItem {
  id: number;
  rating: number;
  comment?: string;
  customer_phone: string;
  created_at: string;
}

export interface AdminDataResponse {
  cafe_id: number;
  total_feedback: number;
  average_rating: number;
  recent_feedbacks: FeedbackItem[];
}

export async function fetchAdminDashboard(token: string): Promise<AdminDataResponse> {
  const response = await fetch(`${API_BASE_URL}/admin/dashboard`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch dashboard");
  }

  return response.json();
}

export interface MeData {
  id: number;
  name: string;
  slug: string;
  onboarding_completed: boolean;
  subscription_status: string;
}

export async function fetchMe(token: string): Promise<MeData> {
  const response = await fetch(`${API_BASE_URL}/admin/me`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch me data");
  }

  return response.json();
}

export async function updateOnboarding(token: string, name: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/admin/me/onboarding`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to update onboarding");
  }

  return response.json();
}

export async function fetchBillingStatus(token: string): Promise<BillingStatusResponse> {
  const response = await fetch(`${API_BASE_URL}/billing/status`, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch billing status");
  }

  return response.json();
}

export async function createRazorpayOrder(token: string, plan: string): Promise<RazorpayOrderResponse> {
  const response = await fetch(`${API_BASE_URL}/billing/create-order`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ plan }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to create order");
  }

  return response.json();
}

export interface VerifyPaymentData {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export async function verifyRazorpayPayment(token: string, data: VerifyPaymentData): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/billing/verify-payment`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to verify payment");
  }

  return response.json();
}

export async function fetchWhatsappConfig(): Promise<WhatsappConfigResponse> {
  const response = await fetch(`${API_BASE_URL}/whatsapp/config`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to fetch whatsapp config");
  }

  return response.json();
}

// --- Super Admin API ---

export async function fetchAllCafes(token: string) {
  const response = await fetch(`${API_BASE_URL}/superadmin/cafes`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to load cafes");
  }
  return response.json();
}

export async function updateCafeSubscription(cafeId: number, token: string, status: string, plan: string) {
  const response = await fetch(`${API_BASE_URL}/superadmin/cafes/${cafeId}/subscription`, {
    method: "POST",
    headers: { 
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json" 
    },
    body: JSON.stringify({ subscription_status: status, subscription_plan: plan }),
  });
  if (!response.ok) throw new Error("Failed to update subscription");
  return response.json();
}

export async function fetchAuditLogs(token: string) {
  const response = await fetch(`${API_BASE_URL}/superadmin/audit-logs`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to load audit logs");
  }
  return response.json();
}

export interface ContactMessageData {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
}

export async function submitContactMessage(data: ContactMessageData) {
  const response = await fetch(`${API_BASE_URL}/contact/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to submit message");
  return response.json();
}

export async function fetchContactMessages(token: string) {
  const response = await fetch(`${API_BASE_URL}/superadmin/messages`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to load messages");
  }
  return response.json();
}

// --- Marketing API ---

export interface AudienceDataResponse {
  audience_size: number;
  marketing_credits: number;
}

export async function fetchMarketingAudience(token: string): Promise<AudienceDataResponse> {
  const response = await fetch(`${API_BASE_URL}/marketing/audience`, {
    method: "GET",
    headers: { "Authorization": `Bearer ${token}` },
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to load audience data");
  }
  return response.json();
}

export interface BlastData {
  template_name: string;
  components?: any[];
}

export interface BlastResponse {
  message: string;
  credits_remaining: number;
}

export async function sendMarketingBlast(token: string, data: BlastData): Promise<BlastResponse> {
  const response = await fetch(`${API_BASE_URL}/marketing/blast`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to send broadcast");
  }
  return response.json();
}
