import {Comment, CommentModel} from '../models/Comment';

class CommentService {
    findCommentBy(query: {[key:string]: string}) {
        return Comment.findOne(query);
    }

    createComment(c: CommentModel) {
        return Comment.create(c);
    }

    deleteComment(query: {[key:string]: string}){
        return Comment.findOneAndDelete(query);
    }

    updateComment(id: string, userId: string, c: CommentModel) {
        return Comment.updateOne({_id: id, userId}, c)
    }
}

const commentService = new CommentService();

export {
    commentService
}