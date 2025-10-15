const express = require("express");
const router = express.Router();
const authToken = require("../middlewares/authToken");

const userRoutes = require("../routes/user.route");
const authRoutes = require("../routes/auth.route");
const distributorRoutes = require("../routes/distributor.route");
const dealerRoutes = require("../routes/dealer.route");
const installationRoutes = require("../routes/installation.route");
const productRoutes = require("../routes/product.route");

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/distributor", distributorRoutes);
router.use("/dealer",dealerRoutes);
router.use("/installation", installationRoutes);
router.use("/product", productRoutes);

module.exports = router;
