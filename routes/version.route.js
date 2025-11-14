const express = require("express");
const router = express.Router();
const versionController = require("../controllers/version.controller");

router.post("/addVersioncode", versionController.addVersion);
router.put("/editVersioncode", versionController.editVersion);
router.get("/getVersioncode", versionController.getVersion);


module.exports = router;