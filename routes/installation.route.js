const express = require("express");
const router = express.Router();
const installationController = require("../controllers/installation.controller");

router.post("/createInstallation", installationController.createInstallation);
router.get("getInstallations", installationController.getInstallations);

module.exports = router;
