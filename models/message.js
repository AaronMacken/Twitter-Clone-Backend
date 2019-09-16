const mongoose = require("mongoose");
const User = require("./user");

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
        maxlength: 160
    },
    // reference to the user the message wil belong to
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    // adds a created at & updated at for each document that the schema creates
    timestamps: true
});

// before a message is removed
// find the user the message belongs to
// remove that message by ID
// save that user's data
// move on
// this will prevent mongo's findByIdAndRemove method from working
messageSchema.pre('remove', async function (next) {
    try {
        let user = await User.findById(this.user);
        user.messages.remove(this.id);
        await user.save();
        return next();

    } catch (err) {
        return next(err)
    }
})

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;