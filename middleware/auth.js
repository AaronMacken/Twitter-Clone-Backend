require("dotenv").load;
const jwt = require("jsonwebtoken");

// verify users middleware

// make sure user is logged in - authentication
exports.loginRequired = function (req, res, next) {
    // attempt to get the the http header
    // http header is meta data about the request being sent
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, function (err, payload) {
            // if it was decoded that means that it exists and we can move on
            if (payload) {
                return next();
            } else {
                return next({
                    // 401 - unauthorized
                    status: 401,
                    message: "Please log in first."
                });
            }
        })
    } catch (err) {
        return next({
            status: 401,
            message: "Please log in first."
        });
    }
};

// make sure we get the correct user - authorization
exports.ensureCorrectUser = function (req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        jwt.verify(token, process.env.SECRET_KEY, function (err, payload) {
            if (payload && payload.id === req.params.id) {
                return next();
            } else {
                return next({
                    status: 401,
                    message: "Unauthorized"
                });
            }
        })
    } catch (err) {
        return next({
            status: 401,
            message: "Unauthorized"
        });
    }

};

