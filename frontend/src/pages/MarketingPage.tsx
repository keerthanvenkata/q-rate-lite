import React, { useState } from 'react';
import { Send, Users, CreditCard } from 'lucide-react';
import { API_BASE_URL } from '../api';

export default function MarketingPage() {
  const [passcode, setPasscode] = useState("");
  const [cafeId, setCafeId] = useState("1"); // Hardcoded for demo
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [audienceSize, setAudienceSize] = useState(0);
  const [credits, setCredits] = useState(0);
  const [templateName, setTemplateName] = useState("promo_10_off");
  const [isBlasting, setIsBlasting] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/audience`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cafe_id: parseInt(cafeId), passcode })
      });
      if (!response.ok) throw new Error("Invalid Auth");
      const data = await response.json();
      setAudienceSize(data.audience_size);
      setCredits(data.marketing_credits);
      setIsAuthenticated(true);
    } catch (err) {
      alert("Invalid Cafe Passcode");
    }
  };

  const handleBlast = async () => {
    if (audienceSize === 0) return alert("No opted-in customers to message.");
    if (credits < audienceSize) return alert(`Not enough credits. You need ${audienceSize} but have ${credits}.`);
    if (!confirm(`Send '${templateName}' to ${audienceSize} customers? This will use ${audienceSize} credits.`)) return;

    setIsBlasting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/marketing/blast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cafe_id: parseInt(cafeId), passcode, template_name: templateName, components: [] })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.detail);
      setResult(data.message);
      setCredits(data.credits_remaining);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsBlasting(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="dashboard-bg flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="dashboard-card p-8 max-w-sm w-full">
          <Send className="text-black mx-auto mb-4" size={48} />
          <h1 className="text-black text-center font-bold text-2xl mb-6">Marketing Portal</h1>
          <input 
            type="password" 
            placeholder="Cafe Passcode" 
            className="dashboard-input text-center mb-4"
            value={passcode}
            onChange={e => setPasscode(e.target.value)}
          />
          <button type="submit" className="dashboard-btn-primary">LOGIN</button>
        </form>
      </div>
    );
  }

  return (
    <div className="dashboard-bg p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-black flex items-center gap-3 mb-8">
          <Send className="text-black" /> Broadcast Marketing
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="dashboard-card p-6 flex items-center gap-4">
            <div className="bg-neutral-100 p-4 rounded-full text-black border border-neutral-200">
              <Users size={32} />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-semibold uppercase">Opted-In Audience</p>
              <p className="text-3xl font-black text-black">{audienceSize}</p>
            </div>
          </div>
          <div className="dashboard-card p-6 flex items-center gap-4">
            <div className="bg-neutral-100 p-4 rounded-full text-black border border-neutral-200">
              <CreditCard size={32} />
            </div>
            <div>
              <p className="text-sm text-neutral-500 font-semibold uppercase">Available Credits</p>
              <p className={`text-3xl font-black ${credits < audienceSize ? 'text-red-500' : 'text-black'}`}>{credits}</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card p-8">
          <h2 className="text-xl font-bold text-black mb-6">Draft Campaign</h2>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-neutral-600 mb-2">Approved Template Name</label>
            <input 
              type="text" 
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              className="dashboard-input font-mono"
            />
            <p className="text-xs text-neutral-400 mt-2">This must match the exact template name approved in Meta Business Manager.</p>
          </div>
          
          {result ? (
            <div className="bg-neutral-50 text-black p-4 rounded border border-neutral-200 mb-4 font-semibold">
              {result}
            </div>
          ) : (
            <button 
              onClick={handleBlast}
              disabled={isBlasting || audienceSize === 0 || credits < audienceSize}
              className={`dashboard-btn-primary p-4 text-lg flex justify-center items-center gap-2 ${
                isBlasting || audienceSize === 0 || credits < audienceSize ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isBlasting ? "Sending Broadcast..." : "SEND BROADCAST NOW"}
            </button>
          )}
          
          {credits < audienceSize && audienceSize > 0 && (
            <p className="text-center text-red-500 font-semibold mt-4 text-sm">
              You do not have enough credits to reach your entire audience. Please contact support to purchase more credits.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
