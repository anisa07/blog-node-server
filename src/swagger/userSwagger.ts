import {activeErrors} from "./commonSwagger";

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

export const updateUserInfo = {
    tags: ['User'],
    summary: 'Update user info',
    operationId: 'updateUserInfo',
    security: [
        {
            bearerAuth: []
        }
    ],
    "consumes": [
        "multipart/form-data", "application/json"
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
    security: [
        {
            bearerAuth: []
        }
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
    security: [
        {
            bearerAuth: []
        }
    ],
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
    description: "Returns if user logged in or not",
    operationId: 'isAuth',
    security: [
        {
            bearerAuth: []
        }
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
        "400": {
            description: "User data is incorrect: password could be weak, or email format is incorrect"
        },
        "409": {
            description: "User already exists"
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
