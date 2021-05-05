import {User, UserModel} from '../models/User';

class UserService {
    findUserByQuery(query: {[key:string]: any}) {
        return User.findOne(query);
    }

    createUser(user: UserModel) {
        return User.create(user)
    }

    updateUser(user: UserModel) {
        return User.findByIdAndUpdate(user._id, user);
    }
}

const userService = new UserService();

export {
    userService
}
