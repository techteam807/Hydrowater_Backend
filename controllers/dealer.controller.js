const { successResponse, errorResponse } = require("../utils/response");
const dealerService = require("../services/dealer.service");

const createDealer = async (req, res) => {
  try {
    const userId = req.user.userId;
    const  dealerData = req.body;
    const dealer = await dealerService.generateDealer(userId, dealerData);
    return successResponse(res, dealer, "Dealer Created successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message || "Error While Creating Dealer");
  }
};

const fetchDealer = async (req, res) => {
  try {
    const dealerId = req.query.dealerId;
    const dealer = await dealerService.getDealer(dealerId);
    return successResponse(res, dealer, "Dealer Fetched!", 200);
  } catch (error) {
    return errorResponse(res, error.message || "Error While Get Dealer");
  }
}

const fetchDealerDropDown = async (req, res) => {
  try {
    const dealers = await dealerService.dealerDropDown();
    return successResponse(res, dealers, "Dropdown Of Dealers Get!", 200)
  } catch (error) {
    return errorResponse(res, error.message || "Error While Get Dropdown Of Dealers", 500)
  }
}

module.exports = { createDealer, fetchDealer,fetchDealerDropDown };