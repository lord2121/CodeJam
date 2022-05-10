require('dotenv').config();
const express = require("express");
const ejs = require("ejs");
const PORT = 3000;
const mongoose = require("mongoose");
const session = require("express-session");
const ejsMate = require("ejs-mate");
const facebookRoutes = require('./routes/facebookRoutes.js');
const productRoutes = require('./routes/productRoutes.js');
const commonRoutes = require('./routes/commonRoutes.js');
const productModel = require('./models/productModel.js');
const User = require('./models/usersModel.js');
const passport = require("passport")
const FacebookStrategy = require('passport-facebook').Strategy;
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');
const passportLocalMongoose = require("passport-local-mongoose");
const bodyParser = require("body-parser");
const FB = require("fb");
const methodOverride = require('method-override');
const { isLoggedIn } = require("./middleware.js");
const app = express();

<<<<<<< HEAD

FB.setAccessToken('EAAQD35p2XE0BACQZB87BCEGySLWABCxtCyP6MZAGccHZCZAvbNmS0TwjAGH55TwZA2ZC7rSIowgcMJYuHs9k7SJFSuPvkHzw98ZCJUu8gG3fGPVdNw0YbLDkYz6JDDpEBElt9kD6EPecF53IB9uk3tQg5WJqB4OrJQ0kdUZBTwtT0XIRrqZASJZBCHZC3Wn2qYwJNZBPgsLdAMeHC1mSblPZAgWdoJ1jrzpLo34infn6NgFJzqjOeajevPrCpdpVHNlBm928ZD');
const app = express()
=======
>>>>>>> 3e5d504c52fed6318956e3091b29cf49afe75a4b
app.engine('ejs', ejsMate);
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(methodOverride('_method'));
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(session({
  secret: process.env.SECRET || "Micul nostru secret",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
})
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:3000/auth/facebook/secrets"
},
  function (accessToken, refreshToken, profile, cb) {
    User.findOrCreate({
      facebookId: profile.id
    }, function (err, user) {
      return cb(err, user);
    });
  }
));

FB.setAccessToken(process.env.FB_ACCESS_TOKEN);
app.use("/", facebookRoutes);
app.use("/", commonRoutes);
app.use("/", productRoutes);


app.use('*', (req, res) => {
  res.render("../views/404.ejs");
})

app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}...`)
})