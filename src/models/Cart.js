const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");


const Cart = sequelize.define(
  "Cart",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    cart_token: {
      type: DataTypes.UUID,
      allowNull: false,
      unique: true,
    },

    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: "carts",
    timestamps: true,
    underscored: true,
  },
);

module.exports = Cart;
