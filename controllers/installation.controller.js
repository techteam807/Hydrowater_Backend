const { successResponse, errorResponse } = require("../utils/response");
const installationService = require("../services/installation.service");

const createInstallation = async (req, res) => {
  try {
    const installationData = req.boy;
    const result = await installationService.registerInstallation(installationData);
    return successResponse(res, result, "Installation Successfully", 200);
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Cretaing Installation",
      500,
      error
    );
  }
};

const getInstallations = async (req, res) => {
  try {
    const installations = await installationService.listInstallations();
    return successResponse(
      res,
      installations,
      "installations get Successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While get Installation",
      500,
      error
    );
  }
};

module.exports = { createInstallation, getInstallations };
