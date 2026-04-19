const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

export interface FeedbackData {
  token: string;
  rating: number;
  comment?: string;
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
