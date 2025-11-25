import express from 'express';
import { createQuiz, getQuizzes, getQuizById, attemptQuiz } from './quiz.controller';
import { protect, authorize } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/', protect, authorize('teacher', 'admin'), createQuiz);
router.get('/', getQuizzes);
router.get('/:id', getQuizById);
router.post('/attempt', protect, attemptQuiz);

export default router;
