import Problem from '../models/Problem.js';
import Submission from '../models/Submission.js';
import { runCppCode } from '../services/judge.js';

// POST /api/submissions/run  — run code without saving, only visible test cases
export async function run(req, res) {
  try {
    const { problemSlug, code } = req.body;
    if (!problemSlug || !code)
      return res.status(400).json({ error: 'problemSlug and code are required' });

    const problem = await Problem.findOne({ slug: problemSlug });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    // Run ONLY visible test cases (faster feedback, no hidden cases)
    const visibleCases = problem.testCases.filter(tc => !tc.isHidden);
    const { passed, results, error } = await runCppCode(code, visibleCases);

    let status = 'Accepted';
    if (error) {
      status = error.includes('error:') ? 'Compile Error' : 'Runtime Error';
    } else if (!passed) {
      const tle = results.find(r => r.got === 'Time Limit Exceeded');
      status = tle ? 'Time Limit Exceeded' : 'Wrong Answer';
    }

    // Run result is NOT saved to DB
    res.json({ status, results, error });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// POST /api/submissions  — submit code, run ALL test cases, save result
export async function submit(req, res) {
  try {
    const { problemSlug, code } = req.body;
    if (!problemSlug || !code)
      return res.status(400).json({ error: 'problemSlug and code are required' });

    const problem = await Problem.findOne({ slug: problemSlug });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    // Run against ALL test cases (including hidden)
    const { passed, results, error } = await runCppCode(code, problem.testCases);

    let status = 'Accepted';
    if (error) {
      status = error.includes('error:') ? 'Compile Error' : 'Runtime Error';
    } else if (!passed) {
      const tle = results.find(r => r.got === 'Time Limit Exceeded');
      status = tle ? 'Time Limit Exceeded' : 'Wrong Answer';
    }

    // Save submission
    const submission = await Submission.create({
      user: req.user._id,
      problem: problem._id,
      code,
      status,
      results,
      error,
    });

    // Only return visible test case results to client
    const visibleResults = results.filter((_, i) => !problem.testCases[i]?.isHidden);

    res.json({ submission: { ...submission.toObject(), results: visibleResults }, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/submissions/problem/:slug  — user's past submissions for a problem
export async function getSubmissionsForProblem(req, res) {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const submissions = await Submission.find({
      user: req.user._id,
      problem: problem._id,
    }).sort({ createdAt: -1 }).limit(20);

    res.json({ submissions });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
