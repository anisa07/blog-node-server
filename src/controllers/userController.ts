import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import {userService} from '../services/userService';
import {redisService} from '../services/redisService';
import {sendEmail} from '../utils/sendEmail';
import {gfsService} from '../services/gfsService';
import {STATE, USER_TYPE, UserModel} from '../models/User';
import {followerFollowService} from '../services/followFollowerService';
import {FollowerFollowModel} from '../models/FollowerFollow';
import {POSTS_LIST_SIZE} from "../utils/constants";
import {PaginateResult} from "mongoose";

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

export const isAuth = async (userId: string, token: string) => {
    if (!userId) {
        return false
    }

    const user = await userService.findUserByQuery({ _id: userId as string });

    if (!user) {
        return false
    }

    const salt = await redisService.getItem(userId as string);

    if (!salt) {
        return false
    }

    try {
        const decodedToken = jwt.verify(token, salt) as { exp: number, userId: string };
        return decodedToken.userId === userId;
    } catch (e) {
        return false
    }
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

        const user = await userService.findUserByQuery({ email }) as UserModel;

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
                status: user.state,
                id: user._id,
                token,
                password: ''
            });
        } catch (e) {
            return res.status(500).send({
                type: 'ERROR',
                message: 'Server error occurs during login'
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

    async forgotPassword(req: express.Request, res: express.Response) {
        const { email } = req.body;
        const user = await userService.findUserByQuery({ email });

        if (!user) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'User does not exist'
            });
        }

        const token = await generateToken(email, user._id, QUARTER_IN_MILSEC);
        const link = `${process.env.CLIENT_URL}/user/reset-password?token=${token}&id=${user._id}`;
        try {
            await sendEmail(email, { name: user.name, link }, res);
        } catch (error) {
            return res.status(500).send({
                type: 'ERROR',
                message: 'Error sending email'
            });
        }
    }

    async isAuth(req: express.Request, res: express.Response) {
        const token = (req.headers.authorization || '').split(' ')[1];
        const userId = req.headers.id as string;
        const auth = await isAuth(userId, token);

        return res.status(200).send(auth);
    }

    async changePassword(req: express.Request, res: express.Response) {
        const headersId = req.headers.id;
        const { password, id } = req.body;
        const token = (req.headers.authorization || '').split(' ')[1] || req.body?.token;
        const userId = id || headersId;
        const user = await userService.findUserByQuery({ _id: userId });

        if (!password || !passwordRegexp.test(password)) {
            return res.status(400).send({
                type: 'ERROR',
                message: 'Password is too weak'
            });
        }

        if (!user) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'User not found'
            });
        }

        const userIsAuth = await isAuth(userId, token);
        if (!userIsAuth) {
            const salt = await redisService.getItem(userId);
            if (!salt) {
                return res.status(403).send({
                    type: 'ERROR',
                    message: 'Not authorised'
                });
            }

            try {
                const decodedToken = jwt.verify(token, salt) as { exp: number, userId: string };
                if (decodedToken.userId === userId) {
                    user.password = await encryptPassword(password);
                    await user.save();
                    await redisService.delItem(userId);
                    return res.status(200).send();
                }
            } catch (e) {
                return res.status(403).send({
                    type: 'ERROR',
                    message: 'Not authorised'
                });
            }
        } else {
            user.password = await encryptPassword(password);
            await user.save();
            return res.status(200).send();
        }

    }

    async updateUserInfo(req: express.Request, res: express.Response) {
        const user = await userService.findUserByQuery({ _id: req.body.id as string });
        const filename = req.file?.filename || '';
        try {
            if (user) {
                const oldFile = user.filename;
                if (oldFile && filename && filename !== oldFile) {
                    await gfsService.deleteItem(oldFile, res, filename);
                    user.filename = filename;
                }
                if (!filename && oldFile) {
                    await gfsService.deleteItem(oldFile, res);
                    user.filename = '';
                }
                if (filename && !oldFile) {
                    user.filename = filename;
                }
                user.name = req.body.name;
                user.bio = req.body.bio;
                await user.save();
                return res.status(200).json({});
            }
        } catch (e) {
            return res.status(500).send({
                type: 'ERROR',
                message: 'Server error'
            });
        }
    }

    async getUserInfo(req: express.Request, res: express.Response) {
        const id: string = req.params.id as string;
        const currentUserId = req.headers.id;
        const currentUser = currentUserId ? await userService.findUserByQuery({ _id: currentUserId as string }) : null;
        const userInfo = await userService.findUserByQuery({ _id: id });
        if (currentUser && userInfo && (currentUser.type === USER_TYPE.SUPER || userInfo._id.toString() === currentUserId)) {
            return res.status(200).json({
                id,
                bio: userInfo.bio,
                filename: userInfo.filename,
                email: userInfo.email,
                name: userInfo.name,
                type: userInfo.type,
                state: userInfo.state
            });
        } else {
           if (userInfo) {
               return res.status(200).json({
                   id,
                   bio: userInfo.bio,
                   filename: userInfo.filename,
                   name: userInfo.name,
                   type: userInfo.type,
                   state: userInfo.state
               });
           } else return res.status(200).json({
               id,
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
        const user = await userService.findUserByQuery({ _id: userId as string }) as UserModel;
        await gfsService.deleteItem(filename, res);
        if (user && user.filename === filename) {
            user.filename = "";
            user.save();
        }
        return res.status(200).send();
    }

    async deleteUser(req: express.Request, res: express.Response) {
        const currentUserId = req.headers.id;
        const userId = req.params.id;
        const user = await userService.findUserByQuery({ _id: userId as string });
        const currentUser = await userService.findUserByQuery({ _id: currentUserId as string });

        if (!currentUser ||
            ((user.type === USER_TYPE.SUPER || currentUser.type !== USER_TYPE.SUPER)
                && currentUserId !== userId)) {
            return res.status(401).send({
                type: 'ERROR',
                message: 'Not authorised'
            });
        }

        if (user && user.state === STATE.ACTIVE) {
            user.state = STATE.DELETED;
            user.save();
        }
        return res.status(200).send();
    }

    async manageUserData(req: express.Request, res: express.Response) {
        const {state, bio, removePhoto, filename, _id, type} = req.body;
        const userIdToChange = _id;
        const superUserId = req.headers.id;
        const superUser = await userService.findUserByQuery({ _id: superUserId as string });
        const userToChange = await userService.findUserByQuery({ _id: userIdToChange as string });

        if (!userToChange) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'User not found'
            });
        }
        
        if (!superUser || ((superUser.type !== USER_TYPE.SUPER
        || userToChange.type === USER_TYPE.SUPER) && userIdToChange !== superUserId)) {
            return res.status(403).send({
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

        if (type && Object.values(USER_TYPE).includes(type)) {
            userToChange.type = type;
        }

        userToChange.save();

        return res.status(200).send({});
    }

    async followUser(req: express.Request, res: express.Response) {
        const userId = req.headers.id as string;
        const {follow} = req.body;
        const userToFollow = await userService.findUserByQuery({_id: follow});

        if (!userToFollow || userToFollow.state !== STATE.ACTIVE) {
            return res.status(400).send({
                type: 'ERROR',
                message: 'Impossible to follow this user'
            });
        }

        await followerFollowService.follow({follow, follower: userId} as FollowerFollowModel);
        return res.status(200).send({});
    }

    async doIFollowUser(req: express.Request, res: express.Response) {
        const userId = req.headers.id as string;
        const followId = req.params.id;
        const followUser = await userService.findUserByQuery({_id: followId as string}) as UserModel;

        if(!userId) {
            return res.status(401).send({
                type: 'ERROR',
                message: 'Not authorised'
            });
        }

        if(!followUser) {
            return res.status(404).send({
                type: 'ERROR',
                message: 'User not found'
            });
        }

        const follow = await followerFollowService.findFollower(followId, userId);
        res.status(200).send(!!follow)
    }

    async unFollowUser(req: express.Request, res: express.Response) {
        const userId = req.headers.id as string;
        const follow = req.params.id;
        await followerFollowService.unfollow(userId, follow);
        return res.status(200).send({});
    }

    async getUsersBy(req: express.Request, res: express.Response) {
        const {size, searchText, page} = req.query;
        const userId = req.headers.id as string;
        const currentUser = await userService.findUserByQuery({_id: userId as string}) as UserModel;
        const usersListSize = Number(size) || POSTS_LIST_SIZE;
        const usersPage = Number(page) || 1;

        if (!currentUser || currentUser.type !== USER_TYPE.SUPER) {
            return res.status(403).send({
                    type: 'ERROR',
                    message: 'This user cannot get these data!'
                }
            );
        }

        let data: PaginateResult<UserModel>;
        // let usersData: {data: PaginateResult<UserModel>, commentsCount: number, labelsCount: number, postCounts: number};
        const query = {
            sort: '-updatedAt',
            text: searchText as string || '',
            page: usersPage,
            size: usersListSize
        }

        data = await userService.findUsersByQuery(query);
        // for (const u of data.docs) {
        //
        // }
        //
        //
        // get number of comments per user
        // get user labels
        // get user number of posts
        // get likes

        return res.status(200).send({
            users: data.docs.map(item => {
                item.id = item._id;
                return item;
            }),
            hasNextPage: data.hasNextPage,
            hasPreviousPage: data.hasPrevPage,
            totalDocs: data.totalDocs,
            totalPages: data.totalPages
        })
    }
}

const userController = new UserController();

export default userController;
