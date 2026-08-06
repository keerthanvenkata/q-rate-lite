import React, { useState, useEffect } from 'react';
import { fetchBillingStatus, createRazorpayOrder, verifyRazorpayPayment, type BillingStatusResponse } from '../../api';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface BillingTabProps {
  token: string;
}

export default function BillingTab({ token }: BillingTabProps) {
  const [status, setStatus] = useState<BillingStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadStatus();
  }, [token]);

  const loadStatus = async () => {
    try {
      const data = await fetchBillingStatus(token);
      setStatus(data);
    } catch (err: any) {
      setError(err.message || "Failed to load billing status");
    }
  };

  const handleUpgrade = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const order = await createRazorpayOrder(token, "monthly");
      
      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Q-Rate Lite",
        description: "Pro License Upgrade",
        order_id: order.order_id,
        handler: async function (response: any) {
          setIsLoading(true); // Restart loading while verifying
          try {
            await verifyRazorpayPayment(token, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: "monthly",
            });
            
            // Poll backend for status update since webhook handles activation
            let attempts = 0;
            const pollInterval = setInterval(async () => {
              attempts++;
              try {
                const data = await fetchBillingStatus(token);
                if (data.subscription_status === 'active' || attempts >= 5) {
                  clearInterval(pollInterval);
                  setStatus(data);
                  setIsLoading(false);
                  if (data.subscription_status !== 'active') {
                     setError("Payment successful, but status is still updating. Please refresh in a moment.");
                  }
                }
              } catch (e) {
                // Ignore fetch errors during polling
              }
            }, 2000);
            
          } catch (verifyErr: any) {
            setError(verifyErr.message || "Payment verification failed");
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        },
        theme: {
          color: "#0f172a"
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (response: any){
        setError(`Payment failed: ${response.error.description}`);
        setIsLoading(false);
      });
      rzp.open();

    } catch (err: any) {
      setError(err.message || "Failed to initiate upgrade");
      setIsLoading(false);
    }
  };

  if (!status) return (
    <div className="flex items-center justify-center h-[50vh]">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="w-10 h-10 rounded-full border-2 border-neutral-200 border-t-black animate-spin" />
        <p className="text-sm text-neutral-500 font-medium">Loading billing info…</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Billing & Subscriptions</h2>
      
      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700 mb-4">
          <span className="mt-0.5">⚠</span>
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="dashboard-card p-6">
          <p className="dashboard-section-title">Subscription Status</p>
          <div className="mt-2 flex items-center gap-3">
             <span className={`text-xs font-semibold uppercase tracking-wide px-2.5 py-1 rounded-md ${status.subscription_status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {status.subscription_status}
             </span>
          </div>
          {status.plan_expiry && (
            <p className="text-sm text-neutral-500 mt-4">Renews: {new Date(status.plan_expiry).toLocaleDateString()}</p>
          )}
        </div>

        <div className="dashboard-card p-6">
          <p className="dashboard-section-title">Marketing Credits</p>
          <p className="text-4xl font-bold text-black mt-2">{status.marketing_credits}</p>
        </div>
      </div>

      <div className="dashboard-card p-6 border-neutral-200">
        <h3 className="text-sm font-bold text-black tracking-tight mb-1">Pro License</h3>
        <p className="text-sm text-neutral-500 leading-relaxed mb-5">
          Upgrade to the Pro plan for ₹999/month to unlock unlimited feedback collection and analytics.
        </p>
        <button 
          onClick={handleUpgrade} 
          disabled={isLoading || status.subscription_status === 'active'}
          className="dashboard-btn-primary max-w-xs"
        >
          {isLoading ? "Processing..." : status.subscription_status === 'active' ? "Currently Active" : "Upgrade to Pro (₹999/mo)"}
        </button>
      </div>
    </div>
  );
}
