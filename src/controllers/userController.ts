
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { userService } from '../services/userService';
import { redisService } from '../services/redisService';
import { sendEmail } from '../utils/sendEmail';
import { gfsService } from '../services/gfsService';
import { STATE, USER_TYPE } from '../models/User';

const DAY_IN_MILSEC = 86400000;
const QUARTER_IN_MILSEC = 900000;
const passwordRegexp = new RegExp(process.env.PWD_REGEXP as string);
const emailRegexp = new RegExp(process.env.EMAIL_REGEXP as string);

const generateToken = async (email: string, userId: string, expiresIn?: number) => {
    const salt = crypto.randomBytes(64).toString('hex');
    const exp = expiresIn || DAY_IN_MILSEC;
    await redisService.setItem(userId, salt, Math.round(exp / 1000));
    return jwt.sign({ email, userId }, salt, { expiresIn: exp });
};

const encryptPassword = async (password: string) => {
    const salt = await bcrypt.genSalt(Number(process.env.SALT_ROUNDS));
    return bcrypt.hash(password, salt);
}

class UserController {
    async signup(req: express.Request, res: express.Response) {
        const password = req.body.password;
        const email = req.body.email;
        const name = req.body.name;

        if (!name || !name.trim()) {
            return res.status(400).send({
                type: 'ERROR',
                message: 'Name is to short'
            });
        }

        if (!email || !emailRegexp.test(email)) {
            return res.status(400).send({
                type: 'ERROR',
                message: 'Email is incorrect'
            });
        }

        if (!password || !passwordRegexp.test(password)) {
            return res.status(400).send({
                type: 'ERROR',
                message: 'Password is too weak'
            });
        }

        const user = await userService.findUserByQuery({ email });

        if (user) {
            return res.status(409).send({
                type: 'ERROR',
                message: 'User already exists'
            });
        }

        const encryptedPassword = await encryptPassword(password);

        try {
            const newUser = await userService.createUser({
                ...req.body,
                password: encryptedPassword
            });
            const token = await generateToken(email, newUser._id);
            res.json({
                name: req.body.name,
                email: req.body.email,
                id: newUser._id,
                token,
                password: ''
            });
        } catch (e) {
            return res.status(500).send({
                type: 'ERROR',
                message: 'Error occurs creating user'
            });
        }
    }

