import { Router } from 'express';
import userController from '../controllers/userController';
import { upload } from '../dbs/mongoDb';
import { active } from '../utils/activeMiddleware';
import { auth } from '../utils/authMiddleware';

const router = Router(); 

// // Login
router.post('/login', active, userController.login);

// // Logout
router.post('/logout', userController.logout);

// Signup
router.post('/signup', userController.signup);

// IsAuth
router.get('/auth', active, userController.isAuth);

// forgot-password
router.post('/forgot-password', active, userController.forgotPassword);

// change-password
router.post('/change-password', active, userController.changePassword);

// user-info (read, edit)
router.post('/user-info', auth, active, upload.single('photo'), userController.updateUserInfo);
router.get('/user-info', auth, active, userController.getUserInfo);
router.get('/user-photo/:filename', auth, active, userController.getUserPhoto);
router.delete('/user-photo/:filename', auth, active, userController.deletePhoto);

// manage-user
router.post('/manage-user', auth, active, userController.manageUserData);

export default router;
