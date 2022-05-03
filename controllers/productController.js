const productModel = require('../models/productModel.js');

module.exports.getProduct = (req, res) => {
    console.log("Sall")
    res.render('../views/product/product.ejs')
}

module.exports.postProduct = (req, res) => {
    console.log("Sall123")
    res.render('../views/product/productForm.ejs')
}

module.exports.getAllProducts = (req, res) => {
    console.log("Sall1234")
    res.render('../views/product/products')
}