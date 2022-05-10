const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")
const findOrCreate = require('mongoose-findorcreate');
const { Facebook } = require("fb/lib/fb");

mongoose.connect('mongodb://localhost:27017/Test')

const productSchema = new Schema({
  image: {
    type: String,
    required: false
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  instagramId: {
    type: String
  },
  facebookId: {
    type: String
  }

});

const Product = mongoose.model('Product', productSchema);



module.exports = Product


