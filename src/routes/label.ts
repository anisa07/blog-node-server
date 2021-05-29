import { Router } from 'express';
import labelController from '../controllers/labelController';
import { active } from '../utils/activeMiddleware';
import { auth } from '../utils/authMiddleware';

const router = Router(); 

router.put('/:labelId', auth, active, labelController.updateLabel);

router.delete('/:labelId', auth, active, labelController.deleteLabel);

router.post('/', auth, active, labelController.createLabel);

router.get('/', labelController.readLabels);

export default router;
