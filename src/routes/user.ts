import { Router } from 'express';
import userController from '../controllers/userController';

const router = Router(); 

router.get('/user-info', (req, res) => {
    return res.send('user-info');
  });

// // Login
router.post('/login', userController.login);

// // Logout
router.post('/logout', userController.logout);

// Signup
router.post('/signup', userController.signup);

// // IsAuth
// router.get('/auth', userController.isAuth);

// // forgot-password
// router.post('/forgot-password', userController.forgotPassword);

// // change-password
// router.post('/change-password', userController.changePassword);

// user-info/:id (read, edit)
// block-user/:id
// delete-user/:id

export default router;
