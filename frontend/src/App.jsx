import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore.js';
import Navbar from './components/layout/Navbar.jsx';
import LoginPage from './pages/LoginPage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import ProblemsPage from './pages/ProblemsPage.jsx';
import ProblemPage from './pages/ProblemPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';

function PrivateRoute({ children }) {
  const { token, loading } = useAuthStore();
  if (loading) return <div className="flex items-center justify-center h-screen text-gray-400">Loading...</div>;
  return token ? children : <Navigate to="/login" replace />;
}

function PublicRoute({ children }) {
  const { token, loading } = useAuthStore();
  if (loading) return null;
  return token ? <Navigate to="/problems" replace /> : children;
}

export default function App() {
  const init = useAuthStore(s => s.init);
  useEffect(() => { init(); }, [init]);

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/problems" replace />} />
            <Route path="/login"   element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup"  element={<PublicRoute><SignupPage /></PublicRoute>} />
            <Route path="/problems" element={<PrivateRoute><ProblemsPage /></PrivateRoute>} />
            <Route path="/problems/:slug" element={<PrivateRoute><ProblemPage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
