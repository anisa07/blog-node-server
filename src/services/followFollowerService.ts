import {FollowerFollow, FollowerFollowModel} from '../models/FollowerFollow';

class FollowerFollowService {
    findFollow(id: string){
        return FollowerFollow.find({
            follower: id
        })
    }

    findFollower(id: string, followerId: string){
        return FollowerFollow.findOne({$and: [{follow: id}, {follower: followerId}]})
    }

    follow(followFollower: FollowerFollowModel){
        return FollowerFollow.create(followFollower);
    }
    
    unfollow(followerId: string, followId: string) {
        return FollowerFollow.deleteOne({$and: [{follow: followId}, {follower: followerId}]})
    }
}

const followerFollowService = new FollowerFollowService();
export {
    followerFollowService
}
