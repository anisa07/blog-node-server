import {
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
import {getAllLikesForPost, getUserLikeByPostId, sendLike, updateLike} from "./swagger/likeSwagger";
import {changePassword, forgotPassword, isAuth, login, logout, signup} from "./swagger/authSwagger";

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
        "/user/info/{userId}": {
            get: getUserInfo,
        },
        "/user/follow/posts": {
            get: showFollowPosts
        },
        "/user": {
            get: getUsersBy
        },
        "/label": {
            post: createLabel,
            get: getLabels
        },
        "/label/{labelId}": {
            delete: deleteLabel,
            put: updateLabel
        },
        "/like": {
            post: sendLike,
            put: updateLike
        },
        "/like/user/post/{postId}": {
            get: getUserLikeByPostId,
        },
        "/like/post/{postId}": {
            get: getAllLikesForPost,
        },
        "/comment": {
            post: createComment
        },
        "/comment/{commentId}": {
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
        "/user/info": {
            post: updateUserInfo,
        },
        "/user/manage": {
            post: manageUser
        },
        "/user/follow": {
            post: followUser
        },
        "/user/photo/{filename}": {
            delete: deleteUserPhoto,
        },
        "/user/{userId}": {
            delete: deleteUser,
            // put: updateLabel
        },
        "/user/follow/{followId}": {
            get: checkIfIFollowUser,
            delete: unfollowUser
        },
    },
}
