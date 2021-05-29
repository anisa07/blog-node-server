import { Router } from 'express';
import postController from '../controllers/postController';
import { upload } from '../dbs/mongoDb';
import { active } from '../utils/activeMiddleware';
import { auth } from '../utils/authMiddleware';

const router = Router(); 

router.put('/:postId', auth, active, upload.single('image'), postController.updatePost);

router.delete('/:postId', auth, active, postController.deletePost);

router.post('/', auth, active, upload.single('image'), postController.createPost);

router.get('/', postController.readPosts);

router.get('/:postId', postController.readPost);

router.delete('/image/:postId', auth, active, postController.deletePostImage);

router.get('/image/:filename', postController.getPostImage);

export default router;
