const { successResponse, errorResponse } = require("../utils/response");
const distributorService = require("../services/distributor.service");

const CreateDistributor = async (req, res) => {
  try {
    const userId = req.user.userId;

    const distributorData = req.body;

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
    return errorResponse(
      res,
      error.message || "Error While Creating Distributor",
      400
    );
  }
};

const fetchDistributor = async (req, res) => {
  try {
    const distributorId = req.query.distributorId;
    const distributor = await distributorService.getDistributor(distributorId);
    return successResponse(res, distributor, "Distributor Fetched!", 200);
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Get Distributor",
      400
    );
  }
};

const fetchDistributors = async (req, res) => {
  try {
    const { search, state, page, limit, isActive } = req.query;
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

    const distributors = await distributorService.getDistributors({
      search,
      // city,
      state,
      // country,
      // filters,
      page,
      limit,
      isActive,
    });
    return successResponse(
      res,
      distributors.data,
      "Distributors Fetched!",
      200,
      distributors.pagination
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Get Distributors",
      400
    );
  }
};

const fetchDistributorDropDown = async (req, res) => {
  try {
    const distributors = await distributorService.distributorDropDown();
    return successResponse(
      res,
      distributors,
      "Dropdown Of Distributors Get!",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Get Dropdown Of Distributors",
      400
    );
  }
};

const editDistributor = async (req, res) => {
  try {
    const { distributorId } = req.params;
    const distributorData = req.body;
    const result = await distributorService.distributorUpdate(
      distributorId,
      distributorData
    );
    return successResponse(res, result, "Distributor Update Successfully", 200);
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Updating Distributor",
      400
    );
  }
};

const deleteDistributor = async (req, res) => {
  try {
    const { distributorId } = req.params;
    const result = await distributorService.deleteDistributor(distributorId);
    return successResponse(res, result, "Distributor Deleted Successfully");
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error while Deleting Distributor",
      400
    );
  }
};

const restoreDistributor = async (req, res) => {
  try {
    const { distributorId } = req.params;
    const result = await distributorService.restoreDistributor(distributorId);
    return successResponse(res, result, "Distributor Restored Successfully");
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error while Restoring Distributor",
      400
    );
  }
};

module.exports = {
  CreateDistributor,
  fetchDistributor,
  fetchDistributors,
  fetchDistributorDropDown,
  editDistributor,
  deleteDistributor,
  restoreDistributor
};
