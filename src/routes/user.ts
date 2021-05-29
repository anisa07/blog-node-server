import {Router} from 'express';
import postController from '../controllers/postController';
import userController from '../controllers/userController';
import {upload} from '../dbs/mongoDb';
import {active} from '../utils/activeMiddleware';
import {auth} from '../utils/authMiddleware';

const router = Router();

// user-info (read, edit)
router.post('/info', auth, active, upload.single('photo'), userController.updateUserInfo);
router.get('/info/:userId', userController.getUserInfo);
router.get('/photo/:filename', userController.getUserPhoto);
router.delete('/photo/:filename', auth, active, userController.deletePhoto);
router.delete('/:userId', auth, active, userController.deleteUser);

// manage-user
router.post('/manage', auth, active, userController.manageUserData);

// follow
router.post('/follow', auth, active, userController.followUser);
router.delete('/follow/:followId', auth, active, userController.unFollowUser);
router.get('/follow/posts', auth, active, postController.showFollowPosts);
router.get('/follow/:followId', userController.doIFollowUser);

// user
router.get('/', auth, active, userController.getUsersBy);

export default router;
