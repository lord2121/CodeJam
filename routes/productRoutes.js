require('dotenv').config();
const express = require("express");
const productModel = require('../models/productModel.js');
const FB = require("fb");
const { isLoggedIn } = require("../middleware.js");
const router = express.Router();
const { getProducts, productForm, productFormPost, getProduct, deleteProduct } = require("../controllers/productController.js");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.get("/product/all", getProducts);

router.get("/product/post", productForm);

router.post("/product/post", isLoggedIn, upload.single('newImage'), productFormPost);

router.get("/product/:id", getProduct);

router.delete("/product/:id", isLoggedIn, deleteProduct)

module.exports = router