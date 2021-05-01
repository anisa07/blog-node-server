import {Comment, CommentModel} from '../models/Comment';
import {Post} from "../models/Post";

class CommentService {
    findCommentBy(query: {[key:string]: string}) {
        return Comment.findOne(query);
    }

    findComments(query: {[key:string]: string}, page: number, size: number) {
        return Comment.paginate(query, {
            sort: '-updatedAt',
            page,
            limit: size
        });
    }

    createComment(c: CommentModel) {
        return Comment.create(c);
    }

    deleteComment(query: {[key:string]: string}){
        return Comment.findOneAndDelete(query);
    }

    updateComment(id: string, userId: string, postId: string, c: CommentModel) {
        return Comment.updateOne({_id: id, user: userId, post: postId}, c)
    }

    countComments(query: {[key:string]: string}) {
        return Comment.countDocuments(query)
    }
}

const commentService = new CommentService();

export {
    commentService
}
