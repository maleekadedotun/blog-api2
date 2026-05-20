// const jwt = require('jsonwebtoken');
// const verifyToken = (token) => {
//     return jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//         if (err) {
//             return false;
//         }
//         else {
//             return decoded;
//         }
//     });
// }
// module.exports = verifyToken;

const jwt = require('jsonwebtoken');

const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded;
    } catch (err) {
        return false;
    }
};

module.exports = verifyToken;