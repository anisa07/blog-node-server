import {
    isAuth,
    login,
    signup,
    logout,
    forgotPassword,
    changePassword,
    updateUserInfo,
    getUserInfo,
    deleteUserPhoto, deleteUser
} from "./swagger/userSwagger";

export const swaggerDocument = {
    openapi: '3.0.1',
    info: {
        version: '1.0.0',
        title: 'APIs Document',
        description: `Download [swagger.json](${process.env.ORIGIN}:${process.env.PORT}/${process.env.API_VERSION}/api-docs/download/swagger/json)`,
        termsOfService: '',
        contact: {
            name: '',
            email: '',
            url: ''
        },
        license: {
            "name": "Apache 2.0",
            "url": "http://www.apache.org/licenses/LICENSE-2.0.html"
        }
    },
    servers: [
        {
            url: `${process.env.ORIGIN}:${process.env.PORT}/${process.env.API_VERSION}`,
            description: 'Local server'
        }
    ],
    components: {
        schemas: {},
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT'
            },
        }
    },
    tags: [
        {
            name: 'User'
        }
    ],
    scheme: [
        "https",
        "http"
    ],
    paths: {
        "/auth": {
            "get": isAuth,
        },
        "/login": {
            "post": login,
        },
        "/signup": {
            "post": signup
        },
        "/logout": {
            "post": logout,
        },
        "/forgot-password": {
            "post": forgotPassword
        },
        "/change-password": {
            "post": changePassword,
        },
        "/user-info": {
            "post": updateUserInfo,
        },
        "/user-info/{id}": {
            "get": getUserInfo,
        },
        "/user-photo/{filename}": {
            delete: deleteUserPhoto,
        },
        "/user/{id}": {
            delete: deleteUser
        }
    },
}
