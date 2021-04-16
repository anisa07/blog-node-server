import { Router } from 'express';
import likeController from '../controllers/likeController';
import { active } from '../utils/activeMiddleware';
import { auth } from '../utils/authMiddleware';

const router = Router(); 

router.put('/', auth, active, likeController.changeLike);

router.post('/', auth, active, likeController.setLike);

router.get('/user/post/:postId', auth, active, likeController.getLikeByPostUser)

router.get('/post/:postId', likeController.getLikeValueForPost)

export default router;
