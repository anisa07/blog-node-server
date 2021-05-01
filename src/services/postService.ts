import {Post, PostModel} from '../models/Post';

class PostService {
    findPostsByText(query: {[key:string]: any}, text: string, sort: {[key:string]: any} | string, page: number, size: number) {
        const regex = new RegExp(`.*${text}.*`, 'i');
        return Post.paginate({
            ...query, ...{$or: [{text: {$regex: regex}}, {title: {$regex: regex}}]}
        }, {
            sort,
            page,
            limit: size
        })
    }

    findPostsBy(query: {[key:string]: any}, sort: {[key:string]: any} | string, page: number, size: number) {
        return Post.paginate(query,{
            sort,
            page,
            limit: size
        })
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

const postService = new PostService();
export {
    postService
}
