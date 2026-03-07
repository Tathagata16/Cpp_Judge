import Problem from '../models/Problem.js';
import Submission from '../models/Submission.js';

// GET /api/problems  — list all problems (no test case details)
export async function getProblems(req, res) {
  try {
    const problems = await Problem.find()
      .select('-testCases -starterCode')
      .sort({ order: 1 });
    res.json({ problems });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/problems/:slug  — single problem with visible test cases
export async function getProblem(req, res) {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    // Strip hidden test cases before sending to client
    const visible = {
      ...problem.toObject(),
      testCases: problem.testCases.filter(tc => !tc.isHidden),
    };

    res.json({ problem: visible });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// GET /api/problems/:slug/status — has the logged-in user solved this?
export async function getProblemStatus(req, res) {
  try {
    const problem = await Problem.findOne({ slug: req.params.slug });
    if (!problem) return res.status(404).json({ error: 'Problem not found' });

    const solved = await Submission.exists({
      user: req.user._id,
      problem: problem._id,
      status: 'Accepted',
    });

    res.json({ solved: !!solved });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
