import {User} from '../models/User';

class UserService {
    findUserByQuery(query: {[key:string]: string}) {
        return User.findOne(query);
    }

    createUser(user: typeof User) {
        return User.create(user)
    }

}

const userService = new UserService();

export {
    userService
}