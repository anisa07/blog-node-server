import { Router } from 'express';
import likeController from '../controllers/likeController';
import { active } from '../utils/activeMiddleware';
import { auth } from '../utils/authMiddleware';

const router = Router(); 

router.put('/:id', auth, active, likeController.changeLike);

router.post('/', auth, active, likeController.setLike);

router.get('/:postId', auth, active, likeController.getLikeByUser)

export default router;
