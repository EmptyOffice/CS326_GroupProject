import { Router } from 'express';
import * as authController from '../controllers/authController.js';
import { asyncHandler } from '../asynchandler.js';

const router = Router();

router.post('/signup', asyncHandler(authController.signupUser));
router.post('/login', asyncHandler(authController.loginUser));
router.post('/logout', authController.logoutUser);
router.get('/me', authController.currentUser);

export default router;
