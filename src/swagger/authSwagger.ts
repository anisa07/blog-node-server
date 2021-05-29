import {activeErrors, headerIdOptional, headerIdRequired, security} from "./commonSwagger";

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

export const forgotPassword = {
    tags: ['Auth'],
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
    tags: ['Auth'],
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
    tags: ['Auth'],
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
    tags: ['Auth'],
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

export const signup = {
    tags: ['Auth'],
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
    tags: ['Auth'],
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
