import {activeErrors} from "./commonSwagger";
import {Posts, Users} from "./objects";

export const loginPayload = {
    type: "object",
    required: [
        "email",
        "password"
    ],
    properties: {
        email: {
            type: "string"
        },
        password: {
            type: "string"
        },
    }
}

export const signupPayload = {
    type: "object",
    required: [
        "email",
        "password",
        "name"
    ],
    properties: {
        email: {
            type: "string"
        },
        password: {
            type: "string"
        },
        name: {
            type: "string"
        },
    }
}

export const loginResponse = {
    "type": "object",
    properties: {
        id: {
            type: 'string'
        },
        password: {
            type: 'string'
        },
        status: {
            type: 'string'
        },
        token: {
            type: 'string'
        }
    }
}

export const security = [
    {
        bearerAuth: []
    }
]

export const headerIdRequired = {
    name: "id",
    in: "header",
    description: "set logged in user id here",
    required: true,
    type: "string"
}

export const headerIdOptional = {
    name: "id",
    in: "header",
    description: "if user is logged in, set user id here",
    required: false,
    type: "string",
    parameters: [
        headerIdRequired,
    ]
}

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
                            paramType : "form",
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

export const forgotPassword = {
    tags: ['User'],
    summary: 'Forgot password',
    operationId: 'forgotPassword',
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        "email": {
                            type: 'string'
                        }
                    },
                    required: [
                        "email",
                    ],
                }
            }
        },
        required: true
    },
    responses: {
        "200": {
            description: "Reset password link is sent, if email is correct",
        },
        "404": {
            description: "User not found",
        },
        "500": {
            description: "Server error"
        }
    }
}

export const logout = {
    tags: ['User'],
    summary: 'Logout user',
    operationId: 'logout',
    security,
    parameters: [
        headerIdRequired,
    ],
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {}
                }
            }
        },
        required: false
    },
    responses: {
        "200": {
            description: "Auth status",
        },
        "404": {
            description: "User not found",
        },
        "500": {
            description: "Server error"
        }
    }
}

export const changePassword = {
    tags: ['User'],
    summary: "Change password",
    operationId: "changePassword",
    parameters: [
        headerIdOptional,
    ],
    security,
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    type: "object",
                    properties: {
                        "password": {
                            type: 'string'
                        },
                        "id": {
                            type: 'string'
                        },
                        "token": {
                            type: 'string'
                        }
                    },
                    required: [
                        "password",
                    ],
                }
            }
        },
        required: true
    },
    responses: {
        "200": {
            description: "Password updated",
        },
        "400": {
            description: "Password is weak"
        },
        "403": {
            description: "Password or email is incorrect"
        },
        "404": {
            description: "User not found",
        },
        "500": {
            description: "Server error"
        }
    }
}

export const isAuth = {
    tags: ['User'],
    summary: "Returns if user logged in or not",
    operationId: 'isAuth',
    security,
    parameters: [
        headerIdOptional,
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

export const signup = {
    tags: ['User'],
    summary: "Signup user",
    operationId: 'signup',
    requestBody: {
        content: {
            "application/json": {
                schema: signupPayload
            }
        },
        required: true
    },
    responses: {
        "200": {
            description: "signup response",
            content: {
                "application/json": {
                    schema: loginResponse
                }
            }
        },
        "500": {
            description: "Server error"
        },
    }
}

export const login = {
    tags: ['User'],
    summary: "Login user",
    operationId: 'login',
    requestBody: {
        content: {
            "application/json": {
                schema: loginPayload
            }
        },
        required: true
    },
    responses: {
        "200": {
            description: "login response",
            content: {
                "application/json": {
                    schema: loginResponse
                }
            }
        },
        "401": {
            description: "Password or email is incorrect"
        },
        "500": {
            description: "Server error"
        },
        ...activeErrors
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
                        _id: {
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
                            paramType : "form",
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
