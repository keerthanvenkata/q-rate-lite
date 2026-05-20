import React, { useState, useEffect } from 'react';
import { fetchBillingStatus, createRazorpayOrder, type BillingStatusResponse } from '../../api';

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
      // Dummy flow: we just alert the order was created for MVP.
      alert(`Razorpay Order Created: ${order.order_id} for ₹${order.amount / 100}`);
      await loadStatus(); // Refresh status
    } catch (err: any) {
      setError(err.message || "Failed to initiate upgrade");
    } finally {
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
