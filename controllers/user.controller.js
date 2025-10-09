const { successResponse, errorResponse } = require("../utils/response");
const userService = require("../services/user.service");

const createAdminUsers = async (req, res) => {
  try {
    const { name, email, password, userRole } = req.body;
    const user = await userService.genrateAdminUsers(
      name,
      email,
      password,
      userRole
    );
    return successResponse(res, user, "User created successfully", 200);
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Creating A User!",
      500
    );
  }
};

const createTechnicianUsers = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { name, mobile_number, userRole, userParentId, userParentType } =
      req.body;
    const user = await userService.genrateTechnicianUsers(
      name,
      mobile_number,
      userRole,
      userParentId,
      userParentType,
      userId
    );
    return successResponse(res, user, "User created successfully", 200);
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Creating A User!",
      500
    );
  }
};

const fetchAllUsers = async (req, res) => {
  try {
    const { userType, search, userParentType, userParentId, page, limit } =
      req.query;
    const users = await userService.getAllUsers({
      userType,
      search,
      userParentType,
      userParentId,
      page,
      limit,
    });
    return successResponse(
      res,
      users.data,
      "Users Fetched!",
      200,
      users.pagination
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Fetching Users",
      500
    );
  }
};

const fetchTechnicians = async (req, res) => {
  try {
    const { search, userParentType, userParentId, page, limit } =
      req.query;
    const users = await userService.getTechnicians({
      search,
      userParentType,
      userParentId,
      page,
      limit,
    });
    return successResponse(
      res,
      users.data,
      "Technicians Fetched!",
      200,
      users.pagination
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Fetching Technicians",
      500
    );
  }
};

const editTechnician = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const userData = req.body;
    const result = await userService.updateTechnician(technicianId, userData);
    return successResponse(res, result, "Technicaian Update successfully");
  } catch (error) {
    return errorResponse(res, error.message || "Error While Updating Technicaian", 500);
  }
};

const deleteTechnician = async (req, res) => {
  try {
    const { technicianId } = req.params;
    const result = await userService.deleteTechnician(technicianId);
    return successResponse(res, result, "Technician Deleted Successfully");
  } catch (error) {
    return errorResponse(res, error.message || "Error while Deleting Technician");
  }
};

module.exports = { createAdminUsers, createTechnicianUsers, fetchAllUsers, editTechnician, deleteTechnician, fetchTechnicians };
