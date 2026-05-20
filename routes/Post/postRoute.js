const express = require("express");
const storage = require("../../config/cloudinary");
const multer = require("multer");
const { postCreatedCtrl, fetchAllPostsCtrl, toggleLikesPostCtrl, toggleDislikesPostCtrl, postDetailsCtrl, postDeleteCtrl, postUpdateCtrl } = require("../../controllers/post/postCtrl");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const postRouter = express.Router();
const upload = multer({storage})

postRouter.post("/", isLoggedIn, upload.single("image"), postCreatedCtrl);
// postRouter.post(
//   "/test",
//   upload.single("image"),
//   (req, res) => {
//     console.log(req.file, "file");
//     console.log(req.body, "body");

//     res.json({
//       file: req.file,
//       body: req.body,
//     });
//   }
// );
postRouter.get("/", isLoggedIn, fetchAllPostsCtrl);
postRouter.get("/like/:id", isLoggedIn, toggleLikesPostCtrl);
postRouter.get("/dislike/:id", isLoggedIn, toggleDislikesPostCtrl);
postRouter.get("/details/:id", isLoggedIn, postDetailsCtrl);
postRouter.delete("/delete/:id", isLoggedIn, postDeleteCtrl);
postRouter.put("/update/:id", isLoggedIn, upload.single("image"), postUpdateCtrl);

module.exports = postRouter;