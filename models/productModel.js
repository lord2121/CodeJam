const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost:27017/CodeJam')

const ProductSchema = new Schema({
    image:String,
    title: String,
    description: String
});

const Product = mongoose.model('Product',ProductSchema);

const apple = new Product({image: "dqwhdbq"});

console.log(apple.image);