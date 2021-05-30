import {LabelToPost, LabelToPostModel} from '../models/LabelToPost';

class LabelToPostService {
    findPostLabels(postId: string){
        return LabelToPost.find({postId})
    }
    
    addLabelToPost(labelToPost: LabelToPostModel) {
        return LabelToPost.create(labelToPost)
    }

    deleteLabelFromPost(labelId: string, postId: string){
        return LabelToPost.deleteOne({postId, labelId});
    }

    findByLabelId(labelId: string) {
        return LabelToPost.find({labelId})
    }
}

const labelToPostService = new LabelToPostService();
export {
    labelToPostService
}
