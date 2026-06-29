const { body, query, param } = require("express-validator");

const createProductValidation = [
  body("name")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("Product name is required")
    .isLength({ min: 2, max: 150 })
    .withMessage("Product name must be between 2 and 150 characters"),

  body("description")
    .optional()
    .trim()
    .escape()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ gt: 0 })
    .withMessage("Price must be greater than 0"),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required")
    .isInt({ min: 0 })
    .withMessage("Stock must be 0 or greater"),

  body("image_url")
    .optional({ values: "falsy" })
    .trim()
    .isURL()
    .withMessage("Invalid image URL"),
];

const getProductsValidation = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be greater than 0"),

  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("sortBy")
    .optional()
    .isIn(["name", "price", "stock", "created_at"])
    .withMessage("Invalid sort field"),

  query("sortOrder")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Sort order must be asc or desc"),
];

const productIdValidation = [
    param("id")
        .isInt({ min: 1 })
        .withMessage("Invalid product id"),
];


const updateProductValidation = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 150 })
        .withMessage("Product name must be between 2 and 150 characters"),

    body("description")
        .optional({ values: "falsy" })
        .trim()
        .isLength({ max: 1000 })
        .withMessage("Description cannot exceed 1000 characters"),

    body("price")
        .optional()
        .isFloat({ gt: 0 })
        .withMessage("Price must be greater than 0"),

    body("stock")
        .optional()
        .isInt({ min: 0 })
        .withMessage("Stock must be 0 or greater"),

    body("image_url")
        .optional({ values: "falsy" })
        .trim()
        .isURL()
        .withMessage("Invalid image URL"),
];


module.exports = {
  createProductValidation,
  getProductsValidation,
  productIdValidation,
  updateProductValidation
};
