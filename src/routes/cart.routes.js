const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cart.controller");
const validate = require("../middleware/validate.middleware");
const auth = require("../middleware/auth.middleware");

const {
  addToCartValidation,
  updateCartItemValidation,
  CartProductIdValidation,
} = require("../validators/cart.validator");

 
/*** ROUTING */


router.post("/items", addToCartValidation, validate, cartController.addToCart);

router.get("/", cartController.getCart);

router.patch(
  "/items/:productId",
  updateCartItemValidation,
  validate,
  cartController.updateCartItem,
);

router.delete(
  "/items/:productId",
  CartProductIdValidation,
  validate,
  cartController.deleteCartItem,
);

router.post("/checkout", auth(["customer", "admin"]), cartController.checkout);


module.exports = router;
