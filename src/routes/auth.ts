import { Router } from 'express';
import userController from '../controllers/userController';
import { active } from '../utils/activeMiddleware';
const router = Router();

// Login
router.post('/login', active, userController.login);

// Logout
router.post('/logout', userController.logout);

// Signup
router.post('/signup', userController.signup);

// IsAuth
router.get('/auth', userController.isAuth);

// forgot-password
router.post('/forgot-password', active, userController.forgotPassword);

// change-password
router.post('/change-password', active, userController.changePassword);

export default router;
