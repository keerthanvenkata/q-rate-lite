import React, { useState } from 'react';
import { fetchAdminDashboard, type AdminDataResponse, type FeedbackItem } from '../api';
import { Lock, LogOut, Star, MessageSquare } from 'lucide-react';

export default function AdminPage() {
  const [cafeId] = useState("1"); // Hardcoded default for prototype
  const [passcode, setPasscode] = useState("");
  const [data, setData] = useState<AdminDataResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cafeId || !passcode) {
      setError("Provide Admin Passcode.");
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const resp = await fetchAdminDashboard({ 
        cafe_id: parseInt(cafeId, 10), 
        passcode 
      });
      setData(resp);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setData(null);
    setPasscode("");
  };

  const openWhatsApp = (phone: string) => {
    // Standardizes India number format assuming input drops the +, but api returns 91...
    // In production, ensure format is exactly wa.me/91XXXXXXXXXX
    const phoneLink = phone.startsWith("91") ? phone : `91${phone}`;
    window.open(`https://wa.me/${phoneLink}`, '_blank');
  };

  if (data) {
    return (
      <div className="min-h-screen bg-slate-100 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Admin Dashboard</h1>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-lg shadow-sm border border-slate-200"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-4 mb-8">
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <p className="text-sm font-medium text-slate-500">Total Feedback</p>
               <p className="text-4xl font-bold text-slate-900 mt-2">{data.total_feedback}</p>
             </div>
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
               <p className="text-sm font-medium text-slate-500">Average Rating</p>
               <div className="flex items-center gap-2 mt-2 text-4xl font-bold text-slate-900">
                  {data.average_rating} <Star size={24} className="text-amber-400 fill-amber-400" />
               </div>
             </div>
          </div>

          {/* Feedback List */}
          <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Feedback</h2>
          <div className="space-y-4">
            {data.recent_feedbacks.length === 0 ? (
              <p className="text-slate-500 text-center py-8">No feedback received yet.</p>
            ) : (
              data.recent_feedbacks.map((fb: FeedbackItem) => (
                <div key={fb.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col sm:flex-row gap-6 items-start">
                   {/* Rating Card */}
                   <div className="flex-shrink-0 bg-slate-50 border border-slate-100 p-4 rounded-xl flex flex-col items-center justify-center w-24 h-24">
                     <span className="text-2xl font-bold text-slate-900">{fb.rating}</span>
                     <Star size={20} className={fb.rating >= 4 ? "text-green-500 fill-green-500" : "text-amber-500 fill-amber-500"} />
                   </div>
                   
                   {/* Content */}
                   <div className="flex-grow">
                     <div className="flex items-center justify-between mb-2 gap-4">
                        <p className="font-mono text-sm font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded">
                          +{fb.customer_phone}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(fb.created_at).toLocaleDateString()}
                        </p>
                     </div>
                     <p className="text-slate-800 text-sm mt-3 border-l-2 border-slate-200 pl-3 italic">
                       {fb.comment || "No comment provided."}
                     </p>
                   </div>

                   {/* Actions */}
                   <div className="flex-shrink-0 w-full sm:w-auto">
                     <button
                        onClick={() => openWhatsApp(fb.customer_phone)}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
                     >
                        <MessageSquare size={16} /> Reply
                     </button>
                   </div>
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    );
  }

  // Auth Screen
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-200 max-w-sm w-full">
        <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock size={32} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2 text-center">Owner Portal</h2>
        <p className="text-slate-500 mb-6 text-center text-sm">Enter passcode to view feedback metrics.</p>
        
        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          <input
            type="password"
            placeholder="Owner Passcode"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 transition-all"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}
          <button
            type="submit"
            disabled={isLoading || !passcode}
            className="w-full py-3 px-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {isLoading ? "Unlocking..." : "Enter"}
          </button>
        </form>
      </div>
    </div>
  );
}
