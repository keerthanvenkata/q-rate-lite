import React, { useState } from 'react';
import { updateSettings, type SettingsData } from '../../api';
import { Settings, Save, Eye, EyeOff } from 'lucide-react';

interface SettingsTabProps {
  token: string;
  initialName: string;
  initialMapsLink: string;
  initialRewardText: string;
}

export default function SettingsTab({
  token,
  initialName,
  initialMapsLink,
  initialRewardText,
}: SettingsTabProps) {
  const [name, setName] = useState(initialName || '');
  const [mapsLink, setMapsLink] = useState(initialMapsLink || '');
  const [rewardText, setRewardText] = useState(initialRewardText || '10% off on your next visit');
  const [passcode, setPasscode] = useState('');
  const [passcodeConfirm, setPasscodeConfirm] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (passcode && passcode !== passcodeConfirm) {
      setError('Passcodes do not match');
      return;
    }

    if (mapsLink && !mapsLink.startsWith('http')) {
      setError('Google Maps link must start with http:// or https://');
      return;
    }

    const payload: SettingsData = {};
    if (name.trim()) payload.name = name.trim();
    if (mapsLink.trim() !== initialMapsLink) payload.google_maps_link = mapsLink.trim() || '';
    if (rewardText.trim() !== initialRewardText) payload.reward_text = rewardText.trim();
    if (passcode) payload.staff_passcode = passcode;

    if (Object.keys(payload).length === 0) {
      setSuccess('No changes to save.');
      return;
    }

    setIsSaving(true);
    try {
      await updateSettings(token, payload);
      setSuccess('Settings saved successfully!');
      setPasscode('');
      setPasscodeConfirm('');
    } catch (err: any) {
      setError(err.message || 'Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <Settings size={20} className="text-neutral-500" />
        <h2 className="text-lg font-bold text-black">Cafe Settings</h2>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic Info */}
        <div className="dashboard-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">
            Basic Information
          </h3>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              Cafe Name
            </label>
            <input
              id="settings-cafe-name"
              type="text"
              className="dashboard-input"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your cafe's name"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              Google Maps Link{' '}
              <span className="text-neutral-400 font-normal">(for 4–5 star redirect)</span>
            </label>
            <input
              id="settings-maps-link"
              type="url"
              className="dashboard-input"
              value={mapsLink}
              onChange={e => setMapsLink(e.target.value)}
              placeholder="https://maps.google.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              Coupon Reward Text
            </label>
            <input
              id="settings-reward-text"
              type="text"
              className="dashboard-input"
              value={rewardText}
              onChange={e => setRewardText(e.target.value)}
              placeholder="e.g. 10% off on your next visit"
            />
            <p className="text-xs text-neutral-400 mt-1">
              Shown to staff when redeeming a customer coupon.
            </p>
          </div>
        </div>

        {/* Staff Passcode */}
        <div className="dashboard-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-widest">
            Staff Passcode
          </h3>
          <p className="text-sm text-neutral-500">
            Leave blank to keep the current passcode unchanged.
          </p>

          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-1">
              New Passcode
            </label>
            <div className="relative">
              <input
                id="settings-new-passcode"
                type={showPasscode ? 'text' : 'password'}
                className="dashboard-input pr-10"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
                placeholder="Enter new passcode"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowPasscode(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
              >
                {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {passcode && (
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">
                Confirm New Passcode
              </label>
              <input
                id="settings-confirm-passcode"
                type={showPasscode ? 'text' : 'password'}
                className="dashboard-input"
                value={passcodeConfirm}
                onChange={e => setPasscodeConfirm(e.target.value)}
                placeholder="Repeat the new passcode"
                autoComplete="new-password"
              />
            </div>
          )}
        </div>

        {/* Feedback */}
        {error && (
          <div className="text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-700 text-sm font-medium bg-green-50 p-3 rounded-lg border border-green-100">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={isSaving}
          className="dashboard-btn-primary flex items-center gap-2"
        >
          <Save size={16} />
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
