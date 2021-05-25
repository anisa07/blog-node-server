export const Post = {
    "type": "object",
    "properties": {
        id: {
            type: "string"
        },
        authorId: {
            type: "string"
        },
        author: {
            type: "string"
        },
        title: {
            type: "string"
        },
        text: {
            type: "string"
        },
        labels: {
            type: "array",
            "items": {
                "type": "string"
            }
        },
        commentsCount: {
            type: "integer"
        },
        likesValue: {
            type: "integer"
        },
        filename: {
            type: "string"
        },
        updatedAt: {
            type: "integer"
        },
    },
    "xml": {
        "name": "Post"
    }
}

export const Posts = {
    "type": "object",
    "properties": {
        posts: {
            type: "array",
            items: {
                "type": Post
            }
        },
        hasNextPage: {
            type: "boolean",
        },
        hasPrevPage: {
            type: "boolean",
        },
        totalDocs: {
            type: "integer"
        },
        totalPages: {
            type: "integer"
        },
    },
    "xml": {
        "name": "Posts"
    }
}
