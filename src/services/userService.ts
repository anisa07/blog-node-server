import {User, UserModel} from '../models/User';

interface FindUsersBy {
    query?: { [key: string]: any },
    text?: string,
    sort?: { [key: string]: any } | string,
    page?: number,
    size: number,
}

class UserService {
    findUserByQuery(query: {[key:string]: any}) {
        return User.findOne(query);
    }

    findUsersByQuery(findBy: FindUsersBy) {
        let regexObj;
        const regex = new RegExp(`.*${findBy.text}.*`, 'i');

        if (findBy.text) {
            regexObj = {$or: [{name: {$regex: regex}}, {bio: {$regex: regex}}, {email: {$regex: regex}}]}
        }

        return User.paginate({
            ...findBy.query, ...regexObj
        }, {
            sort: findBy.sort,
            page: findBy.page,
            limit: findBy.size
        })
    }

    createUser(user: UserModel) {
        return User.create(user)
    }
}

const userService = new UserService();

export {
    userService
}
