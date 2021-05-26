import {activeErrors, headerIdRequired, security} from "./commonSwagger";

const commentResponse = {
    type: "object",
    properties: {
        id: {
            type: 'string'
        },
        text: {
            type: 'string'
        },
        userId: {
            type: 'string'
        },
        postId: {
            type: 'string'
        },
        username: {
            type: 'string'
        },
        updatedAt: {
            type: 'number'
        }
    }
}

export const deleteComment = {
    tags: ['Comment'],
    summary: "Delete comment",
    operationId: "deleteComment",
    security,
    parameters: [
        headerIdRequired,
        {
            "name": "id",
            "in": "path",
            "description": "comment id to delete",
            "required": true,
            "schema": {
                "type": "string",
            }
        },
    ],
    responses: {
        "200": {
            description: "Comment deleted"
        }
    }
}

export const updateComment = {
    tags: ['Comment'],
    summary: "Update post comments",
    operationId: "updateComment",
    security,
    parameters: [
        headerIdRequired,
        {
            "name": "id",
            "in": "path",
            "description": "comment id to update",
            "required": true,
            "schema": {
                "type": "string",
            }
        },
    ],
    requestBody: {
        type: "object",
        properties: {
            text: {
                type: 'string'
            },
            postId: {
                type: 'string'
            }
        }
    },
    responses: {
        "200": {
            description: "Comment created",
            content: {
                "application/json": {
                    schema: commentResponse
                }
            }
        },
        "500": {
          description: "Server error"
        },
        ...activeErrors
    }
}

export const getComments = {
    tags: ['Comment'],
    summary: "Read post comments",
    operationId: "getComments",
    parameters: [
        {
            "name": "postId",
            "in": "path",
            "description": "post id to update",
            "required": true,
            "schema": {
                "type": "string",
            }
        },
        {
            "name": "page",
            "in": "query",
            "description": "comment list page, by default = 1",
            "required": false,
            "schema": {
                "type": "integer"
            }
        },
        {
            "name": "size",
            "in": "query",
            "description": "comment list size, by default = 10",
            "required": false,
            "schema": {
                "type": "integer"
            }
        },
        {
            "name": "updatedAt",
            "in": "query",
            "description": "comment update date",
            "required": false,
            "schema": {
                "type": "integer"
            }
        },
    ],
    responses: {
        "200": {
            description: "Post comments",
            "content": {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            showMoreComments: {
                                type: 'boolean'
                            },
                            comments: {
                                type: 'array',
                                items: commentResponse
                            }
                        }
                    }
                }
            }
        }
    }
}

export const getComment = {
    tags: ['Comment'],
    summary: "Read comment",
    operationId: "getComment",
    parameters: [
        {
            "name": "id",
            "in": "path",
            "description": "comment id to update",
            "required": true,
            "schema": {
                "type": "string",
            }
        },
    ],
    responses: {
        "200": {
            description: "Comment created",
            content: {
                "application/json": {
                    schema: {
                        type: "object",
                        properties: {
                            _id: {
                                type: 'string'
                            },
                            text: {
                                type: 'string'
                            },
                            user: {
                                type: 'string'
                            },
                            post: {
                                type: 'string'
                            },
                            updatedAt: {
                              type: 'integer'
                            }
                        }
                    }
                }
            }
        },
    }
}

export const createComment = {
    tags: ['Comment'],
    summary: "Create comment",
    operationId: "createComment",
    parameters: [
        headerIdRequired,
    ],
    security,
    requestBody: {
        type: "object",
        properties: {
            text: {
                type: 'string'
            },
            postId: {
                type: 'string'
            }
        }
    },
    responses: {
        "200": {
            description: "Comment created",
            content: {
                "application/json": {
                    schema: commentResponse
                }
            }
        },
        ...activeErrors
    }
}
