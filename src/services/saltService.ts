import {Salt} from '../models/Salt';

class Saltservice {
    createSaltForUser(userId: string, salt: string) {
        return Salt.create({
            value: salt,
            userId
        })
    }

    getSalt(userId: string) {

    }

    deleteSlat(userId: string) {

    }
}

const saltService = new Saltservice();
export {
    saltService
}