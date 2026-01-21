const productInstallationService = require("../services/productInstallation.service");
const { successResponse, errorResponse } = require("../utils/response");

const registerProductInstallation = async (req, res) => {
  try {
    const installationData = req.body;
    const userId = req.user.userId;

    const installation = await productInstallationService.registerProductInstallation(installationData, userId);
    return successResponse(
      res,
      installation,
      "Product Installation Registered Successfully"
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Registering Product Installation",
      400
    );
  }
};

const listProductInstallations = async (req, res) => {
  try {
    const filter = req.query || {}; 
    const installations = await productInstallationService.listProductInstallations(filter);
    return successResponse(res, installations.data, "Product Installations Fetched!", 200, installations.pagination);
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Fetching Product Installations",400);
    }
};

const approveInstallation = async (req, res) => {
  try {
    const installationId = req.params.installationId;
    const approvalData = req.body;  
    const installation = await productInstallationService.approveInstallation(installationId, approvalData);
    return successResponse(res, installation, "Installation Approved Successfully", 200);
  } catch (error) {
    return errorResponse(
      res,
        error.message || "Error While Approving Installation",
        400
    );
    }
};

module.exports = { registerProductInstallation, listProductInstallations, approveInstallation };