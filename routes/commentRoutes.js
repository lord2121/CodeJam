require('dotenv').config();
const express = require("express");
const { isLoggedIn, catchAsync } = require("../middleware.js");
const router = express.Router();
const { postComment, deleteComment } = require("../controllers/commentController.js");

router.post("/product/:id/postComment", catchAsync(postComment));

router.delete("/product/:id/:commentId", isLoggedIn, catchAsync(deleteComment));

module.exports = router