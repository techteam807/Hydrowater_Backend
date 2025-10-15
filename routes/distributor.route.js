const express = require("express");
const router = express.Router();
const distributorController = require("../controllers/distributor.controller");
const validate = require("../middlewares/validate");
const {createDistributorValidation,updateDistributorValidation} = require("../validations/distributor.validation");
const authToken = require("../middlewares/authToken");

router.post("/createDistributor", authToken, validate(createDistributorValidation), distributorController.CreateDistributor);
router.get("/getDistributor", distributorController.fetchDistributor);
router.get("/getDistributors", distributorController.fetchDistributors);
router.get("/getDistributorsDropdown", distributorController.fetchDistributorDropDown);
router.put("/updateDistributor/:distributorId", authToken, validate(updateDistributorValidation), distributorController.editDistributor);
router.put("/deleteDistributor/:distributorId", authToken, distributorController.deleteDistributor);
router.put("/restoreDistributor/:distributorId", authToken, distributorController.restoreDistributor);

module.exports = router;
