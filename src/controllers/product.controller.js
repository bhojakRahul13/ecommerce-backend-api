const productService = require("../services/product.service");

const createProduct = async (req, res) => {
  const product = await productService.createProduct(req.body);

  return res.status(201).json({
    success: true,
    message: "Product created successfully",
    data: product,
  });
};

const getProducts = async (req, res) => {
  const result = await productService.getProducts(req.query);

  return res.status(200).json({
    success: true,
    message: "Products fetched successfully",
    data: result,
  });
};

const getProductById = async (req, res) => {
  const product = await productService.getProductById(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Product fetched successfully",
    data: product,
  });
};

const updateProduct = async (req, res) => {

  const product = await productService.updateProduct(req.params.id, req.body);

  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: product,
  });
};

const deleteProduct = async (req, res) => {
  await productService.deleteProduct(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Product deleted successfully",
  });
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
