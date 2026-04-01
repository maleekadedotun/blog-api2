const express = require("express");
const { postCreated } = require("../../controllers/post/postCtrl");
const isLoggedIn = require("../../middlewares/isLoggedIn");
const postRouter = express.Router();

postRouter.post("/", isLoggedIn, postCreated);

module.exports = postRouter;