import {Like, LikeModel} from '../models/Like';

class LikeService {
    findPostLikes(query: {[key:string]: string}){
        return Like.find(query)
    }
    
    saveLike(like: LikeModel) {
        return Like.create(like)
    }

    changeLike(id: string, like: LikeModel) {
        return Like.updateOne({_id: id}, like)
    }
}

const likeService = new LikeService();
export {
    likeService
}
