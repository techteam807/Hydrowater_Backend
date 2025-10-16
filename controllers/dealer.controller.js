const { successResponse, errorResponse } = require("../utils/response");
const dealerService = require("../services/dealer.service");

const createDealer = async (req, res) => {
  try {
    const userId = req.user.userId;
    const dealerData = req.body;
    const dealer = await dealerService.generateDealer(userId, dealerData);
    return successResponse(res, dealer, "Dealer Created successfully", 200);
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Creating Dealer",
      400
    );
  }
};

const fetchDealer = async (req, res) => {
  try {
    const dealerId = req.query.dealerId;
    const dealer = await dealerService.getDealer(dealerId);
    return successResponse(res, dealer, "Dealer Fetched!", 200);
  } catch (error) {
    return errorResponse(res, error.message || "Error While Get Dealer", 400);
  }
};

const fetchDealers = async (req, res) => {
  try {
    const {
      search,
      // city,
      state,
      // country,
      distributorId,
      page,
      limit,
      isActive,
    } = req.query;
    // let filters = {};

    // if (req.query.filters) {
    //   // Example: filters=country:IND,USA;state:GUJ,CAN
    //   const filterPairs = req.query.filters.split(";");
    //   filterPairs.forEach(pair => {
    //     const [key, value] = pair.split("=");
    //     if (key && value) {
    //       if (value.includes(",")) {
    //         filters[key] = { $in: value.split(",") };
    //       } else {
    //         filters[key] = value;
    //       }
    //     }
    //   });
    // }

    const dealers = await dealerService.getDealers({
      search,
      // city,
      state,
      // country,
      distributorId,
      // filters,
      page,
      limit,
      isActive,
    });
    return successResponse(
      res,
      dealers.data,
      "Dealers Fetched!",
      200,
      dealers.pagination
    );
  } catch (error) {
    return errorResponse(res, error.message || "Error While Get Dealers", 400);
  }
};

const fetchDealerDropDown = async (req, res) => {
  try {
    const distributorId = req.query.distributorId;
    const dealers = await dealerService.dealerDropDown(distributorId);
    return successResponse(res, dealers, "Dropdown Of Dealers Get!", 200);
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Get Dropdown Of Dealers",
      400
    );
  }
};

const editDealer = async (req, res) => {
  try {
    const { dealerId } = req.params;
    const dealerData = req.body;
    const result = await dealerService.updateDealer(dealerId, dealerData);
    return successResponse(res, result, "Dealer Update Successfully", 200);
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Updating Dealer",
      400
    );
  }
};

const deleteDealer = async (req, res) => {
  try {
    const { dealerId } = req.params;
    const result = await dealerService.deleteDealer(dealerId);
    return successResponse(res, result, "Dealer Deleted Successfully");
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error while Deleting Dealer",
      400
    );
  }
};

const restoreDealer = async (req, res) => {
  try {
    const { dealerId } = req.params;
    const result = await dealerService.restoreDealer(dealerId);
    return successResponse(res, result, "Dealer Restored Successfully");
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error while Restoring Dealer",
      400
    );
  }
};

module.exports = {
  createDealer,
  fetchDealer,
  fetchDealers,
  fetchDealerDropDown,
  editDealer,
  deleteDealer,
  restoreDealer
};
