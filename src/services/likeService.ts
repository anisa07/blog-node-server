import {Like, LikeModel} from '../models/Like';

class LikeService {
    findPostLikes(query: {[key:string]: string}){
        return Like.find(query)
    }

    findPostLike(query: {[key:string]: string}){
        return Like.findOne(query)
    }
    
    saveLike(like: LikeModel) {
        return Like.create(like)
    }

    // TODO check
    changeLike(id: string, like: LikeModel) {
        return Like.updateOne({id}, like)
    }
}

const likeService = new LikeService();

export {
    likeService
}
