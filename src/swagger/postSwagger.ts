import {activeErrors, headerIdRequired, security} from "./commonSwagger";
import {labelResponse} from "./labelSwagger";
import {Posts, Post} from "./objects";

const postRequestBody = {
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    "title": {
                        type: 'string'
                    },
                    "text": {
                        type: 'string'
                    },
                    "labels": {
                        type: 'array',
                        items: labelResponse
                    }
                },
                required: [
                    "value",
                    "postId"
                ],
            }
        }
    },
    required: true
}

export const createPost = {
    tags: ['Post'],
    summary: "Create post",
    operationId: "createPost",
    parameters: [
        headerIdRequired,
    ],
    security,
    requestBody: postRequestBody,
    responses: {
        "200": {
            description: "Post is created",
            content: {
                "application/json": {
                    "schema": {
                        type: "object",
                        properties: {
                            id: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        },
        ...activeErrors,
        "500": {
            description: "server error",
        },
    }
};

export const deletePostImage = {
    tags: ['Post'],
    summary: "Update post",
    operationId: "updatePost",
    parameters: [
        headerIdRequired,
        {
            "name": "postId",
            "in": "path",
            "description": "Post id",
            "required": true,
            "schema": {
                "type": "string",
            }
        },
    ],
    security,
    responses: {
        "200": {
            description: "Post image deleted",
        },
        "404": {
            description: "Post not found",
        },
        "500": {
            description: "server error",
        },
    }
}

export const updatePost = {
    tags: ['Post'],
    summary: "Update post",
    operationId: "updatePost",
    parameters: [
        headerIdRequired,
        {
            "name": "postId",
            "in": "path",
            "description": "Post id",
            "required": true,
            "schema": {
                "type": "string",
            }
        },
    ],
    security,
    requestBody: postRequestBody,
    responses: {
        "200": {
            description: "Post is updated",
            content: {
                "application/json": {
                    "schema": {
                        type: "object",
                        properties: {
                            id: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        },
        ...activeErrors,
        "500": {
            description: "server error",
        },
    }
};

export const getPosts = {
    tags: ['Post'],
    summary: "Get posts",
    operationId: "getPosts",
    parameters: [
        {
            "name": "size",
            "in": "query",
            "description": "Post per page, by default = 10",
            "required": false,
            "schema": {
                "type": "number",
            }
        },
        {
            "name": "page",
            "in": "query",
            "description": "Post page, by default = 1",
            "required": false,
            "schema": {
                "type": "number",
            }
        },
        {
            "name": "authorId",
            "in": "query",
            "description": "Author id",
            "required": false,
            "schema": {
                "type": "string",
            }
        },
        {
            "name": "searchText",
            "in": "query",
            "description": "Search text",
            "required": false,
            "schema": {
                "type": "string",
            }
        },
        {
            "name": "sortBy",
            "in": "query",
            "description": "Sort by author, text, or title",
            "required": false,
            "schema": {
                "type": "string",
            }
        },
        {
            "name": "searchBy",
            "in": "query",
            "description": "Search by author, text, or title",
            "required": false,
            "schema": {
                "type": "string",
            }
        },
        {
            "name": "sortDir",
            "in": "query",
            "description": "Sort direction 'asc' or 'desc'",
            "required": false,
            "schema": {
                "type": "string",
            }
        },
        {
            "name": "labelIds",
            "in": "query",
            "description": "Array of post labels",
            "required": false,
            "schema": {
                type: 'array',
                items: labelResponse
            }
        },

    ],
    responses: {
        "200": {
            description: "List of posts",
            "content": {
                "application/json": {
                    schema: Posts
                }
            }
        },
        "500": {
            description: "server error",
        },
    }
}

export const deletePost = {
    tags: ['Post'],
    summary: 'Delete post',
    operationId: 'deletePost',
    parameters: [
        headerIdRequired,
        {
            "name": "postId",
            "in": "path",
            "description": "Post id",
            "required": true,
            "schema": {
                "type": "string",
            }
        },
    ],
    responses: {
        "200": {
            description: "Post deleted",
        },
        "404": {
            description: "Post not found",
        },
        "500": {
            description: "server error",
        },
    }
}

export const getPost = {
    tags: ['Post'],
    summary: 'Get post',
    operationId: "getPost",
    parameters: [
        {
            "name": "postId",
            "in": "path",
            "description": "Post id",
            "required": true,
            "schema": {
                "type": "string",
            }
        },
    ],
    responses: {
        "200": {
            description: "Post item",
            "content": {
                "application/json": {
                    schema: Post
                }
            }
        },
        "404": {
            description: "Post not found",
        },
        "500": {
            description: "server error",
        },
    }
}

// export const updateLike = {
//     tags: ['Like'],
//     summary: "Update like",
//     operationId: "updateLike",
//     parameters: [
//         headerIdRequired,
//     ],
//     security,
//     requestBody: likeRequestBody,
//     responses: {
//         "200": {
//             description: "Like is updated",
//         },
//         "403": {
//             description: "User is not active or blocked"
//         },
//         "404": {
//             description: "Like not found",
//         },
//         "500": {
//             description: "server error",
//         },
//     }
// }
//
// export const getUserLikeByPostId = {
//     tags: ['Like'],
//     summary: "Get user likes for post",
//     operationId: "getUserLikeByPostId",
//     parameters: [
//         headerIdRequired,
//         {
//             "name": "postId",
//             "in": "path",
//             "description": "Post id",
//             "required": true,
//             "schema": {
//                 "type": "string",
//             }
//         },
//     ],
//     security,
//     response: {
//         "200": {
//             description: "Like value",
//             content: {
//                 "application/json": {
//                     "schema": {
//                         type: "integer",
//                     }
//                 }
//             }
//         },
//         "500": {
//             description: "server error",
//         },
//     }
// }
//
// export const getAllLikesForPost = {
//     tags: ['Like'],
//     summary: "Get all likes for post",
//     operationId: "getAllLikesForPost",
//     parameters: [
//         {
//             "name": "postId",
//             "in": "path",
//             "description": "Post id",
//             "required": true,
//             "schema": {
//                 "type": "string",
//             }
//         },
//     ],
//     response: {
//         "200": {
//             description: "Like value",
//             content: {
//                 "application/json": {
//                     "schema": {
//                         type: "integer",
//                     }
//                 }
//             }
//         },
//         "500": {
//             description: "server error",
//         },
//         ...activeErrors
//     }
// }
