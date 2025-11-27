import express from 'express';
import { createQuiz, getQuizzes, getQuizById, attemptQuiz, seedQuiz } from './quiz.controller';
import { protect, authorize } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/seed', seedQuiz);
router.post('/', protect, authorize('admin'), createQuiz);
router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.post('/attempt', protect, attemptQuiz);

export default router;
