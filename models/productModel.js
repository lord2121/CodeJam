const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")
const findOrCreate = require('mongoose-findorcreate');

mongoose.connect('mongodb://localhost:27017/Test')

const productSchema = new Schema({
  image: String,
  title: String,
  description: String
});

const Product = mongoose.model('Product', productSchema);



module.exports = Product


