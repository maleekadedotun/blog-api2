// const getTokenFromHeaders = req =>{
//      // get token from headers
//     const headerObj = req.headers;
//     const token = headerObj.authorization.split(" ")[1];
//     // console.log("Token:", token);
//     if (token !== undefined) {
//         return token;
//     }
//     else{
//         return false;
//     }
// }

// module.exports = getTokenFromHeaders;

const getTokenFromHeaders = (req) => {
    const headerObj = req.headers;

    if (!headerObj.authorization) {
        return false;
    }

    const token = headerObj.authorization.split(" ")[1];

    return token ? token : false;
};

module.exports = getTokenFromHeaders;