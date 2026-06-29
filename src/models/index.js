const Cart = require("./Cart");
const CartItem = require("./CartItem");
const Product = require("./Product");
const User = require("./User");


/** User  assoction with  Cart  */
User.hasMany(Cart, {
    foreignKey: "user_id",
    as: "carts",
});

Cart.belongsTo(User, {
    foreignKey: "user_id",
    as: "user",
});


/** Cart assoction with CartItem */

Cart.hasMany(CartItem, {
    foreignKey: "cart_id",
    as: "items",
    onDelete: "CASCADE",
});

CartItem.belongsTo(Cart, {
    foreignKey: "cart_id",
    as: "cart",
});

/** Product assoction with  CartItem   */

Product.hasMany(CartItem, {
    foreignKey: "product_id",
    as: "cartItems",
});

CartItem.belongsTo(Product, {
    foreignKey: "product_id",
    as: "product",
});
