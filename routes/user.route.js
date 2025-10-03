const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const validate = require("../middlewares/validate");
const {adminValidation, technicianValidation} = require("../validations/user.validation");
const authToken = require("../middlewares/authToken");

router.post("/createAdminUsers", validate(adminValidation), userController.createAdminUsers);
router.post("/createTechnicianUsers", authToken, validate(technicianValidation), userController.createTechnicianUsers);
router.get("/getAllUsers", userController.fetchAllUsers);
module.exports = router;