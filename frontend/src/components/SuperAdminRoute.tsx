import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { type ReactNode } from 'react';

/**
 * Guards a route so only the superadmin email can access it.
 *
 * Without this guard, any authenticated cafe owner could navigate to /superadmin
 * and see the page shell (even though the API calls would all fail with 403).
 * This provides defence-in-depth at the frontend routing layer.
 *
 * The VITE_SUPERADMIN_EMAIL env var should match the SUPERADMIN_EMAIL value
 * configured on the backend.
 */
export const SuperAdminRoute = ({ children }: { children: ReactNode }) => {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  const SUPERADMIN_EMAIL = import.meta.env.VITE_SUPERADMIN_EMAIL as string | undefined;
  const userEmail = session.user?.email;

  // If VITE_SUPERADMIN_EMAIL isn't set, block access entirely in non-dev environments
  if (!SUPERADMIN_EMAIL) {
    if (import.meta.env.DEV) {
      // Allow access in local dev if the var isn't configured (e.g., first-time setup)
      console.warn('[DEV] VITE_SUPERADMIN_EMAIL is not set. SuperAdmin access is unguarded in dev mode.');
      return <>{children}</>;
    }
    return <Navigate to="/sudo" replace />;
  }

  if (userEmail !== SUPERADMIN_EMAIL) {
    return <Navigate to="/sudo" replace />;
  }

  return <>{children}</>;
};
