require('dotenv').config();
const express = require("express");
const productModel = require('../models/productModel.js');
const FB = require("fb");
const { isLoggedIn } = require("../middleware.js");
const router = express.Router();
const { getProducts, productForm, productFormPost, getProduct, deleteProduct } = require("../controllers/productController.js");


router.get("/product/all", getProducts);

router.get("/product/post", productForm);

router.post("/product/post", isLoggedIn, productFormPost);

router.get("/product/:id", getProduct);

router.delete("/product/:id", isLoggedIn, deleteProduct)

module.exports = router