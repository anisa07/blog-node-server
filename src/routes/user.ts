import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerDocument } from '../swagger';
import postController from '../controllers/postController';
import userController from '../controllers/userController';
import { upload } from '../dbs/mongoDb';
import { active } from '../utils/activeMiddleware';
import { auth } from '../utils/authMiddleware';
import * as fs from "fs";

const router = Router(); 

// // Login
router.post('/login', active, userController.login);

// // Logout
router.post('/logout', userController.logout);

// Signup
router.post('/signup', userController.signup);

// IsAuth
router.get('/auth', userController.isAuth);

// forgot-password
router.post('/forgot-password', active, userController.forgotPassword);

// change-password
router.post('/change-password', active, userController.changePassword);

// user-info (read, edit)
router.post('/user-info', auth, active, upload.single('photo'), userController.updateUserInfo);
router.get('/user-info/:id', userController.getUserInfo);
router.get('/user-photo/:filename', userController.getUserPhoto);
router.delete('/user-photo/:filename', auth, active, userController.deletePhoto);
router.delete('/user/:id', auth, active, userController.deleteUser);

// manage-user
router.post('/manage-user', auth, active, userController.manageUserData);

router.post('/follow', auth, active, userController.followUser);
router.delete('/follow/:id', auth, active, userController.unFollowUser);
router.get('/follow/posts', auth, active, postController.showFollowPosts);
router.get('/follow/:id', userController.doIFollowUser);

router.get('/users', auth, active, userController.getUsersBy);

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));

router.get('/api-docs/download/swagger/json', (req, res) => {
    const swagger = JSON.stringify(swaggerDocument);
    const dir = `${__dirname}/${process.env.API_VERSION}`;
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFile(`${dir}/swagger.json`, swagger, (err) => {
        if(err) {
            return console.log(err);
        }
        const file = `${__dirname}/${process.env.API_VERSION}/swagger.json`;
        res.download(file);
    });
})
export default router;
