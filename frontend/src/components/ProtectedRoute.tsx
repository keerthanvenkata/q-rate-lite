import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { type ReactNode, useEffect, useState } from 'react';
import { fetchMe, type MeData } from '../api';
import { OnboardingModal } from './OnboardingModal';

export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { session, isLoading } = useAuth();
  const [me, setMe] = useState<MeData | null>(null);
  const [isMeLoading, setIsMeLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    if (session?.access_token) {
      fetchMe(session.access_token)
        .then((data) => {
          if (isMounted) setMe(data);
        })
        .catch((err) => {
          console.error("Failed to fetch me", err);
        })
        .finally(() => {
          if (isMounted) setIsMeLoading(false);
        });
    } else {
      setIsMeLoading(false);
    }
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
