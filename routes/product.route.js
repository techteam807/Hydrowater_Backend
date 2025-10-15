const express = require("express");
const router = express.Router();
const productController = require("../controllers/product.controller");

router.get("/verify/:qr", productController.verifyProduct);

module.exports = router;