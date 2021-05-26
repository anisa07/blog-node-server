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
    checkIfIFollowUser,
    getUsersBy
} from "./swagger/userSwagger";
import {
    Post,
    Posts,
    User,
    Users
} from "./swagger/objects";
import {
    createLabel,
    getLabels,
    deleteLabel,
    updateLabel
} from "./swagger/labelSwagger";
import {
    createComment,
    getComment,
    getComments,
    deleteComment,
    updateComment
} from "./swagger/commentSwagger";

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
            Post,
            User,
            Users,
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
        "/users": {
            get: getUsersBy
        },
        "/label": {
            post: createLabel,
            get: getLabels
        },
        "/label/{id}": {
            delete: deleteLabel
        },
        "/comment": {
            post: createComment
        },
        "/comment/{id}": {
            get: getComment,
            put: updateComment,
            delete: deleteComment
        },
        "/comment/post/{postId}": {
            get: getComments
        },
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
            delete: deleteUser,
            put: updateLabel
        },
        "/follow/{id}": {
            get: checkIfIFollowUser,
            delete: unfollowUser
        },
    },
}
