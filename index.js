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


FB.setAccessToken('EAAQD35p2XE0BACQZB87BCEGySLWABCxtCyP6MZAGccHZCZAvbNmS0TwjAGH55TwZA2ZC7rSIowgcMJYuHs9k7SJFSuPvkHzw98ZCJUu8gG3fGPVdNw0YbLDkYz6JDDpEBElt9kD6EPecF53IB9uk3tQg5WJqB4OrJQ0kdUZBTwtT0XIRrqZASJZBCHZC3Wn2qYwJNZBPgsLdAMeHC1mSblPZAgWdoJ1jrzpLo34infn6NgFJzqjOeajevPrCpdpVHNlBm928ZD');
const app = express()
app.engine('ejs', ejsMate);
app.set("view engine", "ejs")
app.use(express.static("public"))
app.use(bodyParser.urlencoded({
  extended: true
}))
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
    User.findOrCreate({
      facebookId: profile.id
    }, function (err, user) {
      return cb(err, user);
    });
  }
));

app.get('/auth/facebook',
  passport.authenticate('facebook'));

app.get('/auth/facebook/secrets',
  passport.authenticate('facebook', {
    failureRedirect: '/login'
  }),
  function (req, res) {
    res.redirect('/');
  });

app.get("/", (req, res) => {
  res.render("index")
})

app.get("/contact", (req, res) => {
  res.render("contact")
})


app.get("/product/all", async (req, res) => {
  const foundItems = await productModel.find({}).sort({
    _id: -1
  });
  res.render('../views/product/products', {
    newProductItem: foundItems
  });
})

app.get("/product/post", (req, res) => {
  res.render("../views/product/productForm.ejs");
})

app.post("/product/post", async (req, res) => {
  const productTitle = req.body.newTitle
  const productImage = req.body.newImage
  const productDescription = req.body.newDescription
  const {
    instagram,
    facebook
  } = req.body;


  const newProduct = new productModel({
    image: productImage,
    title: productTitle,
    description: productDescription
  })
  const id = newProduct._id
  await newProduct.save()

  let productUrl = process.env.HOST + "/product/" + id;
  if (facebook == "on") {
    FB.api(
      '/569175147961571/photos',
      'POST', {
        "message": productDescription + '\n' + productUrl,
        "url": "https://www.gorjonline.ro/wp-content/uploads/2020/03/luna.jpg"
      },
      async function (res) {
        if (!res || res.error) {
          console.log(!res ? 'error occurred' : res.error);
          return;
        } else {
          const postId = res.id //Acesta este id-ul postarii de pe instagram
          await productModel.findByIdAndUpdate(id, {
            facebookId: postId
          }, function (err, docs) {
            if (err) {
              console.log(err)
            }
          }).clone();
        }
      }
    );

  }

  if (instagram == "on") {
    FB.api(
      '/17841453033655742/media',
      'POST', {
        "image_url": productImage
      },
      function (res) {
        if (!res || res.error) {
          console.log(!res ? 'error occurred' : res.error);
          return;
        } else {
          const containerId = res.id

          FB.api(
            '/17841453033655742/media_publish',
            'POST', {
              "creation_id": containerId
            },
            async function (response) {
              if (!res || res.error) {
                console.log(!res ? 'error occurred' : res.error);
                return;
              } else {
                const mediaId = response.id //Acesta este id-ul postarii de pe instagram
                await productModel.findByIdAndUpdate(id, {
                  instagramId: mediaId
                }, function (err, docs) {
                  if (err) {
                    console.log(err)
                  }
                }).clone();
              }
            }
          );
        }
      }
    );
  }

  res.redirect("/product/all")
})

app.get("/product/:id", async (req, res) => {
  id = req.params.id;
  const product = await productModel.findById(id);
  const igID = product.instagramId;
  const fbID = product.facebookId;
  let comentarii = []
  if (fbID && igID) {
    const comentariiIgSiFb = []
    FB.api(
      '/' + fbID + '/comments',
      'GET', {},
      function (response) {
        if (!response || res.response) {
          console.log(!response ? 'error occurred' : response.error);
          return;
        } else {
          Object.keys(response).forEach(key => {
            Object.keys(response[key]).forEach(key1 => {
              if (response[key][key1].message) comentariiIgSiFb.push(response[key][key1].message)

            })
          })
          FB.api(
            '/' + igID + '/comments',
            'GET', {},
            function (response) {
              if (!response || res.response) {
                console.log(!response ? 'error occurred' : response.error);
                return;
              } else {
                Object.keys(response).forEach(function (key) {
                  response[key].forEach(function (a) {
                    comentariiIgSiFb.push(a.text)
                  })
                });

                res.render('../views/product/product', {
                  product,
                  comments: comentariiIgSiFb
                });
              }
            }
          );


        }
      }
    );



  } else if (fbID) {
    const comentariiFacebook = []
    FB.api(
      '/' + fbID + '/comments',
      'GET', {},
      function (response) {
        if (!response || res.response) {
          console.log(!response ? 'error occurred' : response.error);
          return;
        } else {
          Object.keys(response).forEach(key => {
            Object.keys(response[key]).forEach(key1 => {
              if (response[key][key1].message) comentariiFacebook.push(response[key][key1].message)

            })
          })
        }

        res.render('../views/product/product', {
          product,
          comments: comentariiFacebook
        });
      }
    );
  } else if (igID) {
    const comentariiInstagram = []
    FB.api(
      '/' + igID + '/comments',
      'GET', {},
      function (response) {
        if (!response || res.response) {
          console.log(!response ? 'error occurred' : response.error);
          return;
        } else {
          Object.keys(response).forEach(function (key) {
            response[key].forEach(function (a) {
              comentariiInstagram.push(a.text)
            })
          });
        }

        res.render('../views/product/product', {
          product,
          comments: comentariiInstagram
        });
      }
    );

  } else res.render('../views/product/product', {
    product,
    comments: comentarii
  });
})

app.delete("/product/:id", async (req, res) => {
  id = req.params.id;
  await productModel.deleteOne({
    _id: id
  });
  res.redirect("/product/all");
})

app.use('*', (req, res) => {
  res.render("../views/404.ejs");
})



app.listen(PORT, () => {
  console.log(`Listening on PORT ${PORT}...`)
})