import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { type ReactNode, useEffect, useState } from 'react';
import { fetchMe, syncUser, type MeData } from '../api';
import { OnboardingModal } from './OnboardingModal';
import { PENDING_CAFE_NAME_KEY } from '../pages/SignupPage';

/**
 * Guards a route behind Supabase authentication.
 *
 * Additional responsibilities beyond a simple auth check:
 *  1. Fetches /api/admin/me to get backend Cafe data (onboarding status, etc.)
 *  2. If /api/admin/me returns 404, attempts POST /api/auth/sync once and retries.
 *     This handles the Google OAuth flow where the user is redirected back to
 *     /sudo without going through SignupPage or LoginPage.
 *  3. Shows the OnboardingModal if onboarding is not yet complete.
 */
export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { session, isLoading } = useAuth();
  const [me, setMe] = useState<MeData | null>(null);
  const [isMeLoading, setIsMeLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadMe = async () => {
      if (!session?.access_token) {
        setIsMeLoading(false);
        return;
      }

      try {
        const data = await fetchMe(session.access_token);
        if (isMounted) setMe(data);
      } catch (err: any) {
        // If the backend returns 404, the Cafe record doesn't exist yet.
        // This happens for Google OAuth users who skipped our signup flow.
        // Attempt a one-shot sync, then retry fetchMe.
        if (err.message?.includes('404') || err.message?.toLowerCase().includes('not found')) {
          try {
            // Pick up cafe name stored before the Google OAuth redirect
            const pendingName = localStorage.getItem(PENDING_CAFE_NAME_KEY) || undefined;
            localStorage.removeItem(PENDING_CAFE_NAME_KEY);
            await syncUser(session.access_token, pendingName);
            // Retry fetchMe after successful sync
            const retryData = await fetchMe(session.access_token);
            if (isMounted) setMe(retryData);
          } catch (syncErr: any) {
            console.error('Failed to sync and load me after 404:', syncErr);
            if (isMounted) setSyncError(syncErr.message || 'Failed to set up your account.');
          }
        } else {
          console.error('Failed to fetch me', err);
        }
      } finally {
        if (isMounted) setIsMeLoading(false);
      }
    };

    loadMe();
    return () => { isMounted = false; };
  }, [session]);

  if (isLoading || (session && isMeLoading)) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (syncError) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-red-600 font-medium text-center max-w-sm">{syncError}</p>
        <p className="text-neutral-500 text-sm text-center">
          Please refresh the page or contact support if this persists.
        </p>
      </div>
    );
  }

  return (
    <>
      {me && !me.onboarding_completed && (
        <OnboardingModal
          initialName={me.name}
          onComplete={() => setMe({ ...me, onboarding_completed: true })}
        />
      )}
      {children}
    </>
  );
};
