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

export const User = {
    "type": "object",
    "properties": {
        id: {
            type: "string"
        },
        name: {
            type: "string"
        },
        password: {
            type: "string"
        },
        type: {
            type: "string"
        },
        state: {
            type: "string"
        },
        bio: {
            type: "string"
        },
        filename: {
            type: "string"
        },
        lastReviewDate: {
            type: "integer"
        },
    },
    "xml": {
        "name": "User"
    }
}

export const Posts = {
    "type": "object",
    "properties": {
        posts: {
            type: "array",
            items: Post
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

export const Users = {
    "type": "object",
    "properties": {
        users: {
            type: "array",
            items: User
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
        "name": "Users"
    }
}