    async login(req: express.Request, res: express.Response) {
        const { password, email } = req.body;

        if (!password || !password.trim() || !email || !email.trim()) {
            return res.status(400).send({
                type: 'ERROR',
                message: 'Invalid data'
            });
        }

        const user = await userService.findUserByQuery({ email });

        if (!user) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'User not found'
            });
        }

        const compareResult = await bcrypt.compare(password, user.password);

        if (!compareResult) {
            return res.status(401).send({
                type: 'ERROR',
                message: 'Password or email is incorrect'
            });
        }

        try {
            const token = await generateToken(email, user._id);
            res.json({
                ...req.body,
                id: user._id,
                token,
                password: ''
            });
        } catch (e) {
            return res.status(500).send({
                type: 'ERROR',
                message: 'Error occurs during login'
            });
        }
    }

    async logout(req: express.Request, res: express.Response) {
        const userId = req.headers.id as string;
        const user = await userService.findUserByQuery({ _id: userId as string });

        if (!user) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'User not found'
            });
        }

        try {
            await redisService.delItem(userId);
            return res.status(200).send()
        } catch (e) {
            return res.status(500).send({
                type: 'ERROR',
                message: 'Error occurs during logout'
            });
        }
    }

    async isAuth(req: express.Request, res: express.Response) {
        const token = (req.headers.authorization || '').split(' ')[1];
        const userId = req.headers.id;

        if (!userId) {
            return res.status(401).send({
                type: 'ERROR',
                message: 'Not authorised'
            });
        }

        const user = await userService.findUserByQuery({ _id: userId as string });

        if (!user) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'User not found'
            });
        }

        const salt = await redisService.getItem(userId as string);
        
        if (!salt) {
            return res.status(401).send({
                type: 'ERROR',
                message: 'Not authorised'
            });
        }
        try {
            const decodedToken = jwt.verify(token, salt) as { exp: number, userId: string };
            if (decodedToken.userId === userId) {
                res.json({
                    auth: true
                });
            }
            return res.status(401).send({
                type: 'ERROR',
                message: 'Not authorised'
            });
        } catch (e) {
            return res.status(401).send({
                type: 'ERROR',
                message: 'Not authorised'
            });
        }
    }

    async forgotPassword(req: express.Request, res: express.Response) {
        const { email } = req.body;
        const user = await userService.findUserByQuery({ email });

        if (!user) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'User does not exist'
            });
        }

        const token = await generateToken(email, user.id, QUARTER_IN_MILSEC);
        const link = `${process.env.CLIENT_URL}/password-reset?token=${token}&id=${user.id}`;
        try {
            await sendEmail(email, { name: user.name, link }, res);
        } catch (error) {
            return res.status(500).send({
                type: 'ERROR',
                message: 'Error sending email'
            });
        }
    }

    async changePassword(req: express.Request, res: express.Response) {
        const { token, password } = req.body;
        const id = req.headers.id as string;
        const user = await userService.findUserByQuery({ _id: id });

        if (!password || !passwordRegexp.test(password)) {
            return res.status(400).send({
                type: 'ERROR',
                message: 'Password is too weak'
            });
        }

        if (!user) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'User does not exist'
            });
        }

        const salt = await redisService.getItem(id);
        if (!salt) {
            return res.status(401).send({
                type: 'ERROR',
                message: 'Not authorised'
            });
        }

        try {
            const decodedToken = jwt.verify(token, salt) as { exp: number, userId: string };
            if (decodedToken.userId === id) {
                user.password = await encryptPassword(password);
                await user.save();
                await redisService.delItem(user._id);
                return res.status(200).send();
            }
        } catch (e) {
            return res.status(401).send({
                type: 'ERROR',
                message: 'Not authorised'
            });
        }
    }

    async updateUserInfo(req: express.Request, res: express.Response) {
        const userId = req.headers.id;
        const user = await userService.findUserByQuery({ _id: userId as string });
        if (!req.file) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'Photo is not attached'
            });
        }
        if (user) {
            const oldFile = user.filename;
            if (user.filename) {
                await gfsService.deleteItem(oldFile, res, req.file.filename);
            }
            user.bio = req.body.bio;
            user.filename = req.file.filename;
            await user.save();
            return res.status(200).json({
                bio: user.bio,
                filename: user.filename,
            });
        }
    }

    async getUserInfo(req: express.Request, res: express.Response) {
        const userId = req.headers.id;
        const user = await userService.findUserByQuery({ _id: userId as string });
        if (user) {
            return res.status(200).json({
                bio: user.bio,
                filename: user.filename,
                email: user.email,
                name: user.name
                // TODO other things later after posts and followers .etc
            });
        }
    }

    async getUserPhoto(req: express.Request, res: express.Response) {
        const filename = req.params.filename;
        return gfsService.getItem(filename, res);
    }

    async deletePhoto(req: express.Request, res: express.Response) {
        const filename = req.params.filename;
        const userId = req.headers.id;
        const user = await userService.findUserByQuery({ _id: userId as string });
        await gfsService.deleteItem(filename, res);
        if (user && user.filename === filename) {
            user.filename = "";
            user.save();
        }
        return res.status(200).send();
    }

    async manageUserData(req: express.Request, res: express.Response) {
        const {state, bio, removePhoto, filename, id} = req.body;
        const userIdToChange = id;
        const superUserId = req.headers.id;
        const superUser = await userService.findUserByQuery({ _id: superUserId as string });
        const userToChange = await userService.findUserByQuery({ _id: userIdToChange as string });
        if (!userToChange) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'User not found'
            });
        }
        
        if (!superUser || superUser.type.toUpperCase() !== USER_TYPE.SUPER
        || userToChange.type === USER_TYPE.SUPER || userIdToChange === superUserId) {
            return res.status(401).send({
                type: 'ERROR',
                message: 'Not authorised'
            });
        }

        if (removePhoto) {
            await gfsService.deleteItem(filename,res)
            userToChange.filename = "";
        }

        if (bio && bio.trim()) {
            userToChange.bio = bio;
        }

        if (state && Object.values(STATE).includes(state)) {
            userToChange.state = state; 
        }

        userToChange.save();

        return res.status(200).send();
    }
}

const userController = new UserController();

export default userController;
