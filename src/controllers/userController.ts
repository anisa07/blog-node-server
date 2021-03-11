
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { userService } from '../services/userService';
import { redisService } from '../services/redisService';
import { sendEmail } from '../utils/sendEmail';

const DAY_IN_MILSEC = 86400000;
const QUARTER_IN_MILSEC = 900000;

const generateToken = async (email: string, userId: string, expiresIn?: number) => {
    const salt = crypto.randomBytes(64).toString('hex');
    const exp = expiresIn || DAY_IN_MILSEC;
    await redisService.setItem(userId, salt, Math.round(exp/1000));
    return jwt.sign({ email, userId }, salt, { expiresIn: (exp + Date.now())});
};

class UserController {
    async signup(req: express.Request, res: express.Response) {
        const passwordRegexp = new RegExp(process.env.PWD_REGEXP as string);
        const emailRegexp = new RegExp(process.env.EMAIL_REGEXP as string);
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

        const salt = await bcrypt.genSalt(11);
        const encryptedPassword = await bcrypt.hash(password, salt);
        try {
            const newUser = await userService.createUser({
                ...req.body,
                password: encryptedPassword
            });
            const token = await generateToken(email, newUser._id);
            res.json({
                ...req.body,
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
        const { email } = req.body;
        const user = await userService.findUserByQuery({ email });

        if (!user) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'User not found'
            });
        }

        try {
            await redisService.delItem(user._id);
            res.status(200).send()
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
        const salt = await redisService.getItem(userId as string);
        if(!salt) {
            return res.status(401).send({
                type: 'ERROR',
                message: 'Not authorised'
            }); 
        }
        try {
            const decodedToken = jwt.verify(token, salt) as {exp: number, userId: string};
            if (decodedToken.exp > Date.now()) {
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
        const {email} = req.body;
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
            await sendEmail(email, {name: user.name, link}, res);
        } catch (error) {
            return res.status(500).send({
                type: 'ERROR',
                message: 'Error sending email'
            });
        }
    }
}

const userController = new UserController();

export default userController;
