import React, { useState } from 'react';
import { updateOnboarding } from '../api';
import { useAuth } from '../context/AuthContext';

interface OnboardingModalProps {
  initialName: string;
  onComplete: () => void;
}

export const OnboardingModal = ({ initialName, onComplete }: OnboardingModalProps) => {
  const [name, setName] = useState(initialName !== "My Cafe" ? initialName : "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Cafe name is required");
      return;
    }
    
    if (!session) return;

    setIsSubmitting(true);
    setError(null);
    try {
      await updateOnboarding(session.access_token, name.trim());
      onComplete();
    } catch (err: any) {
      setError(err.message || "Failed to save.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white p-8 max-w-md w-full rounded-2xl shadow-2xl border border-neutral-200">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to Q-Rate Lite!</h2>
        <p className="text-slate-600 mb-6 font-medium">
          Let's get started. What is the name of your Cafe?
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label htmlFor="cafeName" className="block text-sm font-semibold text-neutral-700 mb-2">
              Exact Cafe Name
            </label>
            <input
              id="cafeName"
              type="text"
              placeholder="e.g. Blue Tokai Coffee Roasters"
              className="dashboard-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !name.trim()}
            className="dashboard-btn-primary py-3 mt-4"
          >
            {isSubmitting ? "Saving..." : "Save & Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};
