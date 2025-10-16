const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const authToken = require("../middlewares/authToken");

router.post('/createProduct', authToken, productController.createProduct);
router.get('/getProducts', productController.listProducts);
router.get('/productById/:productId', productController.getProduct);

module.exports = router;
