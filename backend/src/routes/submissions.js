import { Router } from 'express';
import { run, submit, getSubmissionsForProblem , getSubmissionById } from '../controllers/submissions.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/run',protect, run);       // ← NEW: run without saving
router.post('/', protect,submit);    // submit + save
router.get('/problem/:slug',protect, getSubmissionsForProblem);
router.get('/:id',protect,getSubmissionById);

export default router;
