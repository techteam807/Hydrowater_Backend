const productService = require('../services/product.service');
const { errorResponse, successResponse } = require('../utils/response');

const createProduct = async (req, res) => {
  try {
    const product = await productService.createIfNotExists(req.body);
return successResponse(
      res,
      product,
      "Product Created Successfully"
    );
  } catch (error) {
   return errorResponse(
      res,
      error.message || "Error While Creating Product",
      400,
      error
    );
  }
};

const getProduct = async (req, res) => {
  try {
    const product = await productService.findByProductId(req.params.productId);
    if (!product) return errorResponse(res, "Product Not Found", 404);
    return successResponse(
      res,
      product,
      "Product Fetched Successfully"
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Fetching Product",
      400,
      error
    );
  }
};

const listProducts = async (req, res) => {
  try {
    const products = await productService.listProducts();
   return successResponse(
      res,
      products,
      "Products Fetched Successfully"
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message || "Error While Fetching Products",
      400,
      error
    );
  }
};

module.exports = { createProduct, getProduct, listProducts };