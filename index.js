// load env var that is used in auth.js
require("dotenv").config();


const express = require("express"),
    app = express(),
    db = require("./models"),
    cors = require("cors"),
    bodyParser = require("body-parser"),
    errorHandler = require("./handlers/error"),
    authRoutes = require("./routes/auth"),
    messagesRoutes = require("./routes/messages"),
    {loginRequired, ensureCorrectUser} = require("./middleware/auth"),
    PORT = 3001;

// allows cross origin requests
app.use(cors());
app.use(bodyParser.json());

// all the routes from the authRoutes are prefixed with /api/auth
app.use("/api/auth", authRoutes);
app.use("/api/users/:id/messages", loginRequired, ensureCorrectUser, messagesRoutes);

app.use("/api/messages", loginRequired, async function(req, res, next) {
try {
    let messages = await db.Message.find().sort({createdAt: "desc"}).populate("user", {
        username: true, 
        profileImageUrl: true
    });
    return res.status(200).json(messages);
} catch (error) {
    
}
});


// express error handler
// create an error message with a status code
// use next to take that info to the next piece of middleware
app.use(function(req, res, next) {
    let err = new Error("Not Found");
    err.status = 404;
    next(err);
});

// error handler function that uses the error data from the handler function above
app.use(errorHandler);

app.listen(PORT, function() {
    console.log(`Server is starting on port ${PORT}`);
});