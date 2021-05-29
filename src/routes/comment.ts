import { Router } from 'express';
import commentController from '../controllers/commentController';
import { active } from '../utils/activeMiddleware';
import { auth } from '../utils/authMiddleware';

const router = Router(); 

router.put('/:commentId', auth, active, commentController.updateComment);

router.delete('/:commentId', auth, active, commentController.deleteComment);

router.post('/', auth, active, commentController.createComment);

router.get('/:commentId', commentController.readComment);

router.get('/post/:postId', commentController.readAllPostComments);

export default router;
