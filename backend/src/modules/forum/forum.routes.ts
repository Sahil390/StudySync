import express from 'express';
import { createQuestion, getQuestions, getQuestionById, addAnswer, upvoteAnswer, verifyAnswer } from './forum.controller';
import { protect, authorize } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/', protect, createQuestion);
router.get('/', getQuestions);
router.get('/:id', getQuestionById);
router.post('/:id/answers', protect, addAnswer);
router.put('/:questionId/answers/:answerId/upvote', protect, upvoteAnswer);
router.put('/:questionId/answers/:answerId/verify', protect, authorize('teacher', 'admin'), verifyAnswer);

export default router;
