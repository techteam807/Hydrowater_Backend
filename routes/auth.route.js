const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {loginAdminValidation,loginTechnicianValidation, verifyOtpValidation} = require("../validations/auth.validation");
const validate = require("../middlewares/validate");

router.post("/loginAdmin", validate(loginAdminValidation), authController.adminLogin);
router.post("/loginTechnician", validate(loginTechnicianValidation), authController.technicianLogin);
router.post("/verifyOtp", validate(verifyOtpValidation), authController.verifyOtp);
module.exports = router;