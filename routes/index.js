const express = require("express");
const router = express.Router();
const authToken = require("../middlewares/authToken");

const userRoutes = require("../routes/user.route");
const authRoutes = require("../routes/auth.route");
const distributorRoutes = require("../routes/distributor.route");
const dealerRoutes = require("../routes/dealer.route");
const productInstallationRoutes = require("../routes/productInstallation.route");
const versionRoutes = require("../routes/version.route");
const bannerRoutes = require("../routes/banner.route");

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/distributor", distributorRoutes);
router.use("/dealer",dealerRoutes);
router.use("/productInstallation", productInstallationRoutes);
router.use("/version", versionRoutes);
router.use("/banner", authToken, bannerRoutes)

module.exports = router;
