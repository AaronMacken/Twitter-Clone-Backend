const db = require("../models"),
    jwt = require("jsonwebtoken");


// --------------------------------------------- sign in ------------------------------------ //
exports.signin = async function(req, res, next) {
    // finding a user with email passed in from req.body
    try {
      let user = await db.User.findOne({
        email: req.body.email
      });
      // destructure some of the found user's data for later
      let { id, username, profileImageUrl } = user;
      // compare entered password with user's hashed password
      let isMatch = await user.comparePassword(req.body.password);
      // if password is correct
      // create a json web token with the user's data & .env file
      if (isMatch) {
        let token = jwt.sign(
          {
            id,
            username,
            profileImageUrl
          },
          process.env.SECRET_KEY
        );
        // return back user data + token
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





// --------------------------------------------- sign in ------------------------------------ //

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
