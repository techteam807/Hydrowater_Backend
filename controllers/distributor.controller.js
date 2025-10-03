const { successResponse, errorResponse } = require("../utils/response");
const distributorService = require("../services/distributor.service");

const CreateDistributor = async (req, res) => {
  try {
    const userId = req.user.userId;

    const distributorData  = req.body;
    
    const distributor = await distributorService.generateDistributor(
      userId,
      distributorData
    );
    return successResponse(
      res,
      distributor,
      "Distributor Created Successfully"
    );
  } catch (error) {
    console.log("er:",error);
    
    return errorResponse(
      res,
      error.message || "Error While Creating Distributor"
    );
  }
};

const fetchDistributor = async (req, res) => {
  try {
    const distributorId = req.query.distributorId;
    const distributor = await distributorService.getDistributor(distributorId);
    return successResponse(res, distributor, "Distributor Fetched!", 200)
  } catch (error) {
    return errorResponse(res, error.message || "Error While Get Distributor", 500)
  }
}

const fetchDistributorDropDown = async (req, res) => {
  try {
    const distributors = await distributorService.distributorDropDown();
    return successResponse(res, distributors, "Dropdown Of Distributors Get!", 200)
  } catch (error) {
    return errorResponse(res, error.message || "Error While Get Dropdown Of Distributors", 500)
  }
}

module.exports = { CreateDistributor, fetchDistributor, fetchDistributorDropDown };
