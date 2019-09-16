const mongoose = require("mongoose");
mongoose.set("debug", true);

// Allows mongoose to return promises
// important because the application's async functions will use promises
mongoose.Promise = Promise;

mongoose.connect("mongodb://localhost/warbler", {
    keepAlive: true,
    useNewUrlParser: true
});

module.exports.User = require("./user");
module.exports.Message = require("./message");

