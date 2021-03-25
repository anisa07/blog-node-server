import {LabelToPost, LabelToPostModel} from '../models/LabelToPost';

class LabelToPostService {
    findPostLabels(postId: string){
        return LabelToPost.find({post: postId})
    }
    
    addLabelToPost(labelToPost: LabelToPostModel) {
        return LabelToPost.create(labelToPost)
    }

    deleteLabelFromPost(labelId: string, postId: string){
        return LabelToPost.deleteOne({post: postId, label: labelId});
    }
}

const labelToPostService = new LabelToPostService();
export {
    labelToPostService
}
