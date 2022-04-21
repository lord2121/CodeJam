require('dotenv').config();
const express = require("express")
const ejs = require("ejs")
const PORT = 3000
const mongoose = require("mongoose")
const session = require("express-session");
const ejsMate = require("ejs-mate")
const productRoutes = require('./routes/productRoutes.js')
const productModel = require('./models/productModel.js');
const passport = require("passport")
const FacebookStrategy = require('passport-facebook').Strategy;
const Schema = mongoose.Schema;
const findOrCreate = require('mongoose-findorcreate');
const passportLocalMongoose = require("passport-local-mongoose");


const app = express()
app.engine('ejs' , ejsMate);
app.set("view engine" , "ejs")
app.use(express.static("public"))


app.use(session({
    secret: "Micul nostru secret",
    resave : false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

 // mongoose.connect('mongodb://localhost:27017/UserDB')

const userSchema = new Schema({
    email: String,
    password: String,
    facebookId: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = mongoose.model('User',userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function(user, done) {
    done(null, user);
  });
  
  passport.deserializeUser(function(user, done) {
    done(null, user);
  });



passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret:process.env.FACEBOOK_APP_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/secrets"
  },
  function(accessToken, refreshToken, profile, cb) {
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
      console.log("GGGG")
    // Successful authentication, redirect home.
    res.redirect('/');
  });

app.get("/",(req,res)=>{
    res.render("index")
})



app.get("/product/all",(req,res)=>{
    res.render('../views/product/products')
})

app.get("/product/:id",(req,res)=>{
    res.render('../views/product/product.ejs')
})

app.get("/product/post",(req,res)=>{
    res.render("../views/product/productForm.ejs");
})

app.get("/login",(req,res)=>{
    res.render("../views/partials/login.ejs");
})




app.use('*' , (req , res) => {
    res.send("404 not found")
})

app.listen(PORT, ()=>{
    console.log("Listening on PORT 3000")
})