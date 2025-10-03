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
    const { userType } = req.query;
    const users = await userService.getAllUsers(userType);
    return successResponse(res, users, "Users Fetched!", 200);
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Fetching Users",
      500
    );
  }
};

module.exports = { createAdminUsers, createTechnicianUsers,fetchAllUsers };
