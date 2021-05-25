import {
    isAuth,
    login,
    signup,
    logout,
    forgotPassword,
    changePassword,
    updateUserInfo,
    getUserInfo,
    deleteUserPhoto,
    deleteUser,
    manageUser,
    followUser,
    unfollowUser,
    showFollowPosts,
    checkIfIFollowUser
} from "./swagger/userSwagger";
import {Post, Posts} from "./swagger/objects";

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
        schemas: {
            Posts,
            Post
        },
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
            get: isAuth,
        },
        "/user-info/{id}": {
            get: getUserInfo,
        },
        "/follow/posts": {
            get: showFollowPosts
        },
        // "/follow/{id}": {
        //     get: checkIfIFollowUser
        // },
        "/login": {
            post: login,
        },
        "/signup": {
            post: signup
        },
        "/logout": {
            post: logout,
        },
        "/forgot-password": {
            post: forgotPassword
        },
        "/change-password": {
            post: changePassword,
        },
        "/user-info": {
            post: updateUserInfo,
        },
        "/manage-user": {
            post: manageUser
        },
        "/follow": {
            post: followUser
        },
        "/user-photo/{filename}": {
            delete: deleteUserPhoto,
        },
        "/user/{id}": {
            delete: deleteUser
        },
        "/follow/{id}": {
            get: checkIfIFollowUser,
            delete: unfollowUser
        },
    },
    // "components": {
    //     "schemas": {
    //         "Order": {
    //             "type": "object",
    //             "properties": {
    //                 "id": {
    //                     "type": "integer",
    //                     "format": "int64"
    //                 },
    //                 "petId": {
    //                     "type": "integer",
    //                     "format": "int64"
    //                 },
    //                 "quantity": {
    //                     "type": "integer",
    //                     "format": "int32"
    //                 },
    //                 "shipDate": {
    //                     "type": "string",
    //                     "format": "date-time"
    //                 },
    //                 "status": {
    //                     "type": "string",
    //                     "description": "Order Status",
    //                     "enum": [
    //                         "placed",
    //                         "approved",
    //                         "delivered"
    //                     ]
    //                 },
    //                 "complete": {
    //                     "type": "boolean",
    //                     "default": false
    //                 }
    //             },
    //             "xml": {
    //                 "name": "Order"
    //             }
    //         },
    //         "Category": {
    //             "type": "object",
    //             "properties": {
    //                 "id": {
    //                     "type": "integer",
    //                     "format": "int64"
    //                 },
    //                 "name": {
    //                     "type": "string"
    //                 }
    //             },
    //             "xml": {
    //                 "name": "Category"
    //             }
    //         },
    //         "User": {
    //             "type": "object",
    //             "properties": {
    //                 "id": {
    //                     "type": "integer",
    //                     "format": "int64"
    //                 },
    //                 "username": {
    //                     "type": "string"
    //                 },
    //                 "firstName": {
    //                     "type": "string"
    //                 },
    //                 "lastName": {
    //                     "type": "string"
    //                 },
    //                 "email": {
    //                     "type": "string"
    //                 },
    //                 "password": {
    //                     "type": "string"
    //                 },
    //                 "phone": {
    //                     "type": "string"
    //                 },
    //                 "userStatus": {
    //                     "type": "integer",
    //                     "description": "User Status",
    //                     "format": "int32"
    //                 }
    //             },
    //             "xml": {
    //                 "name": "User"
    //             }
    //         },
    //         "Tag": {
    //             "type": "object",
    //             "properties": {
    //                 "id": {
    //                     "type": "integer",
    //                     "format": "int64"
    //                 },
    //                 "name": {
    //                     "type": "string"
    //                 }
    //             },
    //             "xml": {
    //                 "name": "Tag"
    //             }
    //         },
    //         "Pet": {
    //             "required": [
    //                 "name",
    //                 "photoUrls"
    //             ],
    //             "type": "object",
    //             "properties": {
    //                 "id": {
    //                     "type": "integer",
    //                     "format": "int64"
    //                 },
    //                 "category": {
    //                     "$ref": "#/components/schemas/Category"
    //                 },
    //                 "name": {
    //                     "type": "string",
    //                     "example": "doggie"
    //                 },
    //                 "photoUrls": {
    //                     "type": "array",
    //                     "xml": {
    //                         "name": "photoUrl",
    //                         "wrapped": true
    //                     },
    //                     "items": {
    //                         "type": "string"
    //                     }
    //                 },
    //                 "tags": {
    //                     "type": "array",
    //                     "xml": {
    //                         "name": "tag",
    //                         "wrapped": true
    //                     },
    //                     "items": {
    //                         "$ref": "#/components/schemas/Tag"
    //                     }
    //                 },
    //                 "status": {
    //                     "type": "string",
    //                     "description": "pet status in the store",
    //                     "enum": [
    //                         "available",
    //                         "pending",
    //                         "sold"
    //                     ]
    //                 }
    //             },
    //             "xml": {
    //                 "name": "Pet"
    //             }
    //         },
    //         "ApiResponse": {
    //             "type": "object",
    //             "properties": {
    //                 "code": {
    //                     "type": "integer",
    //                     "format": "int32"
    //                 },
    //                 "type": {
    //                     "type": "string"
    //                 },
    //                 "message": {
    //                     "type": "string"
    //                 }
    //             }
    //         }
    //     },
    // }
}
