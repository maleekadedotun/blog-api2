const User = require("../model/User/User");
const { appErr } = require("../utils/appErr");
const getTokenFromHeaders = require("../utils/getTokenFromHeaders");
const verifyToken = require("../utils/verifyToken");

const isAdmin = async (req, res, next) => {
    // get token from headers
    const token = getTokenFromHeaders(req);
    // verify token
    const decodedUser = await verifyToken(token);
    //save the user into the req obj
    req.userAuth = decodedUser.id;
    console.log("admin", decodedUser.id);
    const user = await User.findById(decodedUser.id);
    if (user.isAdmin) {
        next()
    }
    else {
        return next(appErr("Access denied, admin only", 403));

    }



}
module.exports = isAdmin;