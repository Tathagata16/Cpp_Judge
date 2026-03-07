import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';

const DIFF_COLOR = {
  Easy:   'text-emerald-400',
  Medium: 'text-yellow-400',
  Hard:   'text-red-400',
};

const STATUS_COLOR = {
  Accepted:              'text-emerald-400',
  'Wrong Answer':        'text-red-400',
  'Compile Error':       'text-orange-400',
  'Runtime Error':       'text-red-400',
  'Time Limit Exceeded': 'text-purple-400',
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/profile')
      .then(({ data }) => setProfile(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-gray-400 py-20">Loading…</div>;
  if (!profile) return <div className="text-center text-red-400 py-20">Failed to load profile.</div>;

  const { user, stats, totalSubmissions, solvedProblems, recentSubmissions } = profile;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* User info */}
      <div className="flex items-center gap-5 mb-10">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-2xl font-bold text-emerald-400">
          {user.username[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-gray-400 text-sm">{user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Solved',       value: stats.total,       color: 'text-white' },
          { label: 'Easy',         value: stats.Easy,        color: 'text-emerald-400' },
          { label: 'Medium',       value: stats.Medium,      color: 'text-yellow-400' },
          { label: 'Hard',         value: stats.Hard,        color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="bg-dark-800 border border-dark-500 rounded-xl p-4 text-center">
            <div className={`text-3xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-xs text-gray-500 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Solved problems */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Solved Problems ({solvedProblems.length})
          </h2>
          <div className="bg-dark-800 border border-dark-500 rounded-xl overflow-hidden">
            {solvedProblems.length === 0 ? (
              <p className="text-gray-500 text-sm p-4">No problems solved yet. <Link to="/problems" className="text-emerald-400 hover:underline">Start here →</Link></p>
            ) : (
              <div className="divide-y divide-dark-500">
                {solvedProblems.map(p => (
                  <div key={p._id} className="flex items-center justify-between px-4 py-2.5 hover:bg-dark-700 transition-colors">
                    <Link to={`/problems/${p.slug}`} className="text-sm hover:text-emerald-400 transition-colors">
                      {p.title}
                    </Link>
                    <span className={`text-xs font-semibold ${DIFF_COLOR[p.difficulty]}`}>{p.difficulty}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent activity */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
            Recent Submissions
          </h2>
          <div className="bg-dark-800 border border-dark-500 rounded-xl overflow-hidden">
            {recentSubmissions.length === 0 ? (
              <p className="text-gray-500 text-sm p-4">No submissions yet.</p>
            ) : (
              <div className="divide-y divide-dark-500">
                {recentSubmissions.map(s => (
                  <div key={s._id} className="flex items-center justify-between px-4 py-2.5 hover:bg-dark-700 transition-colors">
                    <div>
                      <Link to={`/problems/${s.problem?.slug}`} className="text-sm hover:text-emerald-400 transition-colors">
                        {s.problem?.title || 'Unknown'}
                      </Link>
                      <p className="text-xs text-gray-500 font-mono">{new Date(s.createdAt).toLocaleString()}</p>
                    </div>
                    <span className={`text-xs font-semibold ${STATUS_COLOR[s.status]}`}>{s.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
