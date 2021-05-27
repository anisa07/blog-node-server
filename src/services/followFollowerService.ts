import {FollowerFollow, FollowerFollowModel} from '../models/FollowerFollow';

class FollowerFollowService {
    findFollow(id: string){
        return FollowerFollow.find({
            followerId: id
        })
    }

    findFollower(id: string, followerId: string){
        return FollowerFollow.findOne({$and: [{followId: id}, {followerId}]})
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
