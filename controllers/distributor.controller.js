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
      error.message || "Error While Creating Distributor"
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
      500
    );
  }
};

const fetchDistributors = async (req, res) => {
  try {
    const { search, city, state, country, page, limit } = req.query;
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
      city,
      state,
      country,
      // filters,
      page,
      limit,
    });
    return successResponse(
      res,
      distributors.data,
      "Distributors Fetched!",
      200,
      distributors.pagination
    );
  } catch (error) {
    return errorResponse(res, error.message || "Error While Get Distributors");
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
      500
    );
  }
};

module.exports = {
  CreateDistributor,
  fetchDistributor,
  fetchDistributors,
  fetchDistributorDropDown,
};
