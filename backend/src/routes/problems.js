import { Router } from 'express';
import { getProblems, getProblem, getProblemStatus } from '../controllers/problems.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/',protect, getProblems);
router.get('/:slug',protect, getProblem);
router.get('/:slug/status',protect, getProblemStatus);

export default router;
