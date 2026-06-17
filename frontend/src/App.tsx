import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import ScrollToTop from './components/ScrollToTop';

const LandingPage = lazy(() => import('./pages/LandingPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const FeedbackPage = lazy(() => import('./pages/FeedbackPage'));
const StaffPage = lazy(() => import('./pages/StaffPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const SuperAdminPage = lazy(() => import('./pages/SuperAdminPage'));
const MarketingPage = lazy(() => import('./pages/MarketingPage'));
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'));
const TermsPage = lazy(() => import('./pages/TermsPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <ScrollToTop />
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />
            <Route path="/staff" element={<ProtectedRoute><StaffPage /></ProtectedRoute>} />
            <Route path="/sudo" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
            <Route path="/superadmin" element={<ProtectedRoute><SuperAdminPage /></ProtectedRoute>} />
            <Route path="/marketing" element={<ProtectedRoute><MarketingPage /></ProtectedRoute>} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
