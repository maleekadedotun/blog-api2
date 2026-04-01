const bcrypt = require("bcryptjs");
const User = require("../../model/User/User");
const generateToken = require("../../utils/generateToken");
// const getTokenFromHeaders = require("../../utils/getTokenFromHeaders");
const { appErr, AppErr } = require("../../utils/appErr");
const Post = require("../../model/Post/Post");
const Category = require("../../model/Category/category");
const Comment = require("../../model/Comment/comment");

const userRegisterCtrl = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;
    try {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            next(new AppErr("Email already exists", 500));
        }
        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        // create user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });
        res.json({
            status: "Success",
            data: user,
        })
    } catch (error) {
        next(appErr(error.message));

    }
}

const userLoginCtrl = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        // check if email exists
        const userFound = await User.findOne({ email });
        if (!userFound) {
            // throw new Error("Invalid login credentials");
           return next(appErr("Invalid login credentials"))
        }
        // check if password matches
        const isPasswordMatched = await bcrypt.compare(password, userFound.password);
        if (!isPasswordMatched) {
           return next(appErr("Invalid login credentials"))

        }
        res.json({
            status: "Success",
            data: {
                firstName: userFound.firstName,
                lastName: userFound.lastName,
                email: userFound.email,
                isAdmin: userFound.isAdmin,
                token: generateToken(userFound._id),
            }
        })
    } catch (error) {
        next(appErr(error.message))


    }
}

// get all users
const getAllUsersCtrl = async (req, res, next) => {
    try {
        const users = await User.find();
        res.json({
            status: "Success",
            data: users
        })
    } catch (error) {
        next(appErr(error.message));

    }
}

// update user
const updateUserCtrl = async (req, res, next) => {
    const { firstName, lastName, email } = req.body
    try {
        if (email) {
            const emailExists = await User.findOne({ email });
            if (emailExists) {
                return next(appErr("Email is taken", 400))
            }
        }
        // find the user to be updated
        const userUpdate = await User.findByIdAndUpdate(req.userAuth, {
            firstName,
            lastName,
            email,
        },
            {
                new: true,
                runValidators: true,
            }
        )
        res.json({
            status: "Success",
            data: userUpdate,
        })
    } catch (error) {
        next(appErr(error.message))

    }
}

// update password
const updatePassswordCtrl = async (req, res, next) => {
    const { password } = req.body;
    try {
        if (password) {
            // salt and hash the new password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const updatePassword = await User.findByIdAndUpdate(req.userAuth, {
                password: hashedPassword,
            })
            res.json({
                status: "Success",
                data: "Password has been changed or updated successfully",
            })
        }
        else{
            return next(appErr("Please provide a new password", 400))
        }

    } catch (error) {
        return next(appErr(error.message))


    }
}

// delete user account
const deleteUserAccountCtrl = async (req, res, next) => {
    try {
        // find the user to be delete
        const userToDelete = await User.findById(req.userAuth);
        // console.log("user to delete:", userToDelete);
        // find post to be delete
        await Post.deleteMany({ user: req.userAuth });
        // find category to be delete
        await Category.deleteMany({ user: req.userAuth });
        // find the comment to be delete
        await Comment.deleteMany({ user: req.userAuth });
        // delete user
        await userToDelete.deleteOne();
        res.json({
            status: "Success",
            data: "You have successfully deleted your account"
        })
    } catch (error) {
        return next(appErr(error.message))


    }
}


// followers controller
const followingCtrl = async (req, res, next) => {
    try {
        // find the user to be followed
        const userToFollow = await User.findById(req.params.id);
        // find the user who is following
        const userWhoFollowed = await User.findById(req.userAuth);
        // check if both users are found
        if (userToFollow && userWhoFollowed) {
            // check if userWhoFollowed is already in the userToFollow followers array
            const isUserAlreadyFollowing = userWhoFollowed.following.find(
                following => following.toString() === userToFollow._id.toString()
            );
            if (isUserAlreadyFollowing) {
                return next(appErr("You are already following this user", 403));
            }
            else {
                // push the userWhoFollowed to the userToFollow followers array
                userToFollow.followers.push(userWhoFollowed._id);
                // push user to follow to the userWhoFollowed following array
                userWhoFollowed.following.push(userToFollow._id);

                // save both users
                await userWhoFollowed.save();
                await userToFollow.save();

                res.json({
                    status: "Success",
                    data: " You have successfully followed this user",
                });

            }
        }

    } catch (error) {
        return next(appErr(error.message))


    }
}

