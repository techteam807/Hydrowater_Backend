const express = require("express");
const router = express.Router();
const productInstallationController = require("../controllers/productInstallation.controller");
const validate = require("../middlewares/validate");
const { registerProductInstallationValidation} = require("../validations/productInstallation.validation");
const authToken = require("../middlewares/authToken");

router.post("/registerProductInstallation", authToken, validate(registerProductInstallationValidation), productInstallationController.registerProductInstallation);
router.get("/listProductInstallations", authToken, productInstallationController.listProductInstallations);
router.put("/approveInstallation/:installationId", productInstallationController.approveInstallation);
router.post("/sendOtp", productInstallationController.sendOtp);
router.post("/verifyOtp", productInstallationController.verifyOtp);

module.exports = router;