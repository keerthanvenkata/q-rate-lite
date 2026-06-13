import React, { useState, useEffect } from 'react';
import { fetchAllCafes, updateCafeSubscription, fetchAuditLogs, fetchContactMessages } from '../api';
import { ShieldAlert, Activity, Check, FileText, MessageSquare, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function SuperAdminPage() {
  const { session, signOut } = useAuth();
  const [cafes, setCafes] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"cafes" | "logs" | "messages">("cafes");

  useEffect(() => {
    if (session?.access_token) {
      loadData();
    }
  }, [session]);

  const loadData = async () => {
    if (!session) return;
    try {
      const [cafeResp, logsResp, msgResp] = await Promise.all([
        fetchAllCafes(session.access_token),
        fetchAuditLogs(session.access_token),
        fetchContactMessages(session.access_token)
      ]);
      setCafes(cafeResp.cafes);
      setAuditLogs(logsResp.logs);
      setMessages(msgResp.messages);
    } catch (err: any) {
      alert(`Failed to load superadmin data: ${err.message || 'Unauthorized access'}`);
    }
  };

  const handleSubChange = async (cafeId: number, status: string, plan: string) => {
    if (!confirm(`Change cafe ${cafeId} to ${status} - ${plan}?`)) return;
    if (!session) return;
    try {
      await updateCafeSubscription(cafeId, session.access_token, status, plan);
      // Refresh
      const [cafeResp, logsResp] = await Promise.all([
        fetchAllCafes(session.access_token),
        fetchAuditLogs(session.access_token)
      ]);
      setCafes(cafeResp.cafes);
      setAuditLogs(logsResp.logs);
    } catch (err) {
      alert("Failed to update.");
    }
  };

  if (!session) {
    return (
      <div className="dashboard-bg flex flex-col items-center justify-center h-screen p-4">
        <ShieldAlert className="text-black mx-auto mb-4" size={48} />
        <h1 className="text-black text-center font-bold text-2xl mb-6">System Override</h1>
        <p className="text-neutral-500 mb-4">Please log in to access Sudo Control.</p>
        <button onClick={() => window.location.href = '/'} className="dashboard-btn-primary">Return Home</button>
      </div>
    );
  }

  return (
    <div className="dashboard-bg p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-black flex items-center gap-3">
            <Activity className="text-black" /> Sudo Control
          </h1>
          <button onClick={() => signOut()} className="text-sm dashboard-btn-secondary flex items-center gap-2 max-w-[120px] justify-center ml-4">
            <LogOut size={16} /> Logout
          </button>
          <div className="flex gap-4 ml-auto">
            <button onClick={() => setActiveTab("cafes")} className={`px-4 py-2 rounded-lg font-bold border transition-colors ${activeTab === 'cafes' ? 'bg-black text-white border-black' : 'bg-white text-black border-neutral-200 hover:bg-neutral-50'}`}>Cafes</button>
            <button onClick={() => setActiveTab("logs")} className={`px-4 py-2 rounded-lg font-bold border transition-colors ${activeTab === 'logs' ? 'bg-black text-white border-black' : 'bg-white text-black border-neutral-200 hover:bg-neutral-50'}`}>Audit Logs</button>
            <button onClick={() => setActiveTab("messages")} className={`px-4 py-2 rounded-lg font-bold border transition-colors flex items-center gap-2 ${activeTab === 'messages' ? 'bg-black text-white border-black' : 'bg-white text-black border-neutral-200 hover:bg-neutral-50'}`}>
              Messages
              {messages.filter(m => m.status === 'unread').length > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{messages.filter(m => m.status === 'unread').length}</span>
              )}
            </button>
          </div>
        </div>

        {activeTab === "cafes" && (
          <div className="dashboard-card overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-neutral-50 text-neutral-600 text-sm border-b border-neutral-200">
                <tr>
                  <th className="p-4 font-semibold">ID</th>
                  <th className="p-4 font-semibold">Cafe Name</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Plan</th>
                  <th className="p-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {cafes.map(cafe => (
                  <tr key={cafe.id} className="bg-white">
                    <td className="p-4 font-mono">{cafe.id}</td>
                    <td className="p-4 font-bold">{cafe.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${cafe.subscription_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {cafe.subscription_status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">{cafe.subscription_plan || 'N/A'}</td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => handleSubChange(cafe.id, 'active', 'monthly')} className="text-xs border border-neutral-200 hover:bg-neutral-50 px-3 py-1 rounded font-semibold text-black transition-colors">Set Monthly</button>
                      <button onClick={() => handleSubChange(cafe.id, 'active', 'annual')} className="text-xs border border-neutral-200 hover:bg-neutral-50 px-3 py-1 rounded font-semibold text-black transition-colors">Set Annual</button>
                      <button onClick={() => handleSubChange(cafe.id, 'cancelled', '')} className="text-xs bg-black text-white hover:bg-neutral-800 px-3 py-1 rounded font-semibold transition-colors">Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="dashboard-card p-0">
            <div className="bg-black p-6 text-green-400 font-mono text-sm h-[600px] overflow-y-auto">
              {auditLogs.map(log => (
                <div key={log.id} className="mb-4 border-b border-neutral-800 pb-4">
                  <p className="text-neutral-400 mb-1">[{new Date(log.created_at).toISOString()}] <span className="text-blue-400">ACTOR:</span> {log.actor} <span className="text-amber-400">ACTION:</span> {log.action}</p>
                  {log.target_cafe_id && <p>Target Cafe: {log.target_cafe_id}</p>}
                  <p className="text-neutral-300">Details: {log.details}</p>
                </div>
              ))}
              {auditLogs.length === 0 && <p className="text-neutral-500">No logs generated yet.</p>}
            </div>
          </div>
        )}

        {activeTab === "messages" && (
          <div className="dashboard-card overflow-hidden">
            {messages.length === 0 ? (
              <div className="p-8 text-center text-neutral-500 font-medium">No contact messages received.</div>
            ) : (
              <div className="divide-y divide-neutral-200">
                {messages.map(msg => (
                  <div key={msg.id} className={`p-6 hover:bg-neutral-50 transition-colors ${msg.status === 'unread' ? 'bg-neutral-50' : ''}`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-black text-lg flex items-center gap-2">
                          {msg.name} 
                          {msg.status === 'unread' && <span className="bg-black text-white text-xs px-2 py-0.5 rounded uppercase font-bold">New</span>}
                        </h3>
                        <p className="text-neutral-500 text-sm">
                          <a href={`mailto:${msg.email}`} className="text-black hover:underline font-medium">{msg.email}</a> 
                          {msg.phone && <span className="ml-2">| {msg.phone}</span>}
                          {msg.company && <span className="ml-2">| {msg.company}</span>}
                        </p>
                      </div>
                      <span className="text-neutral-400 text-xs font-mono">{new Date(msg.created_at).toLocaleString()}</span>
                    </div>
                    <div className="bg-neutral-100 p-4 rounded-lg text-black whitespace-pre-wrap font-serif text-sm border border-neutral-200">
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
