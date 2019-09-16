const express = require("express");

// merge params allows us to get acess to the id inside the router
const router = express.Router({mergeParams: true});

// functionality from the handlers file
const {createMessage, getMessage, deleteMessage} = require("../handlers/messages");

// prefix - /api/users/:id/messages
// when a post hits this route, use the createMessage function
router.route("/").post(createMessage);


router.route("/:message_id").get(getMessage).delete(deleteMessage);

module.exports = router;