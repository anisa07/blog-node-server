import express from 'express';

class PostsController {
    updatePost() {}

    deletePost() {}

    createPost() {}

    readPost() {}

    async readPosts(req: express.Request, res: express.Response) {
        const {createdBefore, size, theme, authorId} = req.query;
        // Posts.find( { createdAt: { $lte: createdBefore } } ).limit( size ).sort( '-createdAt' )
    }
}

const postsController = new PostsController();

export default postsController;
