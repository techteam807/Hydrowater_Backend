const Version = require("../models/version.model");
const { successResponse, errorResponse } = require("../utils/response");

const addVersion = async (req, res) => {
  try {
    const { versionNumber } = req.body;
    const version = new Version({ version: versionNumber });
    await version.save();

    return successResponse(
      res,
      version,
      "Version code added successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Error while adding version code",
      400
    );
  }
};

const editVersion = async (req, res) => {
  try {
    const { versionNumber } = req.body;

    const version = await Version.findOneAndUpdate(
      {},
      { version: versionNumber },
      { new: true, upsert: true }
    );

    return successResponse(
      res,
      version,
      "Version code updated successfully",
      200
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      "Error while updating version code",
      400
    );
  }
};


const getVersion = async (req, res) => {
  try {
    const version = await Version.find();
    return successResponse(res, version, "Version code retrieved successfully", 200);
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error while retrieving version code",
      400
    );
  }
};

module.exports = {
  addVersion,
  editVersion,
  getVersion,
};
