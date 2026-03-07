import Submission from '../models/Submission.js';
import Problem from '../models/Problem.js';

// GET /api/profile  — logged-in user's full profile + stats
export async function getProfile(req, res) {
  try {
    const userId = req.user._id;

    // All accepted submissions (distinct problems)
    const acceptedSubmissions = await Submission.find({
      user: userId,
      status: 'Accepted',
    }).populate('problem', 'title slug difficulty');

    // Deduplicate by problem
    const solvedMap = new Map();
    for (const sub of acceptedSubmissions) {
      if (sub.problem && !solvedMap.has(String(sub.problem._id))) {
        solvedMap.set(String(sub.problem._id), sub.problem);
      }
    }
    const solvedProblems = Array.from(solvedMap.values());

    // Count by difficulty
    const stats = { Easy: 0, Medium: 0, Hard: 0, total: solvedProblems.length };
    for (const p of solvedProblems) stats[p.difficulty]++;

    // Total submissions
    const totalSubmissions = await Submission.countDocuments({ user: userId });

    // Recent submissions (last 10)
    const recentSubmissions = await Submission.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('problem', 'title slug difficulty');

    res.json({
      user: req.user,
      stats,
      totalSubmissions,
      solvedProblems,
      recentSubmissions,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
