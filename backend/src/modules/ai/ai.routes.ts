import express from 'express';
import { askAI } from './ai.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/ask', protect, askAI);

export default router;
