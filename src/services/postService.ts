import {Post, PostModel} from '../models/Post';

class PostService {
    findPostsBy(query: {[key:string]: string}) {
        return Post.find(query);
    }

    findPostBy(query: {[key:string]: string}) {
        return Post.findOne(query);
    }

    createPost(post: PostModel) {
        return Post.create(post);
    }

    deletePost(id: string){
        return Post.findOneAndDelete({_id: id});
    }

    updatePost(id: string, post: PostModel) {
        return Post.updateOne({_id: id}, post)
    }
}

const postsService = new PostService();
export {
    postsService
}