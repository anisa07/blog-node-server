import UserController from '../controllers/userController';
import express from 'express';

jest.mock('ioredis')
jest.mock('bcrypt')
const bcryptMock = require('bcrypt');
jest.mock('jsonwebtoken')
const jwtMock = require('jsonwebtoken');
jest.mock('crypto')
const cryptoMock = require('crypto');
jest.mock('../services/userService');
const userServiceMock = require('../services/userService');
jest.mock('../services/saltService');
const saltServiceMock = require('../services/saltService');
jest.mock('../services/redisService');
const redisServiceMock = require('../services/redisService');


describe('user controller', () => {
    bcryptMock.genSalt = jest.fn().mockReturnValue(Promise.resolve('salt'));
    bcryptMock.hash = jest.fn().mockReturnValue(Promise.resolve('hash'));
    jwtMock.sign = jest.fn().mockReturnValue('token');
    cryptoMock.randomBytes = jest.fn().mockReturnValue({
        toString: jest.fn().mockReturnValue('secret')
    });
    saltServiceMock.saltService.createSaltForUser = jest.fn().mockReturnValue(Promise.resolve());
    redisServiceMock.redisService.setItem = jest.fn().mockReturnValue(Promise.resolve());
    
    it('successful signup', async () => {
        userServiceMock.userService.findUserByQuery = jest.fn().mockReturnValue(Promise.resolve(null));
        userServiceMock.userService.createUser = jest.fn().mockReturnValue(Promise.resolve({
            _id: 'newuserId'
        }));
        const body = {
            name: "yoda",
            email: "yoda@mail.com",
            password: "Yoda1234",
        }
        const req = {
            body
        } as express.Request;
        const res = {
           status: jest.fn().mockReturnValue({
               send: jest.fn()
           }),
           json: jest.fn()
        } as unknown as express.Response;

        await UserController.signup(req, res);
        expect(userServiceMock.userService.findUserByQuery).toBeCalledWith({email: body.email});
        expect(bcryptMock.genSalt).toHaveBeenCalled();
        expect(bcryptMock.hash).toHaveBeenCalledWith(body.password, 'salt');
        expect(userServiceMock.userService.createUser).toHaveBeenCalledWith({...body, password: 'hash'});
        expect(res.json).toHaveBeenCalledWith({...body, password: '', token: 'token', id: 'newuserId'}); 
    });

    it('unsuccessful signup - short name', async () => {
        const body1 = {
            name: "",
            email: "yoda@mail.com",
            password: "Yoda1234",
        }

        const req1 = {
            body: body1
        } as express.Request;
        const send = jest.fn();
        const res = {
           status: jest.fn().mockReturnValue({
               send
           }),
           json: jest.fn()
        } as unknown as express.Response;

        await UserController.signup(req1, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(send).toHaveBeenCalledWith({"message": "Name is to short", "type": "ERROR"});
    })

    it('unsuccessful signup - email is incorrect', async () => {
        const body1 = {
            name: "mango",
            email: "mail.com@some",
            password: "Yoda1234",
        }

        const req1 = {
            body: body1
        } as express.Request;
        const send = jest.fn();
        const res = {
           status: jest.fn().mockReturnValue({
               send
           }),
           json: jest.fn()
        } as unknown as express.Response;

        await UserController.signup(req1, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(send).toHaveBeenCalledWith({"message": "Email is incorrect", "type": "ERROR"});
    })

    it('unsuccessful signup - password is incorrect', async () => {
        const body1 = {
            name: "mango",
            email: "yoda@mail.com",
            password: " ",
        }

        const req1 = {
            body: body1
        } as express.Request;
        const send = jest.fn();
        const res = {
           status: jest.fn().mockReturnValue({
               send
           }),
           json: jest.fn()
        } as unknown as express.Response;

        await UserController.signup(req1, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(send).toHaveBeenCalledWith({"message": "Password is too weak", "type": "ERROR"});
    });

    it('successful login', async () => {
        bcryptMock.compare = jest.fn().mockReturnValue(Promise.resolve(true));
        userServiceMock.userService.findUserByQuery = jest.fn().mockReturnValue(Promise.resolve(
            {}
        ));

        const body = {
            name: "momo",
            email: "test@mailinator.com",
            password: "superPassword",
        }
        const req = {
            body
        } as express.Request;
        const res = {
           status: jest.fn().mockReturnValue({
               send: jest.fn()
           }),
           json: jest.fn()
        } as unknown as express.Response;
        await UserController.login(req, res);
        expect(res.json).toHaveBeenCalledWith({"email": "test@mailinator.com", "name": "momo", "password": "", "token": "token"});
    });

    it('unsuccessful login - user does not exist', async () => {
        userServiceMock.userService.findUserByQuery = jest.fn().mockReturnValue(Promise.resolve(null));
        const body = {
            name: "momo",
            email: "test@mailinator.com",
            password: "superPassword",
        }
        const req = {
            body
        } as express.Request;
        const send = jest.fn()
        const res = {
           status: jest.fn().mockReturnValue({
               send
           }),
           json: jest.fn()
        } as unknown as express.Response;
        await UserController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(send).toHaveBeenCalledWith({"message": "User not found", "type": "ERROR"});
    })

    it('unsuccessful login - password is incorrect', async () => {
        bcryptMock.compare = jest.fn().mockReturnValue(Promise.resolve(false));
        userServiceMock.userService.findUserByQuery = jest.fn().mockReturnValue(Promise.resolve(
            {}
        ));        
        const body = {
            name: "momo",
            email: "test@mailinator.com",
            password: "superPassword",
        }
        const req = {
            body
        } as express.Request;
        const send = jest.fn()
        const res = {
           status: jest.fn().mockReturnValue({
               send
           }),
           json: jest.fn()
        } as unknown as express.Response;
        await UserController.login(req, res);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(send).toHaveBeenCalledWith({"message": "Password or email is incorrect", "type": "ERROR"});
    })
});
