import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore.js';

export default function SignupPage() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const signup = useAuthStore(s => s.signup);
  const navigate = useNavigate();

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup(form.username, form.email, form.password);
      navigate('/problems');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-57px)] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">Create account</h1>
        <p className="text-gray-400 text-sm mb-8">Start solving C++ problems today.</p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Username</label>
            <input
              name="username" value={form.username} onChange={handle} required minLength={3}
              className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="johndoe"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              name="email" type="email" value={form.email} onChange={handle} required
              className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              name="password" type="password" value={form.password} onChange={handle} required minLength={6}
              className="w-full bg-dark-700 border border-dark-500 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              placeholder="min. 6 characters"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit" disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-black font-semibold py-2.5 rounded-lg transition-colors"
          >
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-emerald-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}
