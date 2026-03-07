import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => { logout(); navigate('/login'); };

  const navLink = (to, label) => (
    <Link
      to={to}
      className={`text-sm font-medium transition-colors ${
        pathname.startsWith(to) ? 'text-emerald-400' : 'text-gray-400 hover:text-white'
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="border-b border-dark-500 bg-dark-800 px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link to="/" className="font-bold text-lg tracking-tight">
        <span className="text-emerald-400">&lt;</span>
        CppJudge
        <span className="text-emerald-400">/&gt;</span>
      </Link>

      <div className="flex items-center gap-6">
        {user && navLink('/problems', 'Problems')}
        {user && navLink('/profile', 'Profile')}
      </div>

      <div className="flex items-center gap-3">
        {user ? (
          <>
            <span className="text-sm text-gray-400 font-mono">{user.username}</span>
            <button
              onClick={handleLogout}
              className="text-sm px-3 py-1.5 rounded border border-dark-500 text-gray-400 hover:border-red-500 hover:text-red-400 transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login"  className="text-sm text-gray-400 hover:text-white transition-colors">Login</Link>
            <Link to="/signup" className="text-sm px-3 py-1.5 rounded bg-emerald-500 hover:bg-emerald-400 text-black font-semibold transition-colors">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}
