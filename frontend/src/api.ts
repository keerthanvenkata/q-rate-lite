export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

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
  if (!response.ok) throw new Error("Failed to load cafes");
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
  if (!response.ok) throw new Error("Failed to load audit logs");
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
  if (!response.ok) throw new Error("Failed to load messages");
  return response.json();
}
