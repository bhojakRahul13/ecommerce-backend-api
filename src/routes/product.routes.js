const express = require("express");

const router = express.Router();

const validate = require("../middleware/validate.middleware");
const productController = require("../controllers/product.controller");
const {
  createProductValidation,
  getProductsValidation,
  productIdValidation,
  updateProductValidation,
} = require("../validators/product.validator");
const auth = require("../middleware/auth.middleware");

router.post(
  "/",
  auth(["admin"]),
  createProductValidation,
  validate,
  productController.createProduct,
);

router.get("/", getProductsValidation, validate, productController.getProducts);

router.get(
  "/:id",
  productIdValidation,
  validate,
  productController.getProductById,
);

router.patch(
  "/:id",
  auth(["admin"]),
  productIdValidation,
  updateProductValidation,
  validate,
  productController.updateProduct,
);

router.delete(
  "/:id",
  auth(["admin"]),
  productIdValidation,
  validate,
  productController.deleteProduct,
);
module.exports = router;
