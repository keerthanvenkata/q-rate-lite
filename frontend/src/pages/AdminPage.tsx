import React, { useState, useEffect, useCallback } from 'react';
import { fetchAdminDashboard, fetchMe, type AdminDataResponse, type FeedbackItem, type MeData } from '../api';
import { LogOut, Star, MessageSquare, QrCode, Coffee } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import BillingTab from '../components/owner/BillingTab';
import QRCodeTab from '../components/owner/QRCodeTab';
import SettingsTab from '../components/owner/SettingsTab';

type Tab = 'overview' | 'qrcode' | 'billing' | 'settings';

export default function AdminPage() {
  const { session, signOut } = useAuth();
  const [data, setData] = useState<AdminDataResponse | null>(null);
  const [me, setMe] = useState<MeData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const loadDashboard = useCallback(async () => {
    if (!session) return;
    try {
      const [resp, meResp] = await Promise.all([
        fetchAdminDashboard(session.access_token),
        fetchMe(session.access_token),
      ]);
      setData(resp);
      setMe(meResp);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard.');
    }
  }, [session]);

  useEffect(() => {
    if (session?.access_token) {
      loadDashboard();
    }
  }, [session, loadDashboard]);

  const handleLogout = async () => {
    await signOut();
  };

  const openWhatsApp = (phone: string) => {
    const phoneLink = phone.startsWith('91') ? phone : `91${phone}`;
    window.open(`https://wa.me/${phoneLink}`, '_blank');
  };

  // Compute trial days remaining for the banner
  const trialDaysLeft = (() => {
    if (!me?.plan_expiry || me.subscription_status !== 'trial') return null;
    const expiry = new Date(me.plan_expiry);
    const now = new Date();
    const diff = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  })();

  if (error) {
    return (
      <div className="dashboard-bg p-8 flex flex-col items-center justify-center h-[50vh]">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={handleLogout} className="dashboard-btn-secondary">Logout</button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="dashboard-bg p-8 flex items-center justify-center h-[50vh]">
        <p className="text-neutral-500">Loading dashboard...</p>
      </div>
    );
  }

  const tabClass = (t: Tab) =>
    `px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
      activeTab === t
        ? 'border-black text-black'
        : 'border-transparent text-neutral-500 hover:text-black'
    }`;

  return (
    <div className="dashboard-bg p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Owner Dashboard</h1>
          <button
            onClick={handleLogout}
            className="dashboard-btn-secondary flex items-center gap-2 text-sm max-w-[120px] justify-center"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {/* Trial Expiry Banner */}
        {trialDaysLeft !== null && trialDaysLeft <= 7 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <p className="text-amber-800 font-medium text-sm">
              ⏰ Your free trial{' '}
              {trialDaysLeft <= 0
                ? 'has expired'
                : `ends in ${trialDaysLeft} day${trialDaysLeft !== 1 ? 's' : ''}`}
              . Upgrade to keep collecting feedback.
            </p>
            <button
              onClick={() => setActiveTab('billing')}
              className="dashboard-btn-primary text-sm py-2 px-4 whitespace-nowrap"
            >
              Upgrade Now →
            </button>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex space-x-1 border-b border-neutral-200 mb-8 overflow-x-auto">
          <button onClick={() => setActiveTab('overview')} className={tabClass('overview')}>Overview</button>
          <button onClick={() => setActiveTab('qrcode')} className={tabClass('qrcode')}>QR Code</button>
          <button onClick={() => setActiveTab('billing')} className={tabClass('billing')}>Billing</button>
          <button onClick={() => setActiveTab('settings')} className={tabClass('settings')}>Settings</button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div>
            {/* Stats Bar */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="dashboard-card p-6">
                <p className="text-sm font-medium text-neutral-500">Total Feedback</p>
                <p className="text-4xl font-bold text-black mt-2">{data.total_feedback}</p>
              </div>
              <div className="dashboard-card p-6">
                <p className="text-sm font-medium text-neutral-500">Average Rating</p>
                <div className="flex items-center gap-2 mt-2 text-4xl font-bold text-black">
                  {data.average_rating} <Star size={24} className="text-amber-400 fill-amber-400" />
                </div>
              </div>
            </div>

            {/* Chart Area */}
            <h2 className="text-lg font-bold text-slate-900 mb-4">Feedback Trends (30 Days)</h2>
            <div className="dashboard-card p-6 mb-8 h-80">
              {data.chart_data && data.chart_data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={data.chart_data} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#171717" stopOpacity={0.15}/>
                        <stop offset="95%" stopColor="#171717" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#888888', fontSize: 12, fontWeight: 500 }} 
                      tickLine={false} 
                      axisLine={false} 
                      dy={10}
                      tickFormatter={(val) => {
                        if (!val) return '';
                        const d = new Date(val);
                        return `${d.getDate()} ${d.toLocaleString('default', { month: 'short' })}`;
                      }}
                    />
                    <YAxis yAxisId="left" tick={{ fill: '#888888', fontSize: 12, fontWeight: 500 }} tickLine={false} axisLine={false} dx={-10} />
                    <YAxis yAxisId="right" orientation="right" domain={[0, 5]} tick={{ fill: '#888888', fontSize: 12, fontWeight: 500 }} tickLine={false} axisLine={false} dx={10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: '1px solid #eaeaea', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)', backgroundColor: '#ffffff', padding: '12px' }}
                      labelStyle={{ fontWeight: '600', color: '#171717', marginBottom: '8px' }}
                      itemStyle={{ fontWeight: '500', fontSize: '13px' }}
                      cursor={{ stroke: '#e5e5e5', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', fontWeight: 500, paddingTop: '10px' }} />
                    <Area yAxisId="left" type="monotone" dataKey="count" name="Feedback Volume" stroke="#171717" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" activeDot={{ r: 5, fill: '#171717', stroke: '#fff', strokeWidth: 2 }} />
                    <Line yAxisId="right" type="monotone" dataKey="avg_rating" name="Avg Rating" stroke="#10B981" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#10B981', stroke: '#fff', strokeWidth: 2 }} />
                  </ComposedChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
                  Not enough data to display trends
                </div>
              )}
            </div>

            {/* Feedback List */}
            <h2 className="text-lg font-bold text-slate-900 mb-4">Recent Feedback</h2>
            <div className="space-y-4">
              {data.recent_feedbacks.length === 0 ? (
                /* Rich empty state */
                <div className="dashboard-card p-10 text-center">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-neutral-200">
                    <Coffee size={32} className="text-neutral-300" />
                  </div>
                  <h3 className="text-lg font-bold text-black mb-2">No feedback yet</h3>
                  <p className="text-neutral-500 mb-6 max-w-sm mx-auto text-sm leading-relaxed">
                    Print your QR code and place it on your tables. When customers scan it,
                    they'll be prompted to leave feedback via WhatsApp.
                  </p>
                  <button
                    onClick={() => setActiveTab('qrcode')}
                    className="dashboard-btn-primary inline-flex items-center gap-2"
                  >
                    <QrCode size={16} /> Generate QR Code →
                  </button>
                </div>
              ) : (
                data.recent_feedbacks.map((fb: FeedbackItem) => (
                  <div key={fb.id} className="dashboard-card p-6 flex flex-col sm:flex-row gap-6 items-start">
                    {/* Rating Card */}
                    <div className="flex-shrink-0 border border-neutral-200 p-4 rounded-xl flex flex-col items-center justify-center w-24 h-24">
                      <span className="text-2xl font-bold text-black">{fb.rating}</span>
                      <Star size={20} className={fb.rating >= 4 ? 'text-green-500 fill-green-500' : 'text-amber-500 fill-amber-500'} />
                    </div>

                    {/* Content */}
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2 gap-4">
                        <p className="font-mono text-sm font-bold text-black border border-neutral-200 px-2 py-1 rounded">
                          +{fb.customer_phone}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {new Date(fb.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-black text-sm mt-3 border-l-2 border-neutral-200 pl-3 italic">
                        {fb.comment || 'No comment provided.'}
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
        )}

        {activeTab === 'qrcode' && (
          <QRCodeTab cafeId={data.cafe_id} />
        )}

        {activeTab === 'billing' && session && (
          <BillingTab token={session.access_token} />
        )}

        {activeTab === 'settings' && session && me && (
          <SettingsTab
            token={session.access_token}
            initialName={me.name}
            initialMapsLink={me.google_maps_link || ''}
            initialRewardText={me.reward_text || ''}
          />
        )}

      </div>
    </div>
  );
}
