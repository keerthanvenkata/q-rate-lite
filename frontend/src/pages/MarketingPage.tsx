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
      <div className="min-h-screen bg-indigo-50 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white shadow-xl p-8 rounded-xl max-w-sm w-full">
          <Send className="text-indigo-600 mx-auto mb-4" size={48} />
          <h1 className="text-slate-800 text-center font-bold text-2xl mb-6">Marketing Portal</h1>
          <input 
            type="password" 
            placeholder="Cafe Passcode" 
            className="w-full p-3 rounded bg-slate-50 border border-slate-200 text-center mb-4 focus:ring-2 focus:ring-indigo-500 outline-none"
            value={passcode}
            onChange={e => setPasscode(e.target.value)}
          />
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded transition-colors">LOGIN</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3 mb-8">
          <Send className="text-indigo-600" /> Broadcast Marketing
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600">
              <Users size={32} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold uppercase">Opted-In Audience</p>
              <p className="text-3xl font-black text-slate-800">{audienceSize}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="bg-emerald-100 p-4 rounded-full text-emerald-600">
              <CreditCard size={32} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-semibold uppercase">Available Credits</p>
              <p className={`text-3xl font-black ${credits < audienceSize ? 'text-red-500' : 'text-slate-800'}`}>{credits}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-800 mb-6">Draft Campaign</h2>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-600 mb-2">Approved Template Name</label>
            <input 
              type="text" 
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              className="w-full p-3 border border-slate-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none font-mono"
            />
            <p className="text-xs text-slate-400 mt-2">This must match the exact template name approved in Meta Business Manager.</p>
          </div>
          
          {result ? (
            <div className="bg-green-50 text-green-700 p-4 rounded border border-green-200 mb-4 font-semibold">
              {result}
            </div>
          ) : (
            <button 
              onClick={handleBlast}
              disabled={isBlasting || audienceSize === 0 || credits < audienceSize}
              className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white font-bold p-4 rounded-lg flex justify-center items-center gap-2 transition-colors"
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
