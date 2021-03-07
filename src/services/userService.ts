import {User, UserModel} from '../models/User';

class UserService {
    findUserByQuery(query: {[key:string]: string}) {
        return User.findOne(query);
    }

    createUser(user: UserModel) {
        return User.create(user)
    }

}

const userService = new UserService();

export {
    userService
}