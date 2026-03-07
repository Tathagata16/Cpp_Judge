import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api.js';

const DIFF_COLOR = {
  Easy:   'text-emerald-400 bg-emerald-400/10',
  Medium: 'text-yellow-400 bg-yellow-400/10',
  Hard:   'text-red-400 bg-red-400/10',
};

export default function ProblemsPage() {
  const [problems, setProblems] = useState([]);
  const [solvedIds, setSolvedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    async function load() {
      try {
        const { data } = await api.get('/api/problems');
        setProblems(data.problems);

        // Load solved status for each problem in parallel
        const statuses = await Promise.all(
          data.problems.map(p => api.get(`/api/problems/${p.slug}/status`).then(r => ({ slug: p.slug, solved: r.data.solved })))
        );
        setSolvedIds(new Set(statuses.filter(s => s.solved).map(s => s.slug)));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filtered = filter === 'All' ? problems : problems.filter(p => p.difficulty === filter);
  const totalSolved = solvedIds.size;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-1">Problems</h1>
        <p className="text-gray-400 text-sm">{totalSolved} / {problems.length} solved</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {['All','Easy','Medium','Hard'].map(d => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filter === d ? 'bg-emerald-500 text-black' : 'bg-dark-700 border border-dark-500 text-gray-400 hover:border-gray-400'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="text-gray-400 text-sm">Loading problems…</div>
      ) : (
        <div className="border border-dark-500 rounded-xl overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-500 bg-dark-800">
                <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-4 py-3 w-8">#</th>
                <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-4 py-3">Title</th>
                <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-4 py-3">Difficulty</th>
                <th className="text-left text-xs text-gray-500 uppercase tracking-wider px-4 py-3">Tags</th>
                <th className="text-center text-xs text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p._id} className="border-b border-dark-500 last:border-0 hover:bg-dark-700 transition-colors">
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono">{i + 1}</td>
                  <td className="px-4 py-3">
                    <Link to={`/problems/${p.slug}`} className="text-sm font-medium hover:text-emerald-400 transition-colors">
                      {p.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${DIFF_COLOR[p.difficulty]}`}>
                      {p.difficulty}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.tags?.map(t => (
                        <span key={t} className="text-xs text-gray-500 bg-dark-600 px-2 py-0.5 rounded font-mono">{t}</span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {solvedIds.has(p.slug) ? (
                      <span className="text-emerald-400 text-lg" title="Solved">✓</span>
                    ) : (
                      <span className="text-gray-600 text-lg">–</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
