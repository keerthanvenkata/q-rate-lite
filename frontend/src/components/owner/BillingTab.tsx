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
            // We give the webhook a slight head start before refreshing
            setTimeout(() => {
              loadStatus();
              setIsLoading(false);
            }, 1500);
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

  if (!status) return <div className="text-neutral-500 p-8">Loading billing info...</div>;

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4">Billing & Subscriptions</h2>
      
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="dashboard-card p-6">
          <p className="text-sm font-medium text-neutral-500">Subscription Status</p>
          <div className="mt-2 flex items-center gap-3">
             <span className={`px-2 py-1 text-xs font-bold uppercase rounded ${status.subscription_status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                {status.subscription_status}
             </span>
          </div>
          {status.plan_expiry && (
            <p className="text-sm text-neutral-500 mt-4">Renews: {new Date(status.plan_expiry).toLocaleDateString()}</p>
          )}
        </div>

        <div className="dashboard-card p-6">
          <p className="text-sm font-medium text-neutral-500">Marketing Credits</p>
          <p className="text-4xl font-bold text-black mt-2">{status.marketing_credits}</p>
        </div>
      </div>

      <div className="dashboard-card p-6 border-blue-100 bg-blue-50/30">
        <h3 className="font-bold text-black mb-2">Pro License</h3>
        <p className="text-sm text-neutral-600 mb-4">
          Upgrade to the Pro plan for ₹999/month to unlock unlimited feedback collection and analytics.
        </p>
        <button 
          onClick={handleUpgrade} 
          disabled={isLoading || status.subscription_status === 'active'}
          className="dashboard-btn-primary"
        >
          {isLoading ? "Processing..." : status.subscription_status === 'active' ? "Currently Active" : "Upgrade to Pro (₹999/mo)"}
        </button>
      </div>
    </div>
  );
}
