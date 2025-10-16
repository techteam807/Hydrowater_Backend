const installationService = require('../services/installation.service');
const { errorResponse, successResponse } = require('../utils/response');

const registerInstallation = async (req, res) => {
  try {
    const installation = await installationService.registerInstallation(req.body);
    return successResponse(
      res,
      installation,
      "Installation Registered Successfully"
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Registering Installation",
      400
    );
  }
};

const listInstallations = async (req, res) => {
  try {
    const installations = await installationService.listInstallations();
    return successResponse(
      res,
      installations,
      "Installations Fetched Successfully"
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Fetching Installations",
      400
    );
  }
};

module.exports = { registerInstallation, listInstallations };