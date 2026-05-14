import React, { useState } from 'react';
import { redeemCoupon, type RedeemResponse } from '../api';
import { Ticket, Lock, CheckCircle } from 'lucide-react';

export default function StaffPage() {
  const [couponCode, setCouponCode] = useState("");
  const [passcode, setPasscode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<RedeemResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode || !passcode) {
      setError("Both Coupon Code and Staff Passcode are required.");
      return;
    }
    setError(null);
    setIsSubmitting(true);
    try {
      // Coupon codes are typically uppercase, normalize it for safety
      const data = await redeemCoupon({ 
        coupon_code: couponCode.trim().toUpperCase(), 
        passcode: passcode.trim() 
      });
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setCouponCode("");
    setResult(null);
    setError(null);
    // keeping passcode might be convenient, but for security resetting is better
    setPasscode("");
  };

  if (result) {
    return (
      <div className="dashboard-bg flex items-center justify-center p-4">
        <div className="dashboard-card p-8 text-center max-w-sm w-full">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Valid!</h2>
          <p className="text-slate-600 mb-6 font-medium">Please provide:</p>
          
          <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-200 mb-8 shadow-inner">
            <p className="text-lg font-bold">{result.discount_text}</p>
          </div>

          <button
            onClick={handleReset}
            className="dashboard-btn-primary py-3 px-4 font-semibold"
          >
            Redeem Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-bg flex flex-col items-center justify-center p-4">
      <div className="max-w-sm w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-black tracking-tight">Staff Portal</h1>
          <p className="text-neutral-500 mt-2">Enter coupon code to verify & redeem.</p>
        </div>

        <div className="dashboard-card p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
            <div>
              <label htmlFor="coupon" className="block text-sm font-semibold text-neutral-700 mb-2">
                Coupon Code
              </label>
              <div className="relative">
                <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                <input
                  id="coupon"
                  type="text"
                  placeholder="e.g. ABCD45"
                  className="dashboard-input pl-10 uppercase placeholder:normal-case font-mono tracking-widest font-semibold"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="passcode" className="block text-sm font-semibold text-neutral-700 mb-2">
                Staff Passcode
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={20} />
                <input
                  id="passcode"
                  type="password"
                  placeholder="••••"
                  className="dashboard-input pl-10"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 flex items-center justify-center text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || !couponCode || !passcode}
              className={`dashboard-btn-primary py-4 text-lg mt-2 ${
                couponCode && passcode && !isSubmitting
                  ? ""
                  : "opacity-50 cursor-not-allowed"
              }`}
            >
              {isSubmitting ? "Verifying..." : "Redeem"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
