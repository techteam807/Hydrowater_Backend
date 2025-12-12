const Banner = require("../models/banner.model");
const { successResponse, errorResponse } = require("../utils/response");

const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    return successResponse(res, banners, "Banners retrieved successfully.");
  } catch (error) {
    return errorResponse(
      res,
      error.message || "An error occurred while retrieving banners.",
      400
    );
  }
};

const createBanner = async (req, res) => {
  try {
    const bannerData = req.body;
    const banner = new Banner(bannerData);
    await banner.save();
    return successResponse(res, banner, "Banner created successfully.");
  } catch (error) {
    return errorResponse(
      res,
      error.message || "An error occurred while creating the banner",
      400
    );
  }
};

const updateBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;

    const bannerData = req.body;
    const banner = await Banner.findByIdAndUpdate(bannerId, bannerData, {
      new: true,
      runValidators: true,
    });
    return successResponse(res, banner, "Banner updated successfully.");
  } catch (error) {
    return errorResponse(
      res,
      error.message || "An error occurred while updating the banner.",
      400
    );
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { bannerId } = req.params;
    await Banner.findByIdAndDelete(bannerId);
    return successResponse(res, null, "Banner deleted successfully.");
  } catch (error) {
    return errorResponse(
      res,
      error.message || "An error occurred while deleting the banner."
    );
  }
};

module.exports = { getBanners, createBanner, deleteBanner, updateBanner };
