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
