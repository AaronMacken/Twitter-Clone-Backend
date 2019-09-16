const db = require("../models");

exports.createMessage = async function(req, res, next) {
    try {
        // create a new message with req.body.text
        // the user reference will use req.params.id to find that use
        let message = await db.Message.create({
            text: req.body.text,
            user: req.params.id
        })
        // find the user by ID and push to the user's messages array the specific message ID
        let foundUser = await db.User.findById(req.params.id);
        foundUser.messages.push(message.id);
        await foundUser.save();
        // find the message by ID and populate that message's user property
        // also retrieves that specific user's userName and profileImageUrl properties to send back
        // this allows us to only query the database once instead of multiple times
        let foundMessage = await db.Message.findById(message._id).populate("user", {
            userName: true,
            profileImageUrl: true
        });
        return res.status(200).json(foundMessage);
    } catch(err) {
        return next(err);
    }
}


// GET - api/users/:id/message/:message_id
exports.getMessage = async function(req, res, next) {
    try {
        let message = await db.message.find(req.params.message_id);
        return res.status(200).json(message);
    } catch (error) {
        return next(error);
    }
}


// DELETE - api/users/:id/message/:message_id
exports.deleteMessage = async function(req, res, next) {
    try {
        let foundMessage = await db.message.find(req.params.message_id);
        await foundMessage.remove();
        return res.status(200).json(foundMessage);
    } catch (error) {
        return next(error);
    }   
}