require('dotenv').config();
const express = require("express");
const passport = require("passport")
const router = express.Router();


router.get('/auth/facebook', passport.authenticate('facebook'));

router.get('/auth/facebook/secrets', passport.authenticate('facebook', { failureRedirect: '/login', successRedirect: '/' }));

module.exports = router;