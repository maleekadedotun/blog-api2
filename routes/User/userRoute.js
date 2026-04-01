const express = require('express');
const { userRegisterCtrl, userLoginCtrl,
    getAllUsersCtrl, getUserProfileCtrl, 
    ProfileUploadCtrl, whoViewMyProfileCtrl,
    followingCtrl, unfollowCtrl, blockUsersCtrl, 
    unBlockUserCtrl,
    adminBlockedUserCtrl,
    adminUnBlockedUserCtrl,
    updateUserCtrl,
    updatePassswordCtrl,
    deleteUserAccountCtrl
} = require('../../controllers/user/userCtrl.js');
const isLoggedIn = require('../../middlewares/isLoggedIn.js');
const multer = require('multer');
const storage = require('../../config/cloudinary.js');
const isAdmin = require('../../middlewares/isAdmin.js');
const userRouter = express.Router();

// intance of multer
const upload = multer({ storage })


userRouter.post("/register", userRegisterCtrl);
userRouter.post("/login", userLoginCtrl);
userRouter.get("/", getAllUsersCtrl);
userRouter.get("/profile/:id", isLoggedIn, getUserProfileCtrl);
userRouter.put("/update-user/:id", isLoggedIn, updateUserCtrl);
userRouter.get("/profile-viewers/:id", isLoggedIn, whoViewMyProfileCtrl);
userRouter.get("/following/:id", isLoggedIn, followingCtrl);
userRouter.get("/unFollow/:id", isLoggedIn, unfollowCtrl);
userRouter.get("/block/:id", isLoggedIn, blockUsersCtrl);
userRouter.get("/un-block/:id", isLoggedIn, unBlockUserCtrl);
userRouter.put("/admin-block/:id", isLoggedIn, isAdmin, adminBlockedUserCtrl);
userRouter.put("/admin-un-block/:id", isLoggedIn, isAdmin, adminUnBlockedUserCtrl);
userRouter.put("/update-password", isLoggedIn, updatePassswordCtrl);
userRouter.delete("/delete-account", isLoggedIn, deleteUserAccountCtrl);
userRouter.post("/profile-photo-upload", upload.single("profile"), isLoggedIn, ProfileUploadCtrl);


module.exports = userRouter;