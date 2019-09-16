const db = require("../models"),
    jwt = require("jsonwebtoken");


// find user
// check sent password 
// sign in or redirect
exports.signin = async function(req, res, next) {
    // finding a user
    try {
      let user = await db.User.findOne({
        email: req.body.email
      });
      let { id, username, profileImageUrl } = user;
      let isMatch = await user.comparePassword(req.body.password);
      if (isMatch) {
        let token = jwt.sign(
          {
            id,
            username,
            profileImageUrl
          },
          process.env.SECRET_KEY
        );
        return res.status(200).json({
          id,
          username,
          profileImageUrl,
          token
        });
      } else {
        return next({
          status: 400,
          message: "Invalid Email/Password."
        });
      }
    } catch (e) {
      return next({ status: 400, message: "Invalid Email/Password." });
    }
  };

// create a User from the data coming in from a request
// destructure the user's data
// create a json web token
// first argument is the payload or user's values
// second is the secret key coming from the environment variable

exports.signup = async function (req, res, next) {
    try {
        let user = await db.User.create(req.body);
        let { id, userName, profileImageUrl } = user;
        let token = jwt.sign({
            id,
            userName,
            profileImageUrl
        }, process.env.SECRET_KEY);
        // send back the created data
        return res.status(200).json({
            id,
            userName,
            profileImageUrl,
            token
        })
    }
    catch (err) {
        // if validation fails
        if (err.code === 11000) {
            err.message = "Username or email already in use."
        }
        return next({
            status: 400,
            message: err.message
        })
    }
}
