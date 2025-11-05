const express = require("express");
const router = express.Router();
const productInstallationController = require("../controllers/productInstallation.controller");
const validate = require("../middlewares/validate");
const { registerProductInstallationValidation} = require("../validations/productInstallation.validation");
const authToken = require("../middlewares/authToken");

router.post("/registerProductInstallation", validate(registerProductInstallationValidation), productInstallationController.registerProductInstallation);
router.get("/listProductInstallations", authToken, productInstallationController.listProductInstallations);
router.put("/approveInstallation/:installationId", productInstallationController.approveInstallation);

module.exports = router;

