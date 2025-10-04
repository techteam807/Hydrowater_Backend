const express = require("express");
const router = express.Router();
const dealerController = require("../controllers/dealer.controller");
const validate = require("../middlewares/validate");
const {createDealerValidation} = require("../validations/dealer.validation");
const authToken = require("../middlewares/authToken");

router.post("/createDealer", authToken, validate(createDealerValidation), dealerController.createDealer);
router.get("/getDealer", dealerController.fetchDealer);
router.get("/getDealers", dealerController.fetchDealers);
router.get("/getDealersDropdown", dealerController.fetchDealerDropDown);


module.exports = router;