// unfollow controller
const unfollowCtrl = async (req, res, next) => {
    try {
        // find the user to be unfollowed
        const userToBeUnFollow = await User.findById(req.params.id);
        // find the user who is unfollowing
        const userWhoUnFollowed = await User.findById(req.userAuth);
        // check if user and userWhoUnFollowed are found
        if (userToBeUnFollow && userWhoUnFollowed) {
            // check if userWhoUnFollowed is already in the userToUnFollow followers array
            const isUserAlreadyFollow = userToBeUnFollow.followers.find(
                follower => follower.toString() === userWhoUnFollowed._id.toString()
            )
            if (!isUserAlreadyFollow) {
                return next(appErr("You have not follow this user"));
            }
            else {
                // Remove userWhoUnFollowed from the user's followers arrray
                userToBeUnFollow.followers = userToBeUnFollow.followers.filter(
                    follower => follower.toString() !== userWhoUnFollowed._id.toString()
                );
                // save the user
                await userToBeUnFollow.save()
                // Remove user userToBeUnFollow from the userWhoUnFollowedfollowing array
                userWhoUnFollowed.following = userWhoUnFollowed.following.filter(
                    following => following.toString() !== userToBeUnFollow._id.toString()
                );
                // save user 
                await userWhoUnFollowed.save();
                res.json({
                    status: "Success",
                    data: "You have successfully unFollowed this user",
                });
            }

        }
    } catch (error) {
       return next(appErr(error.message))

    }
}

// profile viewers controller
const whoViewMyProfileCtrl = async (req, res, next) => {
    try {
        // find the original user       
        const user = await User.findById(req.params.id);
        // find user who viewedthe original user 
        const userWhoViewed = await User.findById(req.userAuth);
        // check if original and who viewed are found
        if (user && userWhoViewed) {
            // check if userWhoViewed is already in the users viewers array 
            const isUserAlreadyViewed = user.viewers.find(
                viewer => viewer.toString() === userWhoViewed._id.toString()
            );
            if (isUserAlreadyViewed) {
                return next(appErr("You have already viewed this profile", 403));
            }
            else {
                // push the userWhoViewed to the original user's viewers array
                user.viewers.push(userWhoViewed._id);
                // save user
                await user.save();
                res.json({
                    status: "Success",
                    data: "You have successfully viewed this profile",
                });
            }

        }

    } catch (error) {
        return next(appErr(error.message))
    }
}

// block
const blockUsersCtrl = async (req, res, next) => {
    try {
        // find the user to be blocked
        const userToBeBlocked = await User.findById(req.params.id);
        // find the user who is unfollowing
        const userWhoBlocked = await User.findById(req.userAuth);
        // check if userToBeBlocked and userWhoBlocked are found
        if (userToBeBlocked && userWhoBlocked) {
            // check if userToBeBlocked is already in the userWhoBlocked blocked array 
            const isUserAlreadyBlocked = userWhoBlocked.blocked.find(
                blocked => blocked.toString() === userToBeBlocked._id.toString()
            );
            if (isUserAlreadyBlocked) {
                return next(appErr("You already blocked this user"))
            }
            else {
                // push userToBeBlocked to the userWhoBlocked array
                userWhoBlocked.blocked.push(userToBeBlocked._id)
                // save
                await userWhoBlocked.save()
                res.json({
                    status: "Success",
                    data: "You have succesfully blocked this user"
                })
            }

        }
    } catch (error) {
        res.json(error.message);

    }
}

