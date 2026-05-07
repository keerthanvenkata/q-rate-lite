import React, { useState, useEffect } from 'react';
import { fetchAllCafes, updateCafeSubscription, fetchAuditLogs } from '../api';
import { ShieldAlert, Activity, Check, FileText } from 'lucide-react';

export default function SuperAdminPage() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cafes, setCafes] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"cafes" | "logs">("cafes");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Fetch both to verify passcode
      const [cafeResp, logsResp] = await Promise.all([
        fetchAllCafes(passcode),
        fetchAuditLogs(passcode)
      ]);
      setCafes(cafeResp.cafes);
      setAuditLogs(logsResp.logs);
      setIsAuthenticated(true);
    } catch (err) {
      alert("Invalid Sudo Passcode");
    }
  };

  const handleSubChange = async (cafeId: number, status: string, plan: string) => {
    if (!confirm(`Change cafe ${cafeId} to ${status} - ${plan}?`)) return;
    try {
      await updateCafeSubscription(cafeId, passcode, status, plan);
      // Refresh
      const [cafeResp, logsResp] = await Promise.all([
        fetchAllCafes(passcode),
        fetchAuditLogs(passcode)
      ]);
      setCafes(cafeResp.cafes);
      setAuditLogs(logsResp.logs);
    } catch (err) {
      alert("Failed to update.");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-slate-800 p-8 rounded-xl max-w-sm w-full">
          <ShieldAlert className="text-red-500 mx-auto mb-4" size={48} />
          <h1 className="text-white text-center font-bold text-2xl mb-6">System Override</h1>
          <input 
            type="password" 
            placeholder="SUDO PASSCODE" 
            className="w-full p-3 rounded bg-slate-900 text-red-500 font-mono text-center mb-4 outline-none border border-slate-700 focus:border-red-500"
            value={passcode}
            onChange={e => setPasscode(e.target.value)}
          />
          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold p-3 rounded">AUTHORIZE</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <Activity className="text-blue-600" /> Sudo Control
          </h1>
          <div className="flex gap-4">
            <button onClick={() => setActiveTab("cafes")} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'cafes' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}>Cafes</button>
            <button onClick={() => setActiveTab("logs")} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'logs' ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700'}`}>Audit Logs</button>
          </div>
        </div>

        {activeTab === "cafes" && (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-slate-100 text-slate-600 text-sm">
                <tr>
                  <th className="p-4">ID</th>
                  <th className="p-4">Cafe Name</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Plan</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cafes.map(cafe => (
                  <tr key={cafe.id} className="border-t border-slate-100">
                    <td className="p-4 font-mono">{cafe.id}</td>
                    <td className="p-4 font-bold">{cafe.name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${cafe.subscription_status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {cafe.subscription_status.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-4">{cafe.subscription_plan || 'N/A'}</td>
                    <td className="p-4 flex gap-2">
                      <button onClick={() => handleSubChange(cafe.id, 'active', 'monthly')} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded font-semibold text-slate-700">Set Monthly</button>
                      <button onClick={() => handleSubChange(cafe.id, 'active', 'annual')} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded font-semibold text-slate-700">Set Annual</button>
                      <button onClick={() => handleSubChange(cafe.id, 'cancelled', '')} className="text-xs bg-red-50 hover:bg-red-100 px-3 py-1 rounded font-semibold text-red-600">Cancel</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "logs" && (
          <div className="bg-slate-900 rounded-xl shadow-sm overflow-hidden p-6 text-green-400 font-mono text-sm h-[600px] overflow-y-auto">
            {auditLogs.map(log => (
              <div key={log.id} className="mb-4 border-b border-slate-800 pb-4">
                <p className="text-slate-500 mb-1">[{new Date(log.created_at).toISOString()}] <span className="text-blue-400">ACTOR:</span> {log.actor} <span className="text-amber-400">ACTION:</span> {log.action}</p>
                {log.target_cafe_id && <p>Target Cafe: {log.target_cafe_id}</p>}
                <p className="text-slate-300">Details: {log.details}</p>
              </div>
            ))}
            {auditLogs.length === 0 && <p className="text-slate-500">No logs generated yet.</p>}
          </div>
        )}
      </div>
    </div>
  );
}
