const mongoose = require('mongoose');

// create Schema
const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Post Title is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Post Description is required"],
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        // required: [true, "Post Category is required"],
    },
    numViews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    disLikes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    photo: {
        type: String,
        // required: [true, "Post Image is required"],
    },

},
    {
        timestamps: true,
    }
);

// compile the post model
const Post = mongoose.model("Post", postSchema);

// export the post model
module.exports = Post;

