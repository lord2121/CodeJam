require('dotenv').config();
const express = require("express");
const passport = require("passport");
const router = express.Router();

router.get('/auth/twitter',
  passport.authenticate('twitter'));

router.get('/auth/twitter/secrets', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


router.post('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;