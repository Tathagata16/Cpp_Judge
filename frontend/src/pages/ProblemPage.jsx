import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Editor from '@monaco-editor/react';
import api from '../utils/api.js';

const DIFF_COLOR = {
  Easy:   'text-emerald-400',
  Medium: 'text-yellow-400',
  Hard:   'text-red-400',
};

const STATUS_STYLE = {
  'Accepted':              'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
  'Wrong Answer':          'bg-red-500/15 text-red-400 border-red-500/30',
  'Compile Error':         'bg-orange-500/15 text-orange-400 border-orange-500/30',
  'Runtime Error':         'bg-red-500/15 text-red-400 border-red-500/30',
  'Time Limit Exceeded':   'bg-purple-500/15 text-purple-400 border-purple-500/30',
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2.5 py-1 rounded border text-sm font-semibold ${STATUS_STYLE[status] || ''}`}>
      {status}
    </span>
  );
}

// Result panel shown after Run or Submit
function ResultPanel({ result, mode }) {
  if (!result) return null;
  const isAccepted = result.status === 'Accepted';

  return (
    <div className="border-t border-dark-500 bg-dark-800 p-4 overflow-y-auto" style={{ maxHeight: '220px' }}>
      <div className="flex items-center gap-3 mb-3">
        <StatusBadge status={result.status} />
        {mode === 'run' && (
          <span className="text-xs text-gray-500 font-mono bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
            Run (visible cases only)
          </span>
        )}
        {isAccepted && mode === 'submit' && (
          <span className="text-emerald-400 text-sm">🎉 All test cases passed!</span>
        )}
      </div>

      {/* Compile / runtime error */}
      {result.error && (
        <pre className="text-xs text-red-300 font-mono bg-red-900/10 border border-red-500/20 rounded p-3 overflow-x-auto whitespace-pre-wrap">
          {result.error}
        </pre>
      )}

      {/* Per test-case results */}
      {result.results?.length > 0 && (
        <div className="space-y-1.5">
          {result.results.map((r, i) => (
            <div
              key={i}
              className={`text-xs font-mono px-3 py-2 rounded border flex flex-wrap items-center gap-x-4 gap-y-1 ${
                r.passed
                  ? 'border-emerald-500/20 bg-emerald-900/10'
                  : 'border-red-500/20 bg-red-900/10'
              }`}
            >
              <span className={r.passed ? 'text-emerald-400' : 'text-red-400'}>
                {r.passed ? '✓' : '✗'} Case {i + 1}
              </span>
              {!r.passed && (
                <>
                  <span className="text-gray-400">
                    Input: <span className="text-gray-200">{r.input || '(empty)'}</span>
                  </span>
                  <span className="text-gray-400">
                    Expected: <span className="text-yellow-300">{r.expected}</span>
                  </span>
                  <span className="text-gray-400">
                    Got: <span className="text-red-300">{r.got}</span>
                  </span>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProblemPage() {
  const { slug } = useParams();
  const [problem, setProblem] = useState(null);
  const [code, setCode] = useState('');
  const [running, setRunning]   = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult]   = useState(null);
  const [resultMode, setResultMode] = useState(null); // 'run' | 'submit'
  const [activeTab, setActiveTab] = useState('description');
  const [submissions, setSubmissions] = useState([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  useEffect(() => {
    api.get(`/api/problems/${slug}`).then(({ data }) => {
      setProblem(data.problem);
      setCode(data.problem.starterCode || '');
    });
  }, [slug]);

  // ── Run (visible test cases, not saved) ─────────────────────────────────
  const handleRun = async () => {
    setRunning(true);
    setResult(null);
    try {
      const { data } = await api.post('/api/submissions/run', { problemSlug: slug, code });
      setResult(data);
      setResultMode('run');
    } catch (err) {
      setResult({ status: 'Runtime Error', error: err.response?.data?.error || 'Unknown error', results: [] });
      setResultMode('run');
    } finally {
      setRunning(false);
    }
  };

  // ── Submit (all test cases, saved to DB) ────────────────────────────────
  const handleSubmit = async () => {
    setSubmitting(true);
    setResult(null);
    try {
      const { data } = await api.post('/api/submissions', { problemSlug: slug, code });
      setResult({ ...data, results: data.submission?.results, error: data.submission?.error });
      setResultMode('submit');
    } catch (err) {
      setResult({ status: 'Runtime Error', error: err.response?.data?.error || 'Unknown error', results: [] });
      setResultMode('submit');
    } finally {
      setSubmitting(false);
    }
  };

  const loadSubmissions = async () => {
    setLoadingSubs(true);
    try {
      const { data } = await api.get(`/api/submissions/problem/${slug}`);
      setSubmissions(data.submissions);
    } catch (e) { console.error(e); }
    finally { setLoadingSubs(false); }
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    if (tab === 'submissions') loadSubmissions();
  };

  if (!problem) return (
    <div className="flex items-center justify-center h-full text-gray-400 py-20">Loading…</div>
  );

  return (
    <div className="flex h-[calc(100vh-57px)]">

      {/* ── Left: problem description ─────────────────────────────────── */}
      <div className="w-[420px] flex-shrink-0 border-r border-dark-500 flex flex-col overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-dark-500 bg-dark-800">
          {['description', 'submissions'].map(tab => (
            <button
              key={tab}
              onClick={() => switchTab(tab)}
              className={`px-4 py-3 text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'text-white border-b-2 border-emerald-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === 'description' && (
            <>
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-xl font-bold">{problem.title}</h1>
                <span className={`text-sm font-semibold ${DIFF_COLOR[problem.difficulty]}`}>
                  {problem.difficulty}
                </span>
              </div>

              <div className="flex flex-wrap gap-1 mb-5">
                {problem.tags?.map(t => (
                  <span key={t} className="text-xs font-mono text-gray-500 bg-dark-600 px-2 py-0.5 rounded">{t}</span>
                ))}
              </div>

              <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-mono">
                {problem.description}
              </div>

              {/* Visible sample test cases */}
              {problem.testCases?.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-gray-400 mb-3">
                    Sample Test Cases
                    <span className="ml-2 text-xs text-gray-600 font-normal">(Run uses these)</span>
                  </h3>
                  {problem.testCases.map((tc, i) => (
                    <div key={i} className="mb-3 bg-dark-700 rounded-lg p-3 border border-dark-500">
                      <div className="mb-2">
                        <span className="text-xs text-gray-500 font-mono">Input</span>
                        <pre className="text-sm text-gray-200 font-mono mt-0.5">{tc.input || '(empty)'}</pre>
                      </div>
                      <div>
                        <span className="text-xs text-gray-500 font-mono">Expected Output</span>
                        <pre className="text-sm text-emerald-300 font-mono mt-0.5">{tc.expectedOutput}</pre>
                      </div>
                    </div>
                  ))}
                  <p className="text-xs text-gray-600 font-mono mt-2">
                    * Submit also runs hidden test cases
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'submissions' && (
            <div>
              <h2 className="text-sm font-semibold text-gray-400 mb-4">Your Submissions</h2>
              {loadingSubs ? (
                <p className="text-gray-500 text-sm">Loading…</p>
              ) : submissions.length === 0 ? (
                <p className="text-gray-500 text-sm">No submissions yet.</p>
              ) : (
                <div className="space-y-2">
                  {submissions.map(s => (
                    <div key={s._id} className="bg-dark-700 border border-dark-500 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <StatusBadge status={s.status} />
                        <span className="text-xs text-gray-500 font-mono">
                          {new Date(s.createdAt).toLocaleString()}
                        </span>
                      </div>
                      {s.error && (
                        <pre className="text-xs text-red-300 font-mono mt-2 overflow-x-auto">{s.error}</pre>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Right: editor + result ─────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Toolbar */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-dark-500 bg-dark-800">
          <span className="text-xs text-gray-500 font-mono">C++ (g++ -std=c++17)</span>
          <div className="flex items-center gap-2">
            {/* Run button */}
            <button
              onClick={handleRun}
              disabled={running || submitting}
              className="px-4 py-1.5 rounded border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 disabled:opacity-40 text-sm font-semibold transition-colors flex items-center gap-1.5"
            >
              {running ? (
                <><span className="animate-spin inline-block">⟳</span> Running…</>
              ) : (
                <><span>▷</span> Run</>
              )}
            </button>

            {/* Submit button */}
            <button
              onClick={handleSubmit}
              disabled={running || submitting}
              className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-black text-sm font-semibold rounded transition-colors flex items-center gap-1.5"
            >
              {submitting ? (
                <><span className="animate-spin inline-block">⟳</span> Submitting…</>
              ) : (
                <><span>▶</span> Submit</>
              )}
            </button>
          </div>
        </div>

        {/* Monaco editor */}
        <div className="flex-1 overflow-hidden">
          <Editor
            height="100%"
            language="cpp"
            theme="vs-dark"
            value={code}
            onChange={val => setCode(val || '')}
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              padding: { top: 12 },
              lineNumbers: 'on',
              renderLineHighlight: 'line',
              tabSize: 4,
            }}
          />
        </div>

        {/* Result panel */}
        <ResultPanel result={result} mode={resultMode} />
      </div>
    </div>
  );
}
