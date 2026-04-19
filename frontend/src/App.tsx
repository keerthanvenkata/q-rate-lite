import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FeedbackPage from './pages/FeedbackPage';
import StaffPage from './pages/StaffPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/feedback" replace />} />
        <Route path="/feedback" element={<FeedbackPage />} />
        <Route path="/staff" element={<StaffPage />} />
        {/* Placeholder for sudo page */}
        <Route path="/sudo" element={<div className="p-4">Sudo Page</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
