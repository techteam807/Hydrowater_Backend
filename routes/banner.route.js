const express = require("express");
const router = express.Router();
const bannerController = require("../controllers/banner.controller");

router.get("/getBanners", bannerController.getBanners);
router.post("/createBanner", bannerController.createBanner);
router.put("/updateBanner/:bannerId", bannerController.updateBanner);
router.delete("/deleteBanner/:bannerId", bannerController.deleteBanner);


module.exports = router;