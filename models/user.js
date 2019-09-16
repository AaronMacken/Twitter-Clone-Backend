const mongoose = require("mongoose"),
    bcrypt = require("bcrypt");

// bcrypt is used to hash passwords

// unique prevents duplicate values
const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    // password will be hashed
    password: {
        type: String,
        required: true
    },
    profileImageUrl: {
        type: String
    },
    // array of messages that are associated with this user
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }]
});

// hash the password with a hook
// pre - save: before the document is saved...
// use bcrypt to hash the password and set it to that user's password value
// next is called to move onto the next piece of middleware (saving the user document)
userSchema.pre("save", async function(next) {
    try {
        if(!this.isModified("password")){
            return next();
        }
        let hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        return next();
    }
    catch(err) {
        return next(err);
    }
});

// every user document created will have access to this function
// the function will take in a hashed password and compare it to the current user's hashed password
// returns a boolean value
userSchema.methods.comparePassword = async function(candidatePassword, next) {
    try{
        let isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    }
    catch(err) {
        return next(err);
    }
}


// this model is referenced as whatever str val was passed into the first argument and is 
// created based off of the schema in the second argument
const User = mongoose.model("User", userSchema);

module.exports = User;