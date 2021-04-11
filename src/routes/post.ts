import { Router } from 'express';
import postController from '../controllers/postController';
import { upload } from '../dbs/mongoDb';
import { active } from '../utils/activeMiddleware';
import { auth } from '../utils/authMiddleware';

const router = Router(); 

router.put('/:id', auth, active, upload.single('image'), postController.updatePost);

router.delete('/:id', auth, active, postController.deletePost);

router.post('/', auth, active, upload.single('image'), postController.createPost);

router.get('/', postController.readPosts);

router.get('/:id', postController.readPost);

router.delete('/image/:id', auth, active, postController.deletePostImage);

router.get('/image/:filename', postController.getPostImage);

export default router;
