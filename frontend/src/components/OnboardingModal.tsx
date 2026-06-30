import React, { useState } from 'react';
import { updateOnboarding } from '../api';
import { useAuth } from '../context/AuthContext';
import { Store, MapPin, Tag, KeyRound, CheckCircle, ChevronRight } from 'lucide-react';

interface OnboardingModalProps {
  initialName: string;
  onComplete: () => void;
}

const TOTAL_STEPS = 3;

export const OnboardingModal = ({ initialName, onComplete }: OnboardingModalProps) => {
  const { session } = useAuth();
  const [step, setStep] = useState(1);

  // Step 1
  const [name, setName] = useState(initialName && initialName !== 'My Cafe' ? initialName : '');

  // Step 2
  const [mapsLink, setMapsLink] = useState('');
  const [rewardText, setRewardText] = useState('10% off on your next visit');

  // Step 3
  const [passcode, setPasscode] = useState('');
  const [passcodeConfirm, setPasscodeConfirm] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const goNext = () => {
    setError(null);

    if (step === 1) {
      if (!name.trim()) { setError('Cafe name is required'); return; }
    }

    if (step === 2) {
      if (mapsLink && !mapsLink.startsWith('http')) {
        setError('Please enter a valid URL starting with http:// or https://');
        return;
      }
    }

    if (step === 3) {
      if (passcode && passcode !== passcodeConfirm) {
        setError('Passcodes do not match');
        return;
      }
    }

    if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
    }
  };

  const handleFinish = async () => {
    if (!session) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await updateOnboarding(session.access_token, {
        name: name.trim(),
        google_maps_link: mapsLink.trim() || undefined,
        reward_text: rewardText.trim() || undefined,
        staff_passcode: passcode || undefined,
      });
      onComplete();
    } catch (err: any) {
      setError(err.message || 'Failed to save. Please try again.');
      setIsSubmitting(false);
    }
  };

  const StepIndicator = () => (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map(s => (
        <React.Fragment key={s}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
              s < step ? 'bg-black text-white' :
              s === step ? 'bg-black text-white' :
              'bg-neutral-100 text-neutral-400'
            }`}
          >
            {s < step ? <CheckCircle size={16} /> : s}
          </div>
          {s < TOTAL_STEPS && (
            <div className={`flex-1 h-0.5 transition-colors ${s < step ? 'bg-black' : 'bg-neutral-200'}`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white p-8 max-w-md w-full rounded-2xl shadow-2xl border border-neutral-200">
        <div className="mb-2">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            Setup · Step {step} of {TOTAL_STEPS}
          </span>
        </div>

        <StepIndicator />

        {/* Step 1: Cafe Name */}
        {step === 1 && (
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-neutral-100 p-2 rounded-lg border border-neutral-200">
                <Store size={20} className="text-black" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-black">What's your cafe called?</h2>
                <p className="text-sm text-neutral-500">This name appears on your dashboard</p>
              </div>
            </div>
            <input
              id="onboarding-cafe-name"
              type="text"
              placeholder="e.g. Blue Tokai Coffee Roasters"
              className="dashboard-input"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </div>
        )}

        {/* Step 2: Google Maps + Reward */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-neutral-100 p-2 rounded-lg border border-neutral-200">
                <MapPin size={20} className="text-black" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-black">Boost your reviews</h2>
                <p className="text-sm text-neutral-500">Redirect happy customers to Google</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">
                Google Maps Link <span className="text-neutral-400 font-normal">(optional)</span>
              </label>
              <input
                id="onboarding-maps-link"
                type="url"
                placeholder="https://maps.google.com/..."
                className="dashboard-input"
                value={mapsLink}
                onChange={e => setMapsLink(e.target.value)}
              />
              <p className="text-xs text-neutral-400 mt-1">
                Customers who rate 4–5 stars will be redirected here.
              </p>
            </div>

            <div>
              <label className="flex items-center gap-1 text-sm font-semibold text-neutral-700 mb-1">
                <Tag size={14} /> Coupon Reward Text
              </label>
              <input
                id="onboarding-reward-text"
                type="text"
                className="dashboard-input"
                value={rewardText}
                onChange={e => setRewardText(e.target.value)}
                placeholder="10% off on your next visit"
              />
              <p className="text-xs text-neutral-400 mt-1">
                Shown to customers when staff redeems their coupon.
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Staff Passcode */}
        {step === 3 && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-neutral-100 p-2 rounded-lg border border-neutral-200">
                <KeyRound size={20} className="text-black" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-black">Staff passcode</h2>
                <p className="text-sm text-neutral-500">Used by staff to redeem customer coupons</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-1">
                Passcode <span className="text-neutral-400 font-normal">(optional, set later in Settings)</span>
              </label>
              <input
                id="onboarding-passcode"
                type="password"
                placeholder="Choose a staff passcode"
                className="dashboard-input"
                value={passcode}
                onChange={e => setPasscode(e.target.value)}
              />
            </div>

            {passcode && (
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-1">Confirm Passcode</label>
                <input
                  id="onboarding-passcode-confirm"
                  type="password"
                  placeholder="Repeat the passcode"
                  className="dashboard-input"
                  value={passcodeConfirm}
                  onChange={e => setPasscodeConfirm(e.target.value)}
                />
              </div>
            )}

            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
              <p className="text-xs text-neutral-500">
                <strong>Tip:</strong> Your staff will enter this passcode at{' '}
                <code className="bg-neutral-200 px-1 rounded text-xs">/staff</code>{' '}
                when redeeming a customer's coupon. You can change it anytime from Settings.
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 text-red-600 text-sm font-medium bg-red-50 p-3 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          {step > 1 && (
            <button
              type="button"
              onClick={() => { setError(null); setStep(s => s - 1); }}
              className="dashboard-btn-secondary flex-1"
            >
              Back
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={goNext}
              className="dashboard-btn-primary flex-1 flex items-center justify-center gap-2"
            >
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              disabled={isSubmitting}
              className="dashboard-btn-primary flex-1 flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Saving...' : <><CheckCircle size={16} /> Finish Setup</>}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
