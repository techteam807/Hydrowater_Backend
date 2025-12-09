const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const validate = require("../middlewares/validate");
const {adminValidation, technicianValidation, updateTechnicianValidation} = require("../validations/user.validation");
const authToken = require("../middlewares/authToken");

router.post("/createAdminUsers", validate(adminValidation), userController.createAdminUsers);
router.post("/createTechnicianUsers", authToken, validate(technicianValidation), userController.createTechnicianUsers);
router.get("/getAllUsers", userController.fetchAllUsers);
router.get("/getTechnicians", userController.fetchTechnicians);
router.put("/updateTechnician/:technicianId", authToken, validate(updateTechnicianValidation), userController.editTechnician);
router.put("/deleteTechnician/:technicianId", authToken, userController.deleteTechnician);
router.put("/restoreTechnician/:technicianId", authToken, userController.restoreTechnician);
router.get("/userCount", userController.fetchCountOfUsers);
router.get("/getTechnicianDropDown", userController.fetchTechniciansDropDown);

module.exports = router;