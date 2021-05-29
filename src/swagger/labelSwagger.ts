import {activeErrors, headerIdRequired, security} from "./commonSwagger";

export const labelResponse = {
    type: "object",
    properties: {
        id: {
            type: 'string'
        },
        name: {
            type: 'string'
        }
    }
}

const labelRequestBody = {
    content: {
        "application/json": {
            schema: {
                type: "object",
                properties: {
                    "name": {
                        type: 'string'
                    }
                },
                required: [
                    "name",
                ],
            }
        }
    },
    required: true
}

export const createLabel = {
    tags: ['Label'],
    summary: "Create label",
    operationId: "createLabel",
    parameters: [
        headerIdRequired,
    ],
    security,
    requestBody: labelRequestBody,
    responses: {
        "200": {
            description: "Label created",
            content: {
                "application/json": {
                    schema: labelResponse
                }
            }
        },
        ...activeErrors
    }
}

export const getLabels = {
    tags: ['Label'],
    summary: "Read labels",
    operationId: "getLabels",
    responses: {
        "200": {
            description: "Follow posts",
            "content": {
                "application/json": {
                    // schema: Posts
                    schema: {
                        type: 'array',
                        items: {
                            type: 'object',
                            properties: {
                                name: {
                                    type: 'string'
                                },
                                _id: {
                                    type: 'string'
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

export const updateLabel = {
    tags: ['Label'],
    summary: "Update label",
    operationId: "updateLabel",
    parameters: [
        headerIdRequired,
        {
            "name": "labelId",
            "in": "path",
            "description": "label id to update",
            "required": true,
            "schema": {
                "type": "string",
            }
        },
    ],
    security,
    requestBody: labelRequestBody,
    responses: {
        "200": {
            description: "Label updated",
            content: {
                "application/json": {
                    schema: labelResponse
                }
            }
        },
        ...activeErrors
    }
}

export const deleteLabel = {
    tags: ['Label'],
    summary: "Delete label",
    operationId: "deleteLabel",
    parameters: [
        headerIdRequired,
        {
            "name": "labelId",
            "in": "path",
            "description": "label id to delete",
            "required": true,
            "schema": {
                "type": "string",
            }
        },
    ],
    security,
    responses: {
        "200": {
            description: "Label deleted",
        },
        ...activeErrors
    }
}
