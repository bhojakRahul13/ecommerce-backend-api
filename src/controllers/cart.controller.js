const cartService = require("../services/cart.service");

const addToCart = async (req, res) => {
  const result = await cartService.addToCart(
    req.headers["x-cart-token"], // we used for repeated update cart
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: "Product added to cart",
    data: result,
  });
};

const getCart = async (req, res) => {
  const cart = await cartService.getCart(req.headers["x-cart-token"]);

  return res.status(200).json({
    success: true,
    message: "Cart fetched successfully",
    data: cart,
  });
};

const updateCartItem = async (req, res) => {
  const cartItem = await cartService.updateCartItem(
    req.headers["x-cart-token"],
    req.params.productId,
    req.body.quantity,
  );

  return res.status(200).json({
    success: true,
    message: "Cart updated successfully",
    data: cartItem,
  });
};

const deleteCartItem = async (req, res) => {
  await cartService.deleteCartItem(
    req.headers["x-cart-token"],
    req.params.productId,
  );

  return res.status(200).json({
    success: true,
    message: "Product removed from cart",
  });
};


const checkout = async (req, res) => {

    const result = await cartService.checkout(
        req.user.id,
        req.headers["x-cart-token"]
    );

    return res.status(200).json({
        success: true,
        message: "Checkout session created",
        data: result,
    });

};
module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
  checkout
};
