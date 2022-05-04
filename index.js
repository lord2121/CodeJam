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
const bodyParser = require("body-parser");
const FB = require("fb")
const methodOverride = require('method-override');


FB.setAccessToken('EAAQD35p2XE0BAGTaH0oPJYxjCG1ijEaUXZCUCk7rCcGgycbEX9uxZBCgMpXfkqgGGhr7s4jZBJu3GSqS63KXupseLrj6bBm82dZCwpy11FTT2JjneA78lmc3lodi629VZAavkfZAHUMczIDg48G7rNFUgM2aaFfTZBBZCMmpOR7uKsGpPF79tGUE4FTUDSNZBMFR5ZAJVxlGx0CsgrOP6h15BrH0GxsTZCQVzHfSrFXorrXhvXWZBxyi2hkV');
const app = express()
app.engine('ejs', ejsMate);
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())


app.use(session({
  secret: "Micul nostru secret",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

const userSchema = new Schema({
  email: String,
  password: String,
  facebookId: String
});



userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);


const User = mongoose.model('User', userSchema);

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
    User.findOrCreate({ facebookId: profile.id }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/secrets',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  });

app.get("/", (req, res) => {
  res.render("index")
})



app.get("/product/all", async (req, res) => {
  const foundItems = await productModel.find({}).sort({ _id: -1 });
  res.render('../views/product/products', { newProductItem: foundItems });
})

app.get("/product/post", (req, res) => {
  res.render("../views/product/productForm.ejs");
})

app.post("/product/post", async (req, res) => {
  const productTitle = req.body.newTitle
  const productImage = req.body.newImage
  const productDescription = req.body.newDescription
  const {instagram , facebook} = req.body;
  if(facebook=="on")
  {
    FB.api(
      '/4989596207793558/feed',
      'POST',
      { "message": "parfum de cocalar" },
      function (res) {
        if (!res || res.error) {
          console.log(!res ? 'error occurred' : res.error);
          return;
        }
      }
    );

  }
  const newProduct = new productModel({
    image: productImage,
    title: productTitle,
    description: productDescription
  })
  await newProduct.save()
  res.redirect("/product/all")
})

app.get("/product/:id", (req, res) => {
  id = req.params.id;
  productModel.findById(id, function (err, product) {
    res.render('../views/product/product', { product });
  })
})

app.delete("/product/:id", async (req, res) => {
  id = req.params.id;
  await productModel.deleteOne({ _id: id });
  res.redirect("/product/all");
})

app.use('*', (req, res) => {
  res.render("../views/404.ejs");
})



app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}...`)
})