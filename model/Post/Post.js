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
        required: [true, "Post Category is required"],
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
        required: [true, "Post Image is required"],
    },

},
    {
        timestamps: true,
        toJSON: { virtuals: true },
    }
);

// views count
postSchema.virtual("viewsCount").get(function () {
    const post = this;
    return post.numViews.length;
});
// likes count 
postSchema.virtual("likesCount").get(function () {
    const post = this;
    return post.likes.length;
});
// disLike count
postSchema.virtual("disLikeCount").get(function () {
    const post = this;
    return post.disLikes.length;
});
// calculate likes percentage
postSchema.virtual("likesPercentage").get(function () {
    const post = this;
    const total = +post.likes.length + +post.disLikes.length;
    const percentage = (post.likes.length / total) * 100;
    return `${percentage}%`;
});
// calculate disLikes percentage
// postSchema.virtual("disLikesPercentage").get(function () {
//     const post = this;
//     const total = +post.disLikes.length + +post.disLikes.length;
//     // const total = post.likes.length + post.disLikes.length;
//     const percentage = (post.disLikes.length / total) * 100;
//     return `${percentage}%`;
// });
postSchema.virtual("disLikesPercentage").get(function () {
    const total = this.likes?.length + this.disLikes?.length;

    if (!total) return "0%"; // handles 0 safely

    const percentage = (this.disLikes.length / total) * 100;

    return `${percentage.toFixed(1)}%`;
});
// if days is less than 0 return today, if days is 1 return yesterday else return days ago
postSchema.virtual("daysAgo").get(function () {
    const post = this;
    const date = new Date(post.createdAt);
    const daysAgo = Math.floor((Date.now() - date) / 86400000)
    console.log(daysAgo, "daysAgo");
    
    return daysAgo === 0 ? "Today" : daysAgo === 1 ? "Yesterday" : `${daysAgo} days ago`
   
});
// compile the post model
const Post = mongoose.model("Post", postSchema);

// export the post model
module.exports = Post;