// unBlocked
const unBlockUserCtrl = async (req, res, next) => {
    try {
        // find the user to be unBlocked
        const userToBeUnBlocked = await User.findById(req.params.id);
        // find the user who is unBlocking
        const userWhoUnBlocked = await User.findById(req.userAuth);
        // check if userToBeUnBlocked and userWhoUnBlocked are found
        if (userToBeUnBlocked && userWhoUnBlocked) {
            // check if userToBeUnBlocked is already in the userWhoUnBlocked blocked array 
            const isUserAlreadyBlocked = userWhoUnBlocked.blocked.find(
                blocked => blocked.toString() === userToBeUnBlocked._id.toString()
            );
            if (!isUserAlreadyBlocked) {
                return next(appErr("You have not blocked this user"))
            }
            else {
                // Remove userToBeUnBlocked from userWhoUnBlocked array
                userWhoUnBlocked.blocked = userWhoUnBlocked.blocked.filter(
                    blocked => blocked.toString() !== userToBeUnBlocked._id.toString()
                );
                // save
                await userWhoUnBlocked.save();
                res.json({
                    status: "Success",
                    data: "You have already unblocked this user"
                });
            }

        }
    } catch (error) {
        res.json(error.message);

    }
}

// Admin Blocked
const adminBlockedUserCtrl = async (req, res, next) => {
    try {
        // find user to be blocked
        const userToBeBlocked = await User.findById(req.params.id)
        if (!userToBeBlocked) {
            return next(appErr("User not found"))
        }
        else {
            // change isBlocked to true
            userToBeBlocked.isBlocked = true
            // save
            await userToBeBlocked.save();
            res.json({
                status: "Success",
                data: "You have successfully blocked this user"
            })
        }
    } catch (error) {
       return next(appErr(error.message))

    }
}

// Admin unBlocked
const adminUnBlockedUserCtrl = async (req, res, next) => {
    try {
        // find user to be unblocked
        const userToBeUnBlocked = await User.findById(req.params.id)
        if (!userToBeUnBlocked) {
            return next(appErr("User not found"))
        }
        else {
            // change isBlocked to true
            userToBeUnBlocked.isBlocked = false
            // save
            await userToBeUnBlocked.save();
            res.json({
                status: "Success",
                data: "You have successfully un-blocked this user"
            })
        }
    } catch (error) {
       return next(appErr(error.message))

    }
}

// get user profile
const getUserProfileCtrl = async (req, res) => {
    // console.log("req.userAuth:", req.userAuth);

    // console.log(req.params);
    // console.log(req.headers);
    // console.log(req.userAuth, "user auth from isLoggedIn middleware");

    // const {id} = req.params;
    try {
        // const token = getTokenFromHeaders(req);
        // console.log(token);
        const user = await User.findById(req.userAuth).populate("posts");
        // console.log(user);

        res.json({
            status: "Success",
            data: user,
        })
    } catch (error) {
         return next(appErr(error.message))

    }
}

const ProfileUploadCtrl = async (req, res, next) => {
    console.log(req.file);
    console.log("req.userAuth:", req.userAuth);
    try {
        // find the user to be updated
        const userToUpdate = await User.findById(req.userAuth);
        // check if user is found
        if (!userToUpdate) {
            return next(appErr("User not found", 404));
        }
        // check if user is blocked
        if (userToUpdate.isBlocked) {
            return next(appErr("Action not allowed, you are blocked", 403));
        }
        // check if user is updating their profile photo
        if (req.file) {
            // update the user profile photo
            // userToUpdate.profilePhoto = req.file.path;
            // await userToUpdate.save();
            await User.findByIdAndUpdate(
                req.userAuth,
                {
                    $set: {
                        profilePhoto: req.file.path
                    }
                },
                {
                    new: true,
                }
            );
            res.json({
                status: "Success1",
                data: "You have successfuly updated your profile photo",
            });
        }


    } catch (error) {
        // res.json(error.message);
        next(appErr(error.message, 500));

    }
}

module.exports = {
    userRegisterCtrl,
    userLoginCtrl,
    getAllUsersCtrl,
    getUserProfileCtrl,
    ProfileUploadCtrl,
    whoViewMyProfileCtrl,
    followingCtrl,
    unfollowCtrl,
    blockUsersCtrl,
    unBlockUserCtrl,
    adminBlockedUserCtrl,
    adminUnBlockedUserCtrl,
    updateUserCtrl,
    updatePassswordCtrl,
    deleteUserAccountCtrl,
}