import {activeErrors, headerIdOptional, headerIdRequired, security} from "./commonSwagger";
import {Posts, Users} from "./objects";

export const updateUserInfo = {
    tags: ['User'],
    summary: 'Update user info',
    operationId: 'updateUserInfo',
    security,
    "consumes": [
        "multipart/form-data", "application/json"
    ],
    parameters: [
        headerIdRequired,
    ],
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    properties: {
                        id: {
                            type: "string",
                            description: "User id to update"
                        },
                        name: {
                            type: "string",
                            description: "Updated user name"
                        },
                        bio: {
                            type: "string",
                            description: "Updated user bio"
                        },
                        filename: {
                            type: "string",
                            description: "User photo to upload",
                            format: "binary",
                            paramType: "form",
                        }
                    },
                    required: [
                        "name",
                        "id"
                    ],
                }
            }
        },
        required: true
    },
    responses: {
        "200": {
            description: "User info is updated"
        }
    }
}

export const getUsersBy = {
    tags: ['User'],
    summary: "Returns users",
    operationId: 'getUsersBy',
    security,
    parameters: [
        headerIdRequired,
        {
            "name": "page",
            "in": "query",
            "description": "post list page, by default = 1",
            "required": false,
            "schema": {
                "type": "integer"
            }
        },
        {
            "name": "size",
            "in": "query",
            "description": "post list size, by default = 10",
            "required": false,
            "schema": {
                "type": "integer"
            }
        },
        {
            "name": "searchText",
            "in": "query",
            "description": "search text by default \"\"",
            "required": false,
            "schema": {
                "type": "string"
            }
        },

    ],
    responses: {
        "200": {
            description: "Users",
            "content": {
                "application/json": {
                    schema: Users
                }
            }
        }
    }
}

export const checkIfIFollowUser = {
    tags: ['User'],
    summary: "Returns if a user follows another user",
    operationId: 'checkIfIFollowUser',
    security,
    parameters: [
        headerIdRequired,
        {
            "name": "id",
            "in": "path",
            "description": "follow user id",
            "required": true,
            "schema": {
                "type": "string",
            }
        },
    ],
    responses: {
        "200": {
            description: "Auth status",
            "content": {
                "application/json": {
                    schema: {
                        type: "boolean",
                    }
                }
            }
        }
    }
}

export const deleteUserPhoto = {
    tags: ['User'],
    summary: "Delete user photo",
    operationId: 'deleteUserPhoto',
    security,
    parameters: [
        headerIdRequired,
        {
            "name": "filename",
            "in": "path",
            "description": "user photo encoded name",
            "required": true,
            "schema": {
                "type": "string",
            }
        },
    ],
    responses: {
        "200": {
            description: "delete user photo response",
        },
        "500": {
            description: "Server error"
        },
    }
}

export const showFollowPosts = {
    tags: ['User'],
    summary: "Get posts from follow users",
    operationId: 'showFollowPosts',
    security,
    parameters: [
        headerIdRequired,
        {
            "name": "page",
            "in": "query",
            "description": "post list page, by default = 1",
            "required": false,
            "schema": {
                "type": "number"
            }
        },
        {
            "name": "size",
            "in": "query",
            "description": "post list size, by default = 10",
            "required": false,
            "schema": {
                "type": "number"
            }
        }
    ],
    responses: {
        "200": {
            description: "Follow posts",
            "content": {
                "application/json": {
                    schema: Posts
                }
            }
        }
    }
}

export const getUserInfo = {
    tags: ['User'],
    summary: "Get user info",
    operationId: 'getUserInfo',
    security,
    parameters: [
        headerIdOptional,
        {
            "name": "id",
            "in": "path",
            "description": "user id to get info",
            "required": true,
            "schema": {
                "type": "string",
            }
        },
    ],
    responses: {
        "200": {
            description: "User info",
            "content": {
                "application/json": {
                    schema: {
                        "type": "object",
                        properties: {
                            id: {
                                type: 'string'
                            },
                            bio: {
                                type: 'string'
                            },
                            filename: {
                                type: 'string'
                            },
                            email: {
                                type: 'string'
                            },
                            name: {
                                type: 'string'
                            },
                            type: {
                                type: 'string'
                            },
                            state: {
                                type: 'string'
                            }
                        }
                    }
                }
            }
        }
    }
}

export const deleteUser = {
    tags: ['User'],
    summary: "Delete user",
    security,
    operationId: 'deleteUser',
    parameters: [
        headerIdRequired,
        {
            "name": "id",
            "in": "path",
            "description": "user id to delete",
            "required": true,
            "schema": {
                "type": "string",
            }
        },
    ],
    responses: {
        "200": {
            description: "User deleted",
        },
        "500": {
            description: "Server error"
        },
    }
}

export const manageUser = {
    tags: ['User'],
    summary: "Manage user profile",
    security,
    operationId: 'manageUser',
    parameters: [
        headerIdRequired,
    ],
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    properties: {
                        id: {
                            type: "string",
                            description: "User id to update"
                        },
                        state: {
                            type: "string",
                            description: "User state"
                        },
                        type: {
                            type: "string",
                            description: "User type"
                        },
                        bio: {
                            type: "string",
                            description: "Updated user bio"
                        },
                        removePhoto: {
                            type: "boolean",
                            description: "Delete current user photo"
                        },
                        filename: {
                            type: "string",
                            description: "User photo to upload",
                            format: "binary",
                            paramType: "form",
                        }
                    },
                    required: [
                        "_id",
                        "name"
                    ],
                }
            }
        },
        required: true
    },
    responses: {
        "200": {
            description: "user is updated",
        },
        "500": {
            description: "Server error"
        },
        ...activeErrors
    }
}

export const followUser = {
    tags: ['User'],
    summary: "Follow user",
    security,
    operationId: 'followUser',
    parameters: [
        headerIdRequired,
    ],
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    properties: {
                        follow: {
                            type: "string",
                            description: "User id to start follow "
                        }
                    },
                    required: [
                        "follow"
                    ],
                }
            }
        },
        required: true
    },
}

export const unfollowUser = {
    tags: ['User'],
    summary: "Stop follow user",
    operationId: 'unfollowUser',
    security,
    parameters: [
        headerIdRequired,
        {
            "name": "id",
            "in": "path",
            "description": "user id to stop follow",
            "required": true,
            "schema": {
                "type": "string",
            }
        },
    ],
    responses: {
        "200": {
            description: "Stop follow user",
        },
        "500": {
            description: "Server error"
        },
    }
}
