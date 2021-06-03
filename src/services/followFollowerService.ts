import {FollowerFollow, FollowerFollowModel} from '../models/FollowerFollow';
import {Post} from "../models/Post";

class FollowerFollowService {
    findFollow(id: string){
        return FollowerFollow.find({
            followerId: id
        })
    }

    findFollower(id: string, followerId: string){
        return FollowerFollow.findOne({$and: [{followId: id}, {followerId}]})
    }

    findAllFollow(followerId: string, page: number = 1, size: number = 10) {
        return FollowerFollow.paginate({
            followerId
        },{
            page,
            limit: size
        })
    }

    follow(followFollower: FollowerFollowModel){
        return FollowerFollow.create(followFollower);
    }
    
    unfollow(followerId: string, followId: string) {
        return FollowerFollow.deleteOne({$and: [{followId}, {followerId}]})
    }
}

const followerFollowService = new FollowerFollowService();

export {
    followerFollowService
}
