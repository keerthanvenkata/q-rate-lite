import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FeedbackPage from './pages/FeedbackPage';
import StaffPage from './pages/StaffPage';
import AdminPage from './pages/AdminPage';
import SuperAdminPage from './pages/SuperAdminPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/feedback" replace />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/sudo" element={<AdminPage />} />
        <Route path="/superadmin" element={<SuperAdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
