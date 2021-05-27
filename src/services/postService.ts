import {Post, PostModel} from '../models/Post';

interface FindPostBy {
    query?: { [key: string]: any },
    text?: string,
    sort?: { [key: string]: any } | string,
    page?: number,
    size: number,
    searchBy?: string
}

class PostService {
    findPostsByText(findBy: FindPostBy) {
        let regexObj;
        const regex = new RegExp(`.*${findBy.text}.*`, 'i');

        if (findBy.searchBy) {
            regexObj = {title: {$regex: regex}}
        } else {
            regexObj = {$or: [{text: {$regex: regex}}, {title: {$regex: regex}}]}
        }

        return Post.paginate({
            ...findBy.query, ...regexObj
        }, {
            sort: findBy.sort,
            page: findBy.page,
            limit: findBy.size
        })
    }

    findPostsBy(findBy: FindPostBy) {
        return Post.paginate(findBy.query, {
            sort: findBy.sort,
            page: findBy.page,
            limit: findBy.size
        })
    }

    findPostBy(query: { [key: string]: string }) {
        return Post.findOne(query);
    }

    createPost(post: PostModel) {
        return Post.create(post);
    }

    deletePost(id: string) {
        return Post.findOneAndDelete({id});
    }

    // TODO check
    updatePost(id: string, post: PostModel) {
        return Post.updateOne({id}, post)
    }
}

const postService = new PostService();

export {
    postService
}
