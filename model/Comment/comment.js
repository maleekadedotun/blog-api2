const mongoose = require("mongoose");

// create Schema
const commentSchema = new mongoose.Schema({
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        required: [true, "Post is required"],
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    description: {
        type: String,
        required: [true, "Comment description is required"],
    },
}, 
{timestamps: true}
);

// compile the comment model
const Comment = mongoose.model("Comment", commentSchema);

// export the comment model
module.exports = Comment;