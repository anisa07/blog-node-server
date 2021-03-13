import { Router } from 'express';
import userController from '../controllers/userController';
import { upload } from '../dbs/mongoDb';
import { auth } from '../utils/authMiddleware';

const router = Router(); 

// // Login
router.post('/login', userController.login);

// // Logout
router.post('/logout', userController.logout);

// Signup
router.post('/signup', userController.signup);

// IsAuth
router.get('/auth', userController.isAuth);

// forgot-password
router.post('/forgot-password', userController.forgotPassword);

// change-password
router.post('/change-password', userController.changePassword);

// user-info (read, edit)
router.post('/user-info', auth, upload.single('photo'), userController.updateUserInfo);
router.get('/user-info', auth, userController.getUserInfo);
router.get('/user-photo/:filename', auth,  userController.getUserPhoto);
router.delete('/user-photo/:filename', auth, userController.deletePhoto);

// chnage-user/:id
// delete-user/:id

export default router;
