const express = require("express");
const router = express.Router();
const dealerController = require("../controllers/dealer.controller");
const validate = require("../middlewares/validate");
const {createDealerValidation, updateDealerValidation} = require("../validations/dealer.validation");
const authToken = require("../middlewares/authToken");

router.post("/createDealer", authToken, validate(createDealerValidation), dealerController.createDealer);
router.get("/getDealer", dealerController.fetchDealer);
router.get("/getDealers", dealerController.fetchDealers);
router.get("/getDealersDropdown", dealerController.fetchDealerDropDown);
router.put("/updateDealer/:dealerId", authToken, validate(updateDealerValidation), dealerController.editDealer);
router.put("/deleteDealer/:dealerId", authToken, dealerController.deleteDealer);

module.exports = router;
