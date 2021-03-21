import { Router } from 'express';
import postsController from '../controllers/postsController';
import { upload } from '../dbs/mongoDb';
import { active } from '../utils/activeMiddleware';
import { auth } from '../utils/authMiddleware';

const router = Router(); 

router.put('/:id', auth, active, upload.single('image'), postsController.updatePost);

router.delete('/:id', auth, active, postsController.deletePost);

router.post('/', auth, active, upload.single('image'), postsController.createPost);

router.get('/', postsController.readPosts);

router.get('/:id', postsController.readPost);

router.delete('/delete-post-image:id', auth, active, postsController.deletePostImage);

export default router;
