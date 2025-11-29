import express from 'express';
import { register, login, getMe, updateProfile, verifyEmail, resendOtp } from './auth.controller';
import { protect } from '../../middleware/auth.middleware';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/resend-otp', resendOtp);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);

export default router;
