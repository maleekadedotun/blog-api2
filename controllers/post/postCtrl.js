const Post = require("../../model/Post/Post");
const User = require("../../model/User/User");

const postCreated = async (req, res) =>{
    const {title, description} = req.body;
    try {
        // find the user
        const author = await User.findById(req.userAuth);
        // create a post
        const postCreated = await Post.create({
            title,
            description,
            user: author._id
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

module.exports = {
    postCreated
}