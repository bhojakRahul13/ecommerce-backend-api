const crypto = require("crypto");

const Cart = require("../models/Cart");
const CartItem = require("../models/CartItem");
const Product = require("../models/Product");

const stripe = require("../config/stripe");

const addToCart = async (cartToken, { product_id, quantity }) => {
  /** Find existing cart */

  let cart = cartToken
    ? await Cart.findOne({
        where: { cart_token: cartToken },
      })
    : null;

  if (!cart) {
    cart = await Cart.create({
      cart_token: crypto.randomUUID(),
    });
  }

  /** Check product exists */
  const product = await Product.findByPk(product_id);

  if (!product) {
    const error = new Error("Product not found");
    error.statusCode = 404;
    throw error;
  }

  /** check Stock is there or not  */
  if (quantity > product.stock) {
    const error = new Error("Insufficient stock");
    error.statusCode = 400;
    throw error;
  }

  /** Product already exists or not */
  let cartItem = await CartItem.findOne({
    where: {
      cart_id: cart.id,
      product_id,
    },
  });

  if (cartItem) {
    const totalQuantity = cartItem.quantity + quantity;

    if (totalQuantity > product.stock) {
      const error = new Error("Insufficient stock");
      error.statusCode = 400;
      throw error;
    }

    cartItem.quantity = totalQuantity;

    await cartItem.save();
  } else {
    await CartItem.create({
      cart_id: cart.id,
      product_id,
      quantity,
    });
  }

  /**  updated cart */
  const updatedCart = await Cart.findOne({
    where: {
      id: cart.id,
    },
    include: [
      {
        model: CartItem,
        as: "items",
        attributes: ["id", "quantity"],
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price", "image_url"],
          },
        ],
      },
    ],
  });

  return {
    cart_token: cart.cart_token,
    cart: updatedCart,
  };
};

const getCart = async (cartToken) => {
  if (!cartToken) {
    const error = new Error("Cart token is required");
    error.statusCode = 400;
    throw error;
  }

  const cart = await Cart.findOne({
    where: {
      cart_token: cartToken,
    },
    include: [
      {
        model: CartItem,
        as: "items",
        attributes: ["id", "quantity"],
        include: [
          {
            model: Product,
            as: "product",
            attributes: ["id", "name", "price", "image_url", "stock"],
          },
        ],
      },
    ],
  });

  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  let totalItems = 0;
  let subtotal = 0;

  for (const item of cart.items) {
    totalItems += item.quantity;
    subtotal += Number(item.product.price) * item.quantity;
  }

  return {
    cart_token: cart.cart_token,
    total_items: totalItems,
    subtotal,
    discount: 0,
    tax: 0,
    grand_total: subtotal,
    items: cart.items,
  };
};

const updateCartItem = async (cartToken, productId, quantity) => {
  if (!cartToken) {
    const error = new Error("Cart token is required");
    error.statusCode = 400;
    throw error;
  }

  const cart = await Cart.findOne({
    where: {
      cart_token: cartToken,
    },
  });

  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  const cartItem = await CartItem.findOne({
    where: {
      cart_id: cart.id,
      product_id: productId,
    },
    include: [
      {
        model: Product,
        as: "product",
      },
    ],
  });

  if (!cartItem) {
    const error = new Error("Product not found in cart");
    error.statusCode = 404;
    throw error;
  }

  if (quantity > cartItem.product.stock) {
    const error = new Error("Insufficient stock");
    error.statusCode = 400;
    throw error;
  }

  cartItem.quantity = quantity;

  await cartItem.save();

  return cartItem;
};

const deleteCartItem = async (cartToken, productId) => {
  if (!cartToken) {
    const error = new Error("Cart token is required");
    error.statusCode = 400;
    throw error;
  }

  const cart = await Cart.findOne({
    where: {
      cart_token: cartToken,
    },
  });

  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  const cartItem = await CartItem.findOne({
    where: {
      cart_id: cart.id,
      product_id: productId,
    },
  });

  if (!cartItem) {
    const error = new Error("Product not found in cart");
    error.statusCode = 404;
    throw error;
  }

  await cartItem.destroy();
};

const checkout = async (userId, cartToken) => {
  if (!cartToken) {
    const error = new Error("Cart token is required");
    error.statusCode = 400;
    throw error;
  }

  const cart = await Cart.findOne({
    where: {
      cart_token: cartToken,
    },
    include: [
      {
        model: CartItem,
        as: "items",
        include: [
          {
            model: Product,
            as: "product",
          },
        ],
      },
    ],
  });

  if (!cart) {
    const error = new Error("Cart not found");
    error.statusCode = 404;
    throw error;
  }

  if (!cart.items.length) {
    const error = new Error("Cart is empty");
    error.statusCode = 400;
    throw error;
  }

  // Validate stock
  for (const item of cart.items) {
    if (item.quantity > item.product.stock) {
      const error = new Error(`${item.product.name} is out of stock`);

      error.statusCode = 400;

      throw error;
    }
  }

  // Attach cart to logged in user
  cart.user_id = userId;

  await cart.save();

  const line_items = cart.items.map((item) => ({
    price_data: {
      currency: "usd",
      product_data: {
        name: item.product.name,
      },
      unit_amount: Math.round(Number(item.product.price) * 100),
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],

    mode: "payment",

    line_items,

    success_url: `${process.env.CLIENT_URL}/success`,

    cancel_url: `${process.env.CLIENT_URL}/cancel`,
  });

  return {
    checkout_url: session.url,
  };
};

module.exports = {
  addToCart,
  getCart,
  updateCartItem,
  deleteCartItem,
  checkout
};
