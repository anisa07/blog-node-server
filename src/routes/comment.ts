import { Router } from 'express';
import commentController from '../controllers/commentController';
import { active } from '../utils/activeMiddleware';
import { auth } from '../utils/authMiddleware';

const router = Router(); 

router.put('/:id', auth, active, commentController.updateComment);

router.delete('/:id', auth, active, commentController.deleteComment);

router.post('/', auth, active, commentController.createComment);

router.get('/:id', commentController.readComment);

export default router;
