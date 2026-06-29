const { body, param } = require("express-validator");

const addToCartValidation = [
    body("product_id")
        .notEmpty()
        .withMessage("Product id is required")
        .isInt({ min: 1 })
        .withMessage("Invalid product id"),

    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Quantity must be greater than 0"),
];


const updateCartItemValidation = [
    param("productId")
        .isInt({ min: 1 })
        .withMessage("Invalid product id"),

    body("quantity")
        .notEmpty()
        .withMessage("Quantity is required")
        .isInt({ min: 1 })
        .withMessage("Quantity must be greater than 0"),
];


const CartProductIdValidation = [
    param("productId")
        .isInt({ min: 1 })
        .withMessage("Invalid product id"),
];

module.exports = {
    addToCartValidation,
    updateCartItemValidation,
    CartProductIdValidation
};
