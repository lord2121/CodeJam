const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose")
const findOrCreate = require('mongoose-findorcreate');

mongoose.connect('mongodb://localhost:27017/Products')

const productSchema = new Schema({
<<<<<<< HEAD
  image: String,
  title: String,
  description: String
});

const Product = mongoose.model('Product', productSchema);

=======
    image: String,
    title:String,
    description: String
  });
  
  productSchema.plugin(passportLocalMongoose);
  productSchema.plugin(findOrCreate);
  const Product = mongoose.model('Product',productSchema);
>>>>>>> parent of f6796a9 (Add product show)

 

module.exports = Product


