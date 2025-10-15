const { successResponse, errorResponse } = require("../utils/response");
const productService = require("../services/product.service");

const verifyProduct = async (req, res) => {
  try {
    const { qr } = req.params;
    const product = await productService.findByProductId(qr);
    return successResponse(res, product, "Product Verify Successfully", 200);
  } catch (error) {
    return errorResponse(res, error.message || "Error While Verifying Product", 500);
  }
};

module.exports = { verifyProduct };