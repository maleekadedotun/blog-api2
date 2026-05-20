const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");
const { appErr } = require("../../utils/appErr");

const postCreatedCtrl = async (req, res, next) => {
    console.log("FILE:", req.file);
    console.log(req.userAuth, "Auth");


    const { title, description, category } = req.body;
    // console.log(req.file);
    // console.log("BODY:", req.body);
    // console.log("USER:", req.userAuth);


    try {
        // find the user
        const author = await User.findById(req.userAuth);

        if (!author) {
            return next(appErr("User not found or invalid token", 404));
        }
        console.log("isBlocked:", author.isBlocked);
        // check if user is blocked
        if (author.isBlocked) {
            return next(appErr("Access Denied, You are blocked", 403));
        }
        // create a post
        const postCreated = await Post.create({
            title,
            description,
            category,
            user: author._id,
            photo: req?.file?.path,
        })
        // Associate user to a post -push the post inside user post field
        author.posts.push(postCreated);
        // save the user
        await author.save();
        res.status(201).json({
            status: "Success",
            message: postCreated
        })
    }
    catch (error) {
        return next(appErr(error.message))
    }
}

const fetchAllPostsCtrl = async (req, res, next) => {
    try {
        const posts = await Post.find({})
            .populate("user")
            .populate("category", "title");

        // check if the user is blocked by the owner
        const filteredPost = posts.filter(post => {
            // get all blocked users
            const blockedUsers = post.user.blocked;
            const isBlocked = blockedUsers.includes(req.userAuth);
            console.log(blockedUsers);

            return isBlocked ? null : post;
            // return !isBlocked;
        })
        return res.status(200).json({
            status: "Success",
            message: "All posts fetched successfully",
            data: filteredPost,
        })
    } catch (error) {
        return next(appErr(error.message));
    }
}

// toggle like
const toggleLikesPostCtrl = async (req, res, next) => {
    try {
        // get the post
        const post = await Post.findById(req.params.id);
        // check if the user has already liked the post
        const isLiked = post.likes.includes(req.userAuth);
        if (isLiked) {
            post.likes = post.likes.filter(like => like.toString() !== req.userAuth.toString()
            )
            await post.save();
        }
        else {
            // if the user has not liked the post
            post.likes.push(req.userAuth);
            await post.save();
        }
        res.json({
            status: "Success",
            data: post,
        })
    } catch (error) {
        return next(appErr(error.message));
    }
}

// toggle dislike
const toggleDislikesPostCtrl = async (req, res, next) => {
    try {
        // get the post
        const post = await Post.findById(req.params.id);
        // check if the user has already liked the post
        const isUnLiked = post.disLikes.includes(req.userAuth);
        if (isUnLiked) {
            post.disLikes = post.disLikes.filter(like => like.toString() !== req.userAuth.toString()
            )
            await post.save();
        }
        else {
            // if the user has not liked the post
            post.disLikes.push(req.userAuth);
            await post.save();
        }
        res.json({
            status: "Success",
            data: post,
        })
    } catch (error) {
        return next(appErr(error.message));
    }
}

const postDetailsCtrl = async (req, res, next) => {
    try {
        // find the post
        const post = await Post.findById(req.params.id)
        console.log(post, "post");

        // check if user has already viewed the post
        const isViewed = post.numViews.includes(req.userAuth);
        console.log(isViewed, "view");

        if (isViewed) {
            return res.json({
                status: "Success",
                data: post,
            })
        }
        else {
            // push the user to numViews array
            post.numViews.push(req.userAuth);
            // save the post
            await post.save();
            return res.json({
                status: "Success",
                data: post,
            })
        }
    } catch (error) {
        return next(appErr(error.message));
    }
}

const postDeleteCtrl = async (req, res, next) => {
    try {
        // find the post
        const post = await Post.findById(req.params.id);
        if (post.user.toString() !== req.userAuth.toString()) {
            return next(appErr("You are not allowed to delete this post", 404));
        }
        await Post.findByIdAndDelete(req.params.id);
        res.json({
            status: "Success",
            message: "Post deleted successfully",
        })
    } catch (error) {
        return next(appErr(error.message));
    }
}

// updating a post
const postUpdateCtrl = async (req, res, next) => {
    const { title, description, category } = req.body;
    try {
        // find the post
        const post = await Post.findById(req.params.id);
        if (post.user.toString() !== req.userAuth.toString()) {
            return next(appErr("You are not allowed to update this post", 404));
        }
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
            title,
            description,
            category,
            photo: req?.file?.path,
        }, { new: true });
        res.json({
            status: "Success",
            message: updatedPost,
        })
    } catch (error) {
        return next(appErr(error.message));
    }
}

// const postUpdateCtrl = async (req, res, next) => {
//     const { title, description, category } = req.body;

//     try {
//         const post = await Post.findById(req.params.id);

//         // if (!post) {
//         //     return next(appErr("Post not found", 404));
//         // }

//         // if (!post.user) {
//         //     return next(appErr("Post owner missing", 500));
//         // }

//         if (post.user.toString() !== req.userAuth.toString()) {
//             return next(appErr("You are not allowed to update this post", 403));
//         }

//         const updatedPost = await Post.findByIdAndUpdate(
//             req.params.id,
//             {
//                 title,
//                 description,
//                 category,
//                 photo: req?.file?.path,
//             },
//             { new: true }
//         );

//         res.json({
//             status: "Success",
//             message: updatedPost,
//         });

//     } catch (error) {
//         return next(appErr(error.message));
//     }
// };
module.exports = {
    postCreatedCtrl,
    fetchAllPostsCtrl,
    toggleLikesPostCtrl,
    toggleDislikesPostCtrl,
    postDetailsCtrl,
    postDeleteCtrl,
    postUpdateCtrl,
}