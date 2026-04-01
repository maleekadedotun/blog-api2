const { appErr } = require("../utils/appErr");
const getTokenFromHeaders = require("../utils/getTokenFromHeaders");
const verifyToken = require("../utils/verifyToken");

const isLoggedIn = async(req, res, next) => {
    // get token from headers
    const token = getTokenFromHeaders(req);
    // verify token
    const decodedUser = await verifyToken(token);
     //save the user into the req obj
     req.userAuth = decodedUser.id;
    if (!decodedUser) {
        return next(appErr("Invalid or expired token, please login again", 401));
    }
    else{
        next();
    }
   
}
module.exports = isLoggedIn;