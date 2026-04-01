const mongoose = require("mongoose");
const Post = require("../Post/Post");
const { appErr } = require("../../utils/appErr");

// create Schema
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "First Name is required"]
    },
    lastName: {
        type: String,
        required: [true, "Last Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        // unique: true,
    },
    profilePhoto: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        // unique: true,
    },
    // postCount: {
    //     type: Number,
    //     default: 0,
    // },
    isBlocked: {
        type: Boolean,
        default: false,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    role: {
        type: Boolean,
        enum: ["Admin", "Guest", "Editor"],
    },
    viewers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    followers: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    following: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],
    // active: {
    //     type: Boolean,
    //     default: true,
    // },
    posts: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Post",
        }
    ],
    blocked: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        }
    ],

    plan: [
        {
            type: String,
            enum: ["Free", "Premium", "Pro"],
            default: "Free",
        }
    ],

    userAwards: [
        {
            type: String,
            enum: ["Bronze", "Silver", "Gold"],
            default: "Bronze",
        }
    ],
},
    {
        timestamps: true,
        toJSON: { virtuals: true }
    }
);
// hook
// pre -before a document is saved
userSchema.pre("findOne", async function () {
    // populate the posts
    this.populate("posts");
    // find th user id
    const userId = this._conditions._id;
    // find the post created by the user
    const posts = await Post.find({ user: userId });
    if (!posts.length) {
        console.log("No post created by the user", 404);
        return;
    }
    // get the last post created by the user
    const lastPost = posts[posts.length - 1];
    // get the last post created date
    const lastPostDate = lastPost?.createdAt;
    // console.log(lastPostDate);
    // convert the last post created date to a string format
    const lastPostDateString = lastPostDate.toDateString();
    console.log(lastPostDateString);
    // add the last post created date to the user schema
    userSchema.virtual("lastPostCreated").get(function () {
        return lastPostDateString;
    });

    // check if the user is inActive for 30days
    // currennt date
    const currentDate = new Date();
    // get the difference between the current date and the last post created date
    const diff = currentDate - lastPostDate
    // get the different in days and return less than 30 days
    const diffInDays = diff / (1000 * 3600 * 24);
    // console.log(diffInDays);
    if (diffInDays > 30) {
        // add the isActive field to the user schema and set it to true
        userSchema.virtual("inActive").get(function () {
            return true;
        })
        // find the user by Id and update
        await User.findByIdAndUpdate(userId,
            {
                isBlocked: true
            },
            {
                new: true
            }
        )
    }
    else {
        userSchema.virtual("inActive").get(function () {
            return false;
        })
        // find the user by Id and update
        await User.findByIdAndUpdate(userId,
            {
                isBlocked: false
            },
            {
                new: true
            }
        )
    }
    // add days a user is active
    const daysActive = Math.floor(diffInDays);
    userSchema.virtual("lastActivDays").get(function(){
        if(daysActive === 0){
            return "Today";
        }
        if (daysActive === 1) {
            return "Yesterday";
        }
        if (daysActive > 1) {
            return `${daysActive} days ago`;
        }
    })
    // console.log(daysActive);
    // check if a user posts is more than 10 and upgrade user award
    const numberOfPosts = posts.length;
    // check if the number of posts is less than 10 and update the user award to bronze
    if (numberOfPosts < 10) {
        await User.findByIdAndUpdate(
            userId,{
                userAwards: "Bronze",
            },
            {
                new: true
            }
        )
    }
    // check if number of pots is greater than 10 and update the user award to silver
    if (numberOfPosts > 10) {
        await User.findByIdAndUpdate(
            userId,{
                userAwards: "Silver",
            },
            {new: true}
        )
    }
    // check if number of posts is greater than 20 and update the user award to gold
    if (numberOfPosts > 20) {
        await User.findByIdAndUpdate(
            userId,{
                userAwards: "Gold",
            },
            {
                new: true
            }
        )
    }
    // console.log(numberOfPosts);

})
// post - after a document is saved
userSchema.post("save", function () {


    // console.log("post hook is called");
    // next();

})
// Get fullname
userSchema.virtual("fullname").get(function () {
    // console.log(this);
    return `${this.firstName} ${this.lastName}`

});

// Initials
userSchema.virtual("initials").get(function () {
    // console.log(this);
    return `${this.firstName[0]}${this.lastName[0]}`

});
// post count
userSchema.virtual("postCount").get(function () {
    return this.posts.length
});
// get followers count
userSchema.virtual("followersCount").get(function () {
    return this.followers.length
});
// get following count
userSchema.virtual("followingCount").get(function () {
    return this.following.length
});
// get viewers count
userSchema.virtual("viewersCount").get(function () {
    return this.viewers.length
});
// get blocked count
userSchema.virtual("blockedCount").get(function () {
    return this.blocked.length
});

// compile the user model
const User = mongoose.model("User", userSchema);

// export the user model
module.exports = User;