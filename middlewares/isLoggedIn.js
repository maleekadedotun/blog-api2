// const { appErr } = require("../utils/appErr");
// const getTokenFromHeaders = require("../utils/getTokenFromHeaders");
// const verifyToken = require("../utils/verifyToken");

// const isLoggedIn = async(req, res, next) => {
//     // get token from headers
//     const token = getTokenFromHeaders(req);
//     // verify token
//     const decodedUser = await verifyToken(token);
//      //save the user into the req obj
//      req.userAuth = decodedUser.id;
//     if (!decodedUser) {
//         return next(appErr("Invalid or expired token, please login again", 401));
//     }
//     else{
//         next();
//     }
   
// }
// module.exports = isLoggedIn;

const { AppErr } = require("../utils/appErr");
const getTokenFromHeaders = require("../utils/getTokenFromHeaders");
const verifyToken = require("../utils/verifyToken");

const isLoggedIn = async (req, res, next) => {
  try {
    const token = getTokenFromHeaders(req);

    if (!token) {
      return next(new AppErr("No token provided", 401));
    }

    const decodedUser = await verifyToken(token);

    if (!decodedUser) {
      return next(new AppErr("Invalid or expired token", 401));
    }

    req.userAuth = decodedUser.id;
    next();
  } catch (error) {
    next(new AppErr(error.message, 401));
  }
};

module.exports = isLoggedIn;