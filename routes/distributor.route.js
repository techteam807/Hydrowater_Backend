const express = require("express");
const router = express.Router();
const distributorController = require("../controllers/distributor.controller");
const validate = require("../middlewares/validate");
const {createDistributorValidation} = require("../validations/distributor.validation");
const authToken = require("../middlewares/authToken");

router.post("/createDistributor", authToken, validate(createDistributorValidation), distributorController.CreateDistributor);
router.get("/getDistributor", distributorController.fetchDistributor);
router.get("/getDistributors", distributorController.fetchDistributorDropDown);

module.exports = router;
