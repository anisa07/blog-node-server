export const activeErrors = {
    "400": {
        description: "Payload is incorrect",
    },
    "404": {
        description: "User not found"
    },
    "403": {
        description: "User is not active or blocked"
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
}
