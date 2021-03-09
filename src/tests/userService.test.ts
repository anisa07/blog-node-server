import mongoose from 'mongoose';

import * as dbHandler from './db-handler';
import {userService} from '../services/userService'
import {UserModel} from '../models/User'

/**
 * Connect to a new in-memory database before running any tests.
 */
beforeAll(async () => await dbHandler.connect());

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());

/**
 * Remove and close the db and server.
 */
afterAll(async () => await dbHandler.closeDatabase());

describe('user service', () => {
    it('user can be created correctly', async () => {
        const uBefore = await userService.findUserByQuery({email: "test@mailinator.com"});
        expect(uBefore).toBeFalsy();
        await userService.createUser(user as UserModel);
        const uAfter = await userService.findUserByQuery({email: "test@mailinator.com"});
        expect(uAfter).toBeTruthy();
        expect(uAfter?.email).toBe(user.email);
        expect(uAfter?.name).toBe(user.name);
        expect(uAfter?.password).toBe(user.password);
    });
});

const user =  {
    name: "momo",
    email: "test@mailinator.com",
    password: "supersecretpassword",
}
