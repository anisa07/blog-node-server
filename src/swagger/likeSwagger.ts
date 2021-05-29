import {activeErrors, headerIdRequired, security} from "./commonSwagger";

const likeRequestBody = {
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    "value": {
                        type: 'integer'
                    },
                    "postId": {
                        type: 'string'
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

export const sendLike = {
    tags: ['Like'],
    summary: "Send like",
    operationId: "sendLike",
    parameters: [
        headerIdRequired,
    ],
    security,
    requestBody: likeRequestBody,
    responses: {
        "200": {
            description: "Like is send",
        },
        "400": {
            description: "Impossible to like or dislike twice",
        },
        "403": {
            description: "User is not active or blocked"
        }
    }
};

export const updateLike = {
    tags: ['Like'],
    summary: "Update like",
    operationId: "updateLike",
    parameters: [
        headerIdRequired,
    ],
    security,
    requestBody: likeRequestBody,
    responses: {
        "200": {
            description: "Like is updated",
        },
        "403": {
            description: "User is not active or blocked"
        },
        "404": {
            description: "Like not found",
        },
        "500": {
            description: "server error",
        },
    }
}

export const getUserLikeByPostId = {
    tags: ['Like'],
    summary: "Get user likes for post",
    operationId: "getUserLikeByPostId",
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
    response: {
        "200": {
            description: "Like value",
            content: {
                "application/json": {
                    "schema": {
                        type: "integer",
                    }
                }
            }
        },
        "500": {
            description: "server error",
        },
    }
}

export const getAllLikesForPost = {
    tags: ['Like'],
    summary: "Get all likes for post",
    operationId: "getAllLikesForPost",
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
    response: {
        "200": {
            description: "Like value",
            content: {
                "application/json": {
                    "schema": {
                        type: "integer",
                    }
                }
            }
        },
        "500": {
            description: "server error",
        },
        ...activeErrors
    }
}
